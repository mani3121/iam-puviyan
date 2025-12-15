# EmailJS Setup Guide for Puviyan Email Verification

## Overview
This guide will help you configure EmailJS to send verification emails for user account registration in the Puviyan application.

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service

1. In EmailJS dashboard, click "Email Services" → "Add New Service"
2. Choose your email provider:
   - **Gmail** (Recommended for development)
   - **Outlook**
   - **Yahoo**
   - **Other SMTP** (for custom email servers)
3. Connect your email account and grant permissions
4. Note your **Service ID** (it will be generated automatically)

## Step 3: Create Email Template

### Method 1: Using the Dashboard

1. In EmailJS dashboard, click "Email Templates" → "Create New Template"
2. Use the following configuration:

#### Template Details:
- **Template Name**: `Email Verification - Puviyan Account`
- **Subject**: `Verify Your Email - Puviyan Account`

#### HTML Content:
Copy the HTML content from `src/services/emailjsConfig.ts` (the `html_content` property)

#### Variables to Add:
- `{{to_name}}` - Recipient's name
- `{{to_email}}` - Recipient's email address  
- `{{verification_link}}` - Email verification link

### Method 2: Using the Provided Template

1. Copy the HTML content from `src/services/emailjsConfig.ts`
2. Paste it into the HTML content area in EmailJS template editor
3. EmailJS will automatically detect the variables

## Step 4: Get Your Credentials

After creating the template, you'll need:

1. **Service ID**: From your email service configuration
2. **Template ID**: From your email template
3. **Public Key**: From your EmailJS account settings (Account → API Keys)

## Step 5: Install EmailJS Package

```bash
npm install @emailjs/browser
```

## Step 6: Configure Your Application

1. Update `src/services/emailjsConfig.ts` with your credentials:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_actual_service_id',    // Replace with your Service ID
  TEMPLATE_ID: 'your_actual_template_id',  // Replace with your Template ID
  PUBLIC_KEY: 'your_actual_public_key'     // Replace with your Public Key
};
```

## Step 7: Update Firebase Service

Replace the simulated email sending in `src/services/firebaseService.ts`:

```typescript
import { sendVerificationEmailViaEmailJS } from './emailjsConfig';

// In sendVerificationEmail function:
export const sendVerificationEmail = async (email: string, verificationLink: string): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await sendVerificationEmailViaEmailJS(email, verificationLink);
    return result;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      message: 'Failed to send verification email. Please request a new verification email.'
    };
  }
};
```

## Step 8: Initialize EmailJS

In your main application file (e.g., `App.tsx` or `main.tsx`):

```typescript
import { initializeEmailJS } from './services/emailjsConfig';

// Initialize EmailJS when app starts
initializeEmailJS();
```

## Testing Your Setup

1. Start your application
2. Go to the signup page
3. Hubmásolja be atur a regisztr zitáció adatait
4. Submit the form
5. Check your email for the verification message

## Troubleshooting

### Common Issues:

1. **Email not sending**:
   - Check your Service ID, Template ID, and Public Key
   - Ensure EmailJS is properly initialized
   - Check browser console for errors

2. **Template variables not working**:
   - Ensure variable names match exactly: `{{to_name}}`, `{{to_email}}`, `{{verification_link}}`
   - Check EmailJS template preview to see if variables are detected

3. **Rate limits**:
   - Free EmailJS account has monthly limits
   - Consider upgrading to a paid plan for production

4. **Email delivery issues**:
   - Check spam/junk folder
   - Ensure your email provider allows third-party access
   - Verify DNS settings (SPF, DKIM) if using custom domain

## Security Notes

- Store your EmailJS Public Key in environment variables for production
- The verification links expire after 24 hours for security
- Consider implementing rate limiting for email requests
- Never store sensitive information in email templates

## Production Considerations

- Use a dedicated email address (e.g., `noreply@puviyan.com`)
- Set up proper DNS records (SPF, DKIM, DMARC)
- Monitor email deliverability rates
- Consider using a transactional email service (SendGrid, Mailgun) for higher volume

## Support

For EmailJS-specific issues:
- Check [EmailJS Documentation](https://www.emailjs.com/docs/)
- Review EmailJS dashboard for error messages
- Contact EmailJS support for account-related issues

For application-specific issues:
- Check browser console for JavaScript errors
- Verify Firebase configuration
- Review network requests in browser dev tools
