import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

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
