import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface EmailSubmissionResult {
  success: boolean;
  message: string;
  alreadyExists: boolean;
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
