import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export interface GoogleIdentityConfig {
  clientId: string;
  onSuccess: (credential: string) => void;
  onError: (error: any) => void;
}

export class GoogleIdentityService {
  private static isInitialized = false;
  private static clientId = '298832040055-YOUR_CLIENT_ID.apps.googleusercontent.com'; // Replace with your actual client ID

  static initialize(callback: (response: any) => void) {
    if (this.isInitialized) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: this.clientId,
          callback: callback,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        this.isInitialized = true;
      }
    };
    document.head.appendChild(script);
  }

  static renderButton(elementId: string, options?: any) {
    const element = document.getElementById(elementId);
    if (element && window.google) {
      window.google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        width: 250,
        ...options,
      });
    }
  }

  static async signInWithGoogleCredential(idToken: string) {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      return {
        success: true,
        user: result.user,
      };
    } catch (error: any) {
      console.error('Error signing in with Google credential:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
