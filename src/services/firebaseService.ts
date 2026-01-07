import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { onAuthStateChanged, updateEmail, updateProfile, type User } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { auth, db } from '../firebase';

interface EmailSubmissionResult {
  success: boolean;
  message: string;
  alreadyExists: boolean;
}

interface SignupResult {
  success: boolean;
  message: string;
  alreadyExists: boolean;
  verificationLink?: string;
  userId?: string;
}

export interface Reward {
  id: string;
  rewardId?: string;
  availableCoupons: string | number;
  brandName: string;
  deductPoints: number;
  dislikeCount: number;
  fullImage: string;
  fullImageGreyed: string;
  howToClaim: string[];
  likeCount: number;
  maxPerUser: number;
  previewImage: string;
  previewImageGreyed: string;
  rewardDetails: string[];
  rewardSubtitle: string;
  rewardTitle: string;
  rewardType: string;
  status: string;
  termsAndConditions: string[] | string;
  usefulnessScore: number;
  validFrom: string;
  validTo: string;
  createdAt?: string;
  updatedAt?: string;
  maxDiscountAmount?: number | null;
  discountAmount?: number | null;
  discountPercent?: number | null;
  minPurchaseAmount?: number | null;
  categories?: string[];
  totalCoupons?: number;
  carbonContribution?: number;
  orgId?: string | null;
  partnerId?: string | null;
  createdBy?: string;
}

export interface PaginatedRewardsResult {
  rewards: Reward[];
  hasMore: boolean;
  total?: number;
  offset?: number;
}

export interface OrganizationProfile {
  id: string;
  organizationName: string;
  ownerUserId: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  userId: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  grantedAt: string;
  grantedByUserId: string;
  grantedByEmail: string;
}

const FORCED_USER_DISPLAY_NAME = 'manikandan.a';
const FORCED_USER_EMAIL = 'manikandana.consultant@puviyan.com';

export const updateCurrentUserIdentity = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, message: 'No authenticated user found' };
    }

    if (user.displayName !== FORCED_USER_DISPLAY_NAME) {
      await updateProfile(user, { displayName: FORCED_USER_DISPLAY_NAME });
    }

    if (user.email !== FORCED_USER_EMAIL) {
      await updateEmail(user, FORCED_USER_EMAIL);
    }

    return { success: true, message: 'User identity updated successfully' };
  } catch (error: any) {
    // updateEmail commonly fails with auth/requires-recent-login
    const message =
      error?.code === 'auth/requires-recent-login'
        ? 'Updating email requires recent login. Please sign in again and retry.'
        : 'Failed to update user identity';

    console.error('Error updating user identity:', error);
    return { success: false, message };
  }
};

const waitForCurrentUser = async (timeoutMs: number = 3000): Promise<User | null> => {
  const existing = auth.currentUser;
  if (existing) return existing;

  return await new Promise((resolve) => {
    const timeoutId = window.setTimeout(() => {
      unsubscribe();
      resolve(auth.currentUser);
    }, timeoutMs);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      window.clearTimeout(timeoutId);
      unsubscribe();
      resolve(user);
    });
  });
};

export interface OrganizationAuditEntry {
  id: string;
  action: 'ORG_NAME_UPDATED' | 'ACCESS_GRANTED' | 'ACCESS_REVOKED' | 'ROLE_UPDATED';
  actorUserId: string;
  actorEmail: string;
  targetUserId?: string;
  targetEmail?: string;
  details?: string;
  createdAt: string;
}

const organizationsCollection = 'organizations';

export const getOrCreateOrganizationProfile = async (
  ownerUserId: string,
  ownerEmail: string
): Promise<{ success: boolean; message: string; profile?: OrganizationProfile }> => {
  try {
    const orgRef = doc(db, organizationsCollection, ownerUserId);
    const orgSnap = await getDoc(orgRef);

    const now = new Date().toISOString();

    if (!orgSnap.exists()) {
      const profile: Omit<OrganizationProfile, 'id'> = {
        organizationName: '',
        ownerUserId,
        ownerEmail: ownerEmail.trim(),
        createdAt: now,
        updatedAt: now
      };
      await setDoc(orgRef, profile);
      return { success: true, message: 'Organization profile created.', profile: { id: ownerUserId, ...profile } };
    }

    const data = orgSnap.data() as Omit<OrganizationProfile, 'id'>;
    return { success: true, message: 'Organization profile loaded.', profile: { id: ownerUserId, ...data } };
  } catch (error) {
    console.error('Error loading organization profile:', error);
    return { success: false, message: 'Failed to load organization profile.' };
  }
};

