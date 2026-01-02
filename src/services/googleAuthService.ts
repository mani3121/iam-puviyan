import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';
import { collection, getDocs, query, where, addDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { auth, db } from '../firebase';

export interface GoogleAuthResult {
  success: boolean;
  message: string;
  user?: {
    userId: string;
    email: string;
    fullName: string;
    photoURL?: string;
  };
  isNewUser?: boolean;
}

export class GoogleAuthService {
  private static provider = new GoogleAuthProvider();

  static async signInWithGoogle(): Promise<GoogleAuthResult> {
    try {
      const result: UserCredential = await signInWithPopup(auth, this.provider);
      const user = result.user;

      if (!user.email) {
        return {
          success: false,
          message: 'Unable to retrieve email from Google account.'
        };
      }

      const trimmedEmail = user.email.trim();
      const fullName = user.displayName || '';
      const photoURL = user.photoURL || undefined;

      const existingUser = await this.checkUserExists(trimmedEmail);

      if (existingUser.exists && existingUser.userId) {
        await this.updateLastLogin(existingUser.docId!);

        return {
          success: true,
          message: 'Successfully signed in with Google!',
          user: {
            userId: existingUser.userId,
            email: trimmedEmail,
            fullName: fullName,
            photoURL: photoURL
          },
          isNewUser: false
        };
      }

      const newUserId = uuidv4();
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
        userId: newUserId,
        email: trimmedEmail,
        fullName: fullName,
        photoURL: photoURL,
        authProvider: 'google',
        emailVerified: true,
        createdAt: currentDateTime,
        lastLogin: currentDateTime,
        password: null
      });

      return {
        success: true,
        message: 'Successfully signed up with Google!',
        user: {
          userId: newUserId,
          email: trimmedEmail,
          fullName: fullName,
          photoURL: photoURL
        },
        isNewUser: true
      };
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);

      if (error.code === 'auth/popup-closed-by-user') {
        return {
          success: false,
          message: 'Sign-in cancelled. Please try again.'
        };
      }

      if (error.code === 'auth/popup-blocked') {
        return {
          success: false,
          message: 'Pop-up blocked. Please allow pop-ups for this site.'
        };
      }

      return {
        success: false,
        message: 'Failed to sign in with Google. Please try again.'
      };
    }
  }

  private static async checkUserExists(email: string): Promise<{
    exists: boolean;
    userId?: string;
    docId?: string;
  }> {
    try {
      const emailQuery = query(
        collection(db, 'org_login_details'),
        where('email', '==', email)
      );
      const querySnapshot = await getDocs(emailQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        return {
          exists: true,
          userId: userData.userId,
          docId: userDoc.id
        };
      }

      return { exists: false };
    } catch (error) {
      console.error('Error checking user existence:', error);
      return { exists: false };
    }
  }

  static async loginWithGoogle(): Promise<GoogleAuthResult> {
    try {
      const result: UserCredential = await signInWithPopup(auth, this.provider);
      const user = result.user;

      if (!user.email) {
        return {
          success: false,
          message: 'Unable to retrieve email from Google account.'
        };
      }

      const trimmedEmail = user.email.trim();
      const fullName = user.displayName || '';
      const photoURL = user.photoURL || undefined;

      const existingUser = await this.checkUserExists(trimmedEmail);

      if (!existingUser.exists) {
        return {
          success: false,
          message: 'Google account is not registered in our database. Please sign up first.'
        };
      }

      await this.updateLastLogin(existingUser.docId!);

      return {
        success: true,
        message: 'Successfully signed in with Google!',
        user: {
          userId: existingUser.userId!,
          email: trimmedEmail,
          fullName: fullName,
          photoURL: photoURL
        },
        isNewUser: false
      };
    } catch (error: any) {
      console.error('Google Login Error:', error);

      if (error.code === 'auth/popup-closed-by-user') {
        return {
          success: false,
          message: 'Sign-in cancelled. Please try again.'
        };
      }

      if (error.code === 'auth/popup-blocked') {
        return {
          success: false,
          message: 'Pop-up blocked. Please allow pop-ups for this site.'
        };
      }

      return {
        success: false,
        message: 'Failed to sign in with Google. Please try again.'
      };
    }
  }

  private static async updateLastLogin(docId: string): Promise<void> {
    try {
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

      const userDocRef = collection(db, 'org_login_details');
      const userQuery = query(userDocRef, where('__name__', '==', docId));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          lastLogin: currentDateTime
        });
      }
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }
}
