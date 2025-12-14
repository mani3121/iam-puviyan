import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface LinkedInUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  headline?: string;
}

interface AuthResult {
  success: boolean;
  user?: LinkedInUser;
  message: string;
}

/**
 * LinkedIn OAuth 2.0 Authentication Service
 * Handles LinkedIn login flow and user data storage
 */
export class LinkedInAuthService {
  private static readonly CLIENT_ID = '86ys3b1c4locyh'; // Replace with actual LinkedIn Client ID
  private static readonly CLIENT_SECRET = 'WPL_AP1.rDUYUEGgs6dykyWG.Lgh42Q=='; // Replace with actual Client Secret
  private static readonly REDIRECT_URI = `${window.location.origin}/login`;
  private static readonly SCOPES = 'openid profile email';

  /**
   * Initiate LinkedIn OAuth flow
   */
  static initiateLinkedInAuth(): void {
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code&` +
      `client_id=${this.CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}&` +
      `scope=${encodeURIComponent(this.SCOPES)}&` +
      `state=${this.generateState()}`;

    window.location.href = authUrl;
  }

  /**
   * Handle OAuth callback and exchange code for access token
   */
  static async handleAuthCallback(code: string, state: string): Promise<AuthResult> {
    try {
      // Verify state to prevent CSRF attacks
      const storedState = sessionStorage.getItem('linkedin_oauth_state');
      if (state !== storedState) {
        return { success: false, message: 'Invalid state parameter' };
      }

      // Exchange authorization code for access token
      const tokenResponse = await this.exchangeCodeForToken(code);
      
      if (!tokenResponse.access_token) {
        return { success: false, message: 'Failed to obtain access token' };
      }

      // Get user profile information
      const userProfile = await this.getUserProfile(tokenResponse.access_token);
      
      if (!userProfile) {
        return { success: false, message: 'Failed to fetch user profile' };
      }

      // Save user data to Firebase
      await this.saveUserToFirebase(userProfile);

      return { 
        success: true, 
        user: userProfile, 
        message: 'Successfully authenticated with LinkedIn' 
      };

    } catch (error) {
      console.error('LinkedIn auth error:', error);
      return { 
        success: false, 
        message: 'Authentication failed. Please try again.' 
      };
    }
  }

  /**
   * Exchange authorization code for access token
   */
  private static async exchangeCodeForToken(code: string): Promise<any> {
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.REDIRECT_URI,
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error('Token exchange failed');
    }

    return await response.json();
  }

  /**
   * Get user profile information using access token
   */
  private static async getUserProfile(accessToken: string): Promise<LinkedInUser | null> {
    try {
      // Get user profile
      const profileResponse = await fetch('https://api.linkedin.com/v2/people/~:id,firstName,lastName,profilePicture(displayImage~:playableStreams)', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch profile');
      }

      const profileData = await profileResponse.json();

      // Get user email
      const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to fetch email');
      }

      const emailData = await emailResponse.json();

      // Construct user object
      const user: LinkedInUser = {
        id: profileData.id,
        firstName: profileData.firstName.localized.en_US || profileData.firstName,
        lastName: profileData.lastName.localized.en_US || profileData.lastName,
        email: emailData.elements[0]['handle~'].emailAddress,
        profilePicture: profileData.profilePicture?.['displayImage~']?.elements[0]?.identifiers[0]?.identifier,
      };

      return user;

    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Save user data to Firebase Firestore
   */
  private static async saveUserToFirebase(user: LinkedInUser): Promise<void> {
    try {
      // Check if user already exists
      const userDoc = await getDoc(doc(db, 'users', user.id));
      
      const userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture || '',
        authProvider: 'linkedin',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      if (userDoc.exists()) {
        // Update existing user
        await setDoc(doc(db, 'users', user.id), {
          ...userData,
          ...userDoc.data(),
          lastLoginAt: new Date().toISOString(),
        }, { merge: true });
      } else {
        // Create new user
        await setDoc(doc(db, 'users', user.id), userData);
      }

      // Also save to user_notifications collection for tracking
      await addDoc(collection(db, 'user_notifications'), {
        userId: user.id,
        email: user.email,
        appType: 'IamPuviyan',
        authProvider: 'linkedin',
        dateTime: new Date().toLocaleString('en-IN', { 
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }),
      });

    } catch (error) {
      console.error('Error saving user to Firebase:', error);
      throw error;
    }
  }

  /**
   * Generate random state for OAuth security
   */
  private static generateState(): string {
    const state = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('linkedin_oauth_state', state);
    return state;
  }

  /**
   * Check if URL contains LinkedIn OAuth callback
   */
  static isLinkedInCallback(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('code') && urlParams.has('state');
  }

  /**
   * Extract OAuth parameters from URL
   */
  static extractOAuthParams(): { code: string; state: string } | null {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state) {
      return { code, state };
    }
    
    return null;
  }
}
