import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
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

  static async initiateSignInWithGoogle(): Promise<GoogleAuthResult> {
    try {
      console.log('GoogleAuthService - Initiating signup popup');
      const result = await signInWithPopup(auth, this.provider);
      console.log('GoogleAuthService - Popup result:', result);

      const user = result.user;
      console.log('GoogleAuthService - User from popup:', user.email);

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
      console.log('GoogleAuthService - Existing user check:', existingUser);

      if (existingUser.exists && existingUser.userId) {
        console.log('GoogleAuthService - Existing user found, updating last login');
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

      console.log('GoogleAuthService - Creating new user account');
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

      console.log('GoogleAuthService - Storing new user in Firestore');
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

  // Backward compatibility with earlier API naming
  static async signInWithGoogle(): Promise<GoogleAuthResult> {
    return this.initiateSignInWithGoogle();
  }

  private static async checkUserExists(email: string): Promise<{
    exists: boolean;
    userId?: string;
    docId?: string;
  }> {
    try {
      const emailQuery = query(collection(db, 'org_login_details'), where('email', '==', email));
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

  static async initiateLoginWithGoogle(): Promise<GoogleAuthResult> {
    try {
      console.log('GoogleAuthService - Initiating login popup');
      const result = await signInWithPopup(auth, this.provider);
      console.log('GoogleAuthService - Popup result:', result);

      const user = result.user;
      console.log('GoogleAuthService - User from popup:', user.email);

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
      console.log('GoogleAuthService - Existing user check for login:', existingUser);

      if (!existingUser.exists) {
        console.log('GoogleAuthService - User not registered');
        return {
          success: false,
          message: 'Google account is not registered in our database. Please sign up first.'
        };
      }

      console.log('GoogleAuthService - User found, updating last login');
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

  // Backward compatibility alias for the redirect-based name
  static async loginWithGoogle(): Promise<GoogleAuthResult> {
    return this.initiateLoginWithGoogle();
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
