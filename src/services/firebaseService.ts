import { DocumentSnapshot, addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, startAfter, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../firebase';

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
  availableCoupons:string;
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
  termsAndConditions: string[];
  usefulnessScore: number;
  validFrom: string;
  validTo: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedRewardsResult {
  rewards: Reward[];
  hasMore: boolean;
  lastVisible?: DocumentSnapshot;
}

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
 * @returns Result object with success status and message
 */
export const storeUserSignup = async (email: string, password: string): Promise<SignupResult> => {
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
 * Fetches all rewards from the Rewards collection
 * @returns Array of rewards or empty array if error
 */
export const fetchRewards = async (): Promise<Reward[]> => {
  try {
    const rewardsQuery = query(
      collection(db, 'rewards'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(rewardsQuery);
    const rewards: Reward[] = [];
    
    querySnapshot.forEach((doc) => {
      const rewardData = doc.data() as Omit<Reward, 'id'>;
      rewards.push({
        id: doc.id,
        ...rewardData
      });
    });
    
    return rewards;
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return [];
  }
};

/**
 * Fetches rewards from the Rewards collection with pagination
 * @param pageSize - Number of rewards per page (default: 10)
 * @param lastVisible - Last document from previous page (for pagination)
 * @returns Paginated rewards result with rewards array and pagination info
 */
export const fetchRewardsPaginated = async (
  pageSize: number = 10,
  lastVisible?: DocumentSnapshot
): Promise<PaginatedRewardsResult> => {
  try {
    console.log('fetchRewardsPaginated called with:', { pageSize, lastVisible: !!lastVisible });
    
    let rewardsQuery = query(
      collection(db, 'rewards'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    // If we have a lastVisible document, start after it for pagination
    if (lastVisible) {
      rewardsQuery = query(
        collection(db, 'rewards'),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(pageSize)
      );
    }
    
    console.log('Executing query...');
    const querySnapshot = await getDocs(rewardsQuery);
    console.log('Query executed, docs found:', querySnapshot.docs.length);
    
    const rewards: Reward[] = [];
    
    querySnapshot.forEach((doc) => {
      const rewardData = doc.data() as Omit<Reward, 'id'>;
      rewards.push({
        id: doc.id,
        ...rewardData
      });
    });
    
    console.log('Processed rewards:', rewards.length);
    
    // Check if there are more documents
    const hasMore = querySnapshot.docs.length === pageSize;
    const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    const result = {
      rewards,
      hasMore,
      lastVisible: hasMore ? newLastVisible : undefined
    };
    
    console.log('Returning result:', { rewardsCount: result.rewards.length, hasMore: result.hasMore });
    return result;
  } catch (error) {
    console.error('Error fetching paginated rewards:', error);
    return {
      rewards: [],
      hasMore: false
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
 * Fetches statistics about rewards
 * @returns Object containing reward statistics
 */
export const fetchRewardsStats = async (): Promise<{
  totalRewards: number;
  totalClaimed: number;
  totalUnclaimed: number;
  totalExpiring: number;
}> => {
  try {
    const rewardsQuery = query(collection(db, 'rewards'));
    const querySnapshot = await getDocs(rewardsQuery);
    
    const rewards = querySnapshot.docs.map(doc => doc.data() as Reward);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const stats = {
      totalRewards: rewards.length,
      totalClaimed: rewards.filter(r => r.status === 'claimed').length,
      totalUnclaimed: rewards.filter(r => r.status === 'active').length,
      totalExpiring: rewards.filter(r => {
        const validToDate = new Date(r.validTo);
        return validToDate <= thirtyDaysFromNow && validToDate >= now;
      }).length
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching rewards stats:', error);
    return {
      totalRewards: 0,
      totalClaimed: 0,
      totalUnclaimed: 0,
      totalExpiring: 0
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

    // Generate reset link
    const userDoc = querySnapshot.docs[0];
    const userId = userDoc.data().userId;
    const resetLink = `https://iam-puviyan-web.vercel.app/reset-password?userId=${userId}&email=${encodeURIComponent(trimmedEmail)}`;

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
export const uploadImage = async (file: File, folder: string = 'reward-images'): Promise<{ success: boolean; url?: string; message: string }> => {
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
