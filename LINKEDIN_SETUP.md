# LinkedIn OAuth Setup Instructions

## Overview
This document provides instructions for setting up LinkedIn OAuth authentication in your React application.

## Prerequisites
- LinkedIn Developer Account
- Active LinkedIn App with OAuth 2.0 enabled

## Step 1: Create LinkedIn App

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps/new)
2. Sign in with your LinkedIn account
3. Click "Create App"
4. Fill in the required information:
   - **App Name**: Your app name (e.g., "Puviyan Auth")
   - **App Logo**: Upload your app logo
   - **App Description**: Describe your app
   - **Privacy Policy URL**: Your privacy policy URL
   - **Terms of Service URL**: Your terms of service URL
   - **Website URL**: Your website URL (e.g., `http://localhost:5175` for development)
   - **Business Email**: Your business email

## Step 2: Configure OAuth 2.0

1. In your app dashboard, go to **"Auth"** tab
2. Under **"OAuth 2.0"** section, click **"Add"**
3. Configure the following:
   - **Redirect URLs**: 
     - Development: `http://localhost:5175/login`
     - Production: `https://yourdomain.com/login`
   - **Scopes**: Add the following scopes:
     - `openid` - For OpenID Connect
     - `profile` - For basic profile information
     - `email` - For user email address

## Step 3: Get Your Credentials

1. Go to **"Products"** tab
2. Add **"Sign In with LinkedIn"** product
3. Go to **"Auth"** tab again
4. Copy your **Client ID** and **Client Secret**

## Step 4: Update Your Code

1. Open `src/services/linkedInAuthService.ts`
2. Replace the placeholder values:
   ```typescript
   private static readonly CLIENT_ID = 'YOUR_LINKEDIN_CLIENT_ID'; // Replace with actual Client ID
   private static readonly CLIENT_SECRET = 'YOUR_LINKEDIN_CLIENT_SECRET'; // Replace with actual Client Secret
   ```

## Step 5: Update Redirect URI

Make sure your redirect URI matches exactly what you configured in LinkedIn:
- Development: `http://localhost:5175/login`
- Production: `https://yourdomain.com/login`

**Important**: The redirect URI in your LinkedIn app settings must exactly match `${window.location.origin}/login` in the code.

## Step 6: Test the Integration

1. Start your development server
2. Navigate to `/login`
3. Click "Continue with LinkedIn"
4. You should be redirected to LinkedIn for authentication
5. After successful authentication, you'll be redirected back with user data

## Firebase Collections

The integration will create/update the following collections:

### `users` collection
```typescript
{
  id: string,           // LinkedIn user ID
  firstName: string,
  lastName: string,
  email: string,
  profilePicture: string,
  authProvider: 'linkedin',
  createdAt: string,
  lastLoginAt: string
}
```

### `user_notifications` collection
```typescript
{
  userId: string,
  email: string,
  appType: 'IamPuviyan',
  authProvider: 'linkedin',
  dateTime: string
}
```

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Ensure the redirect URI in your code matches exactly with LinkedIn app settings
   - Check for trailing slashes or HTTP vs HTTPS

2. **"Invalid client credentials"**
   - Verify Client ID and Client Secret are correct
   - Ensure your app is approved for production use

3. **"Insufficient permissions"**
   - Make sure you have the correct scopes configured
   - Check that your app has the "Sign In with LinkedIn" product enabled

4. **CORS issues**
   - For development, ensure your localhost URL is added to allowed domains
   - For production, ensure your domain is properly configured

### Debug Mode

To enable debug logging, add this to your browser console:
```javascript
localStorage.setItem('debug', 'linkedin:*')
```

## Security Considerations

1. **Client Secret**: Never expose your Client Secret in frontend code
2. **State Parameter**: The implementation uses CSRF protection with state parameter
3. **HTTPS**: Always use HTTPS in production
4. **Token Storage**: Consider storing tokens securely (httpOnly cookies recommended)

## Production Deployment

1. Update all localhost URLs to your production domain
2. Ensure your LinkedIn app is approved for production use
3. Set up proper error handling and user feedback
4. Implement proper session management
5. Add rate limiting to prevent abuse

## Support

If you encounter issues:
1. Check LinkedIn Developer Documentation
2. Review the browser console for errors
3. Verify all configurations match exactly
4. Test with different LinkedIn accounts