export const updateOrganizationName = async (
  orgId: string,
  organizationName: string,
  actor: { userId: string; email: string }
): Promise<{ success: boolean; message: string }> => {
  try {
    const now = new Date().toISOString();
    const orgRef = doc(db, organizationsCollection, orgId);

    await updateDoc(orgRef, {
      organizationName: organizationName.trim(),
      updatedAt: now
    });

    await addDoc(collection(db, organizationsCollection, orgId, 'audit_log'), {
      action: 'ORG_NAME_UPDATED',
      actorUserId: actor.userId,
      actorEmail: actor.email.trim(),
      details: `Organization name updated to: ${organizationName.trim()}`,
      createdAt: now
    });

    return { success: true, message: 'Organization name updated.' };
  } catch (error) {
    console.error('Error updating organization name:', error);
    return { success: false, message: 'Failed to update organization name.' };
  }
};

export const resolveUserIdByEmail = async (email: string): Promise<{ success: boolean; message: string; userId?: string }> => {
  try {
    const trimmedEmail = email.trim();
    const emailQuery = query(collection(db, 'org_login_details'), where('email', '==', trimmedEmail));
    const querySnapshot = await getDocs(emailQuery);
    if (querySnapshot.empty) {
      return { success: false, message: 'Email not found in our system.' };
    }
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data() as { userId?: string };
    if (!userData.userId) {
      return { success: false, message: 'UserId missing for this user.' };
    }
    return { success: true, message: 'User found.', userId: userData.userId };
  } catch (error) {
    console.error('Error resolving userId by email:', error);
    return { success: false, message: 'Failed to resolve user.' };
  }
};

export const grantOrganizationAccess = async (
  orgId: string,
  targetEmail: string,
  role: 'admin' | 'member' | 'viewer',
  actor: { userId: string; email: string }
): Promise<{ success: boolean; message: string }> => {
  try {
    const trimmedEmail = targetEmail.trim();
    const userLookup = await resolveUserIdByEmail(trimmedEmail);
    if (!userLookup.success || !userLookup.userId) {
      return { success: false, message: userLookup.message };
    }

    const now = new Date().toISOString();
    const member: OrganizationMember = {
      userId: userLookup.userId,
      email: trimmedEmail,
      role,
      grantedAt: now,
      grantedByUserId: actor.userId,
      grantedByEmail: actor.email.trim()
    };

    await setDoc(doc(db, organizationsCollection, orgId, 'members', userLookup.userId), member, { merge: true });

    await addDoc(collection(db, organizationsCollection, orgId, 'audit_log'), {
      action: 'ACCESS_GRANTED',
      actorUserId: actor.userId,
      actorEmail: actor.email.trim(),
      targetUserId: userLookup.userId,
      targetEmail: trimmedEmail,
      details: `Granted ${role} access to ${trimmedEmail}`,
      createdAt: now
    });

    return { success: true, message: 'Access granted.' };
  } catch (error) {
    console.error('Error granting organization access:', error);
    return { success: false, message: 'Failed to grant access.' };
  }
};

export const fetchOrganizationMembers = async (orgId: string): Promise<{ success: boolean; message: string; members: OrganizationMember[] }> => {
  try {
    const membersQuery = query(collection(db, organizationsCollection, orgId, 'members'), orderBy('grantedAt', 'desc'));
    const querySnapshot = await getDocs(membersQuery);
    const members = querySnapshot.docs.map(d => d.data() as OrganizationMember);
    return { success: true, message: 'Members loaded.', members };
  } catch (error) {
    console.error('Error fetching organization members:', error);
    return { success: false, message: 'Failed to load members.', members: [] };
  }
};

export const fetchOrganizationAuditLog = async (
  orgId: string,
  pageSize: number = 25
): Promise<{ success: boolean; message: string; entries: OrganizationAuditEntry[] }> => {
  try {
    const auditQuery = query(
      collection(db, organizationsCollection, orgId, 'audit_log'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    const querySnapshot = await getDocs(auditQuery);
    const entries = querySnapshot.docs.map(d => ({ id: d.id, ...(d.data() as Omit<OrganizationAuditEntry, 'id'>) }));
    return { success: true, message: 'Audit history loaded.', entries };
  } catch (error) {
    console.error('Error fetching audit history:', error);
    return { success: false, message: 'Failed to load history.', entries: [] };
  }
};

/**
 * Submits an email to the user_notifications collection
 * @param email - The email address to submit
 * @returns Result object with success status and message
 */
export const submitEmail = async (email: string): Promise<EmailSubmissionResult> => {
  try {
    const trimmedEmail = email.trim();

    // Check if email already exists
    const emailQuery = query(
      collection(db, 'user_notifications'),
      where('email', '==', trimmedEmail)
    );
    const querySnapshot = await getDocs(emailQuery);

    if (!querySnapshot.empty) {
      // Email already exists
      return {
        success: true,
        message: 'Awesome! You are already in the list.',
        alreadyExists: true
      };
    }

    // Store email in Firebase Firestore
    const currentDateTime = new Date().toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    await addDoc(collection(db, 'user_notifications'), {
      appType: 'IamPuviyan',
      email: trimmedEmail,
      dateTime: currentDateTime
    });

    return {
      success: true,
      message: 'Awesome! You are now first in the list.',
      alreadyExists: false
    };
  } catch (error) {
    console.error('Error saving email:', error);
    return {
      success: false,
      message: 'Oops! Something went wrong. Please try again.',
      alreadyExists: false
    };
  }
};

/**
 * Stores user signup data in org_login_details collection
 * @param email - User's email address
 * @param password - User's password
 * @param fullName - User's full name
 * @returns Result object with success status and message
 */
export const storeUserSignup = async (email: string, password: string, fullName: string = ''): Promise<SignupResult> => {
  try {
    const trimmedEmail = email.trim();
    const userId = uuidv4();

    // Check if email already exists in org_login_details
    const emailQuery = query(
      collection(db, 'org_login_details'),
      where('email', '==', trimmedEmail)
    );
    const querySnapshot = await getDocs(emailQuery);

    if (!querySnapshot.empty) {
      // Email already exists
      return {
        success: false,
        message: 'An account with this email already exists.',
        alreadyExists: true
      };
    }

    // Generate verification link
    const verificationLink = `https://iam-puviyan-web.vercel.app/verify-email?userId=${userId}&email=${encodeURIComponent(trimmedEmail)}`;

    // Store user data in Firebase Firestore
    const currentDateTime = new Date().toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    await addDoc(collection(db, 'org_login_details'), {
      userId: userId,
      email: trimmedEmail,
      fullName: fullName.trim(),
      password: password, // Note: In production, you should hash passwords before storing
      emailVerified: false,
      createdAt: currentDateTime,
      lastLogin: null,
      verificationLink: verificationLink
    });

    return {
      success: true,
      message: 'Account created successfully! Please check your email for verification.',
      alreadyExists: false,
      verificationLink: verificationLink,
      userId: userId
    };
  } catch (error) {
    console.error('Error creating user account:', error);
    return {
      success: false,
      message: 'Failed to create account. Please try again.',
      alreadyExists: false
    };
  }
};

/**
 * Sends verification email to user
 * @param email - User's email address
 * @param verificationLink - Email verification link
 * @returns Result object with success status and message
 */
export const sendVerificationEmail = async (email: string, verificationLink: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Import EmailJS function
    const { sendVerificationEmailViaEmailJS } = await import('./emailjsConfig');
    
    // Send verification email using EmailJS
    const result = await sendVerificationEmailViaEmailJS(email, verificationLink);
    
    return result;
  } catch (error) {
    console .error('Error sending verification email:', error);
    return {
      success: false,
      message: 'Failed to send verification email. Please request a new verification email.'
    };
  }
};

/**
 * Fetches all rewards from the API
 * @returns Array of rewards or empty array if error
 */
export const fetchRewards = async (): Promise<Reward[]> => {
  try {
    const user = await waitForCurrentUser();
    console.log('Current user:', user?.displayName ?? user?.email ?? user?.uid);
    if (!user) {
      console.error('No authenticated user found');
      return [];
    }



    const token = await user.getIdToken(true);
    
    const response = await fetch('https://puviyan-api-staging-omzkebgc5q-uc.a.run.app/api/v1/rewards', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // API returns { data: [...], total, limit, offset }
    const rewardsData = Array.isArray(data) ? data : (data.data || []);
    
    const rewards: Reward[] = rewardsData.map((reward: any) => ({
      id: reward.rewardId || reward.id,
      rewardId: reward.rewardId,
      availableCoupons: reward.availableCoupons,
      brandName: reward.brandName,
      deductPoints: reward.deductPoints,
      dislikeCount: reward.dislikeCount,
      fullImage: reward.fullImage,
      fullImageGreyed: reward.fullImageGreyed,
      howToClaim: reward.howToClaim || [],
      likeCount: reward.likeCount,
      maxPerUser: reward.maxPerUser,
      previewImage: reward.previewImage,
      previewImageGreyed: reward.previewImageGreyed,
      rewardDetails: reward.rewardDetails || [],
      rewardSubtitle: reward.rewardSubtitle,
      rewardTitle: reward.rewardTitle,
      rewardType: reward.rewardType,
      status: reward.status,
      termsAndConditions: reward.termsAndConditions || '',
      usefulnessScore: reward.usefulnessScore,
      validFrom: reward.validFrom,
      validTo: reward.validTo,
      createdAt: reward.createdAt,
      updatedAt: reward.updatedAt,
      maxDiscountAmount: reward.maxDiscountAmount,
      discountAmount: reward.discountAmount,
      discountPercent: reward.discountPercent,
      minPurchaseAmount: reward.minPurchaseAmount,
      categories: reward.categories || [],
      totalCoupons: reward.totalCoupons,
      carbonContribution: reward.carbonContribution,
      orgId: reward.orgId,
      partnerId: reward.partnerId,
      createdBy: reward.createdBy
    }));
    
    return rewards;
  } catch (error) {
    console.error('Error fetching rewards from API:', error);
    return [];
  }
};

/**
 * Fetches rewards from the API with pagination
 * @param pageSize - Number of rewards per page (default: 10)
 * @param offset - Offset for pagination (default: 0)
 * @returns Paginated rewards result with rewards array and pagination info
 */
export const fetchRewardsPaginated = async (
  pageSize: number = 10,
  offset: number = 0
): Promise<PaginatedRewardsResult> => {
  try {
    console.log('fetchRewardsPaginated called with:', { pageSize, offset });
    
    const user = await waitForCurrentUser();
    console.log('Current user:', user?.displayName ?? user?.email ?? user?.uid);

    if (!user) {
      console.error('No authenticated user found');
      return {
        rewards: [],
        hasMore: false,
        total: 0,
        offset: 0
      };
    }

    const token = await user.getIdToken();
    console.log('User authenticated, fetching rewards...');
    
    const url = `https://puviyan-api-staging-omzkebgc5q-uc.a.run.app/api/v1/rewards?limit=${pageSize}&offset=${offset}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    // API returns { data: [...], total, limit, offset }
    const rewardsData = Array.isArray(data) ? data : (data.rewards || []);
    
    const rewards: Reward[] = rewardsData.map((reward: any) => ({
      id: reward.rewardId || reward.id,
      rewardId: reward.rewardId,
      availableCoupons: reward.availableCoupons,
      brandName: reward.brandName,
      deductPoints: reward.deductPoints,
      dislikeCount: reward.dislikeCount,
      fullImage: reward.fullImage,
      fullImageGreyed: reward.fullImageGreyed,
      howToClaim: reward.howToClaim || [],
      likeCount: reward.likeCount,
      maxPerUser: reward.maxPerUser,
      previewImage: reward.previewImage,
      previewImageGreyed: reward.previewImageGreyed,
      rewardDetails: reward.rewardDetails || [],
      rewardSubtitle: reward.rewardSubtitle,
      rewardTitle: reward.rewardTitle,
      rewardType: reward.rewardType,
      status: reward.status,
      termsAndConditions: reward.termsAndConditions || '',
      usefulnessScore: reward.usefulnessScore,
      validFrom: reward.validFrom,
      validTo: reward.validTo,
      createdAt: reward.createdAt,
      updatedAt: reward.updatedAt,
      maxDiscountAmount: reward.maxDiscountAmount,
      discountAmount: reward.discountAmount,
      discountPercent: reward.discountPercent,
      minPurchaseAmount: reward.minPurchaseAmount,
      categories: reward.categories || [],
      totalCoupons: reward.totalCoupons,
      carbonContribution: reward.carbonContribution,
      orgId: reward.orgId,
      partnerId: reward.partnerId,
      createdBy: reward.createdBy
    }));
    
    const total = data.total || rewards.length;
    const hasMore = (offset + rewards.length) < total;
    
    const result = {
      rewards,
      hasMore,
      total,
      offset
    };
    
    console.log('Returning result:', { rewardsCount: result.rewards.length, hasMore: result.hasMore, total: result.total });
    return result;
  } catch (error) {
    console.error('Error fetching paginated rewards from API:', error);
    return {
      rewards: [],
      hasMore: false,
      total: 0,
      offset: 0
    };
  }
};

/**
 * Creates a new reward in the Rewards collection
 * @param rewardData - Reward data object
 * @returns Result object with success status and message
 */
export const createReward = async (rewardData: Omit<Reward, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; message: string; rewardId?: string }> => {
  try {
    const currentDateTime = new Date().toISOString();
    
    const rewardWithTimestamps = {
      ...rewardData,
      createdAt: currentDateTime,
      updatedAt: currentDateTime,
      likeCount: 0,
      dislikeCount: 0,
      availableCoupons: rewardData.availableCoupons || "0"
    };

    const docRef = await addDoc(collection(db, 'rewards'), rewardWithTimestamps);
    
    return {
      success: true,
      message: 'Reward created successfully!',
      rewardId: docRef.id
    };
  } catch (error) {
    console.error('Error creating reward:', error);
    return {
      success: false,
      message: 'Failed to create reward. Please try again.'
    };
  }
};

/**
 * Fetches statistics about rewards from API
 * @returns Object containing reward statistics
 */
export const fetchRewardsStats = async (): Promise<{
  totalRewards: number;
  totalClaimed: number;
  totalUnclaimed: number;
  totalExpiring: number;
  totalViewsOrImpressions: number;
  totalRedemptions: number;
  redemptionRate: number;
  totalCarbonImpact: number;
  pendingApprovals: number;
}> => {
  try {
    const rewards = await fetchRewards();
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const totalClaimed = rewards.filter(r => r.status === 'claimed').length;

    const totalViewsOrImpressions = rewards.reduce((sum, r) => {
      const anyReward = r as any;
      const impressions = anyReward?.impressions;
      const views = anyReward?.views;
      const value = typeof impressions === 'number' ? impressions : typeof views === 'number' ? views : 0;
      return sum + value;
    }, 0);

    const totalCarbonImpact = rewards.reduce((sum, r) => {
      const anyReward = r as any;
      const carbonContribution = r.carbonContribution;
      const carbonImpact = anyReward?.carbonImpact;
      const carbonSaved = anyReward?.carbonSaved;
      const value =
        typeof carbonContribution === 'number'
          ? carbonContribution
          : typeof carbonImpact === 'number'
            ? carbonImpact
            : typeof carbonSaved === 'number'
              ? carbonSaved
              : typeof r.usefulnessScore === 'number'
                ? r.usefulnessScore
                : 0;
      return sum + value;
    }, 0);

    const pendingApprovals = rewards.filter(r => {
      const status = (r.status || '').toLowerCase();
      return status === 'pending' || status === 'pending_approval' || status === 'pending approval';
    }).length;

    const redemptionRate = totalViewsOrImpressions > 0
      ? (totalClaimed / totalViewsOrImpressions) * 100
      : 0;

    const stats = {
      totalRewards: rewards.length,
      totalClaimed,
      totalUnclaimed: rewards.filter(r => r.status === 'active').length,
      totalExpiring: rewards.filter(r => {
        const validToDate = new Date(r.validTo);
        return validToDate <= thirtyDaysFromNow && validToDate >= now;
      }).length,
      totalViewsOrImpressions,
      totalRedemptions: totalClaimed,
      redemptionRate,
      totalCarbonImpact,
      pendingApprovals
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching rewards stats:', error);
    return {
      totalRewards: 0,
      totalClaimed: 0,
      totalUnclaimed: 0,
      totalExpiring: 0,
      totalViewsOrImpressions: 0,
      totalRedemptions: 0,
      redemptionRate: 0,
      totalCarbonImpact: 0,
      pendingApprovals: 0
    };
  }
};

/**
 * Uploads an image to Firebase Storage
 * @param file - Image file to upload
 * @param folder - Storage folder path
 * @returns Download URL of the uploaded image
 */
/**
 * Deletes a reward from the Rewards collection
 * @param rewardId - ID of the reward to delete
 * @returns Result object with success status and message
 */
export const deleteReward = async (rewardId: string): Promise<{ success: boolean; message: string }> => {
  try {
    await deleteDoc(doc(db, 'rewards', rewardId));
    return {
      success: true,
      message: 'Reward deleted successfully!'
    };
  } catch (error) {
    console.error('Error deleting reward:', error);
    return {
      success: false,
      message: 'Failed to delete reward. Please try again.'
    };
  }
};

/**
 * Checks if an email exists in the org_login_details collection
 * @param email - Email address to check
 * @returns Result object with existence status and message
 */
export const checkEmailExists = async (email: string): Promise<{ exists: boolean; message: string }> => {
  try {
    const trimmedEmail = email.trim();

    // Check if email exists in org_login_details
    const emailQuery = query(
      collection(db, 'org_login_details'),
      where('email', '==', trimmedEmail)
    );
    const querySnapshot = await getDocs(emailQuery);

    if (!querySnapshot.empty) {
      return {
        exists: true,
        message: 'Email found in our system.'
      };
    } else {
      return {
        exists: false,
        message: 'Email not found in our system.'
      };
    }
  } catch (error) {
    console.error('Error checking email existence:', error);
    return {
      exists: false,
      message: 'Failed to check email. Please try again.'
    };
  }
};

/**
 * Gets user details including emailVerified status
 * @param email - User email address
 * @returns Result object with user data and emailVerified status
 */
export const getUserEmailVerificationStatus = async (email: string): Promise<{ 
  success: boolean; 
  message: string; 
  emailVerified?: boolean; 
  userId?: string 
}> => {
  try {
    const trimmedEmail = email.trim();

    // Check if email exists in org_login_details
    const emailQuery = query(
      collection(db, 'org_login_details'),
      where('email', '==', trimmedEmail)
    );
    const querySnapshot = await getDocs(emailQuery);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: 'Email not found in our system.'
      };
    }

    // Get user data
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    return {
      success: true,
      message: 'User found.',
      emailVerified: userData.emailVerified || false,
      userId: userData.userId
    };
  } catch (error) {
    console.error('Error getting user verification status:', error);
    return {
      success: false,
      message: 'Failed to check user status. Please try again.'
    };
  }
};

export const verifyUserCredentials = async (
  email: string,
  password: string
): Promise<{
  success: boolean;
  message: string;
  emailVerified?: boolean;
  userId?: string;
}> => {
  try {
    const trimmedEmail = email.trim();

    const emailQuery = query(
      collection(db, 'org_login_details'),
      where('email', '==', trimmedEmail)
    );
    const querySnapshot = await getDocs(emailQuery);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: 'Email not found in our system.'
      };
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data() as { password?: string; emailVerified?: boolean; userId?: string };

    if (userData.password !== password) {
      return {
        success: false,
        message: 'Invalid credentials. Try again.'
      };
    }

    return {
      success: true,
      message: 'User verified.',
      emailVerified: userData.emailVerified || false,
      userId: userData.userId
    };
  } catch (error) {
    console.error('Error verifying user credentials:', error);
    return {
      success: false,
      message: 'Failed to verify credentials. Please try again.'
    };
  }
};

/**
 * Updates user password and sets emailVerified to false
 * @param email - User email address
 * @param newPassword - New password to set
 * @returns Result object with success status and message
 */
export const updateUserPassword = async (email: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
  try {
    const trimmedEmail = email.trim();

    // Check if email exists in org_login_details
    const emailQuery = query(
      collection(db, 'org_login_details'),
      where('email', '==', trimmedEmail)
    );
    const querySnapshot = await getDocs(emailQuery);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: 'Email not found in our system.'
      };
    }

    // Update password and emailVerified flag
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, 'org_login_details', userDoc.id);
    
    await updateDoc(userRef, {
      password: newPassword,
      emailVerified: false,
      passwordUpdatedAt: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Password updated successfully. Please verify your email.'
    };
  } catch (error) {
    console.error('Error updating password:', error);
    return {
      success: false,
      message: 'Failed to update password. Please try again.'
    };
  }
};

/**
 * Generates password reset link and stores it in the user document
 * @param email - User email address
 * @returns Result object with success status and reset link
 */
export const generatePasswordResetLink = async (email: string): Promise<{ success: boolean; message: string; resetLink?: string }> => {
  try {
    const trimmedEmail = email.trim();

    // Check if email exists in org_login_details
    const emailQuery = query(
      collection(db, 'org_login_details'),
      where('email', '==', trimmedEmail)
    );
    const querySnapshot = await getDocs(emailQuery);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: 'Email not found in our system.'
      };
    }

    // Generate reset link using verify-email route with reset parameter
    const userDoc = querySnapshot.docs[0];
    const userId = userDoc.data().userId;
    const resetLink = `https://iam-puviyan-web.vercel.app/verify-email?userId=${userId}&email=${encodeURIComponent(trimmedEmail)}&reset=true`;

    // Update the user document with reset link and timestamp
    const userRef = doc(db, 'org_login_details', userDoc.id);
    await updateDoc(userRef, {
      passwordResetLink: resetLink,
      resetRequestedAt: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Password reset link generated successfully.',
      resetLink: resetLink
    };
  } catch (error) {
    console.error('Error generating password reset link:', error);
    return {
      success: false,
      message: 'Failed to generate password reset link. Please try again.'
    };
  }
};

/**
 * Verifies email by updating the emailVerified flag in org_login_details collection
 * @param userId - User ID to verify
 * @param email - User email for verification
 * @returns Result object with success status and message
 */
export const verifyEmail = async (userId: string, email: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Query for the user document
    const userQuery = query(
      collection(db, 'org_login_details'),
      where('userId', '==', userId),
      where('email', '==', email)
    );
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: 'Invalid verification link. User not found.'
      };
    }

    // Update the emailVerified flag
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, 'org_login_details', userDoc.id);
    
    await updateDoc(userRef, {
      emailVerified: true,
      verifiedAt: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Email verified successfully! You can now log in to your account.'
    };
  } catch (error) {
    console.error('Error verifying email:', error);
    return {
      success: false,
      message: 'Failed to verify email. Please try again or contact support.'
    };
  }
};

/**
 * Uploads an image to Firebase Storage
 * @param file - Image file to upload
 * @param folder - Storage folder path
 * @returns Download URL of the uploaded image
 */
export const uploadImage = async (file: File, folder: string = 'rewards'): Promise<{ success: boolean; url?: string; message: string }> => {
  try {
    const storage = getStorage();
    const fileName = `${folder}/${uuidv4()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return {
      success: true,
      url: downloadURL,
      message: 'Image uploaded successfully!'
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      message: 'Failed to upload image. Please try again.'
    };
  }
};
