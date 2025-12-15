import emailjs from '@emailjs/browser';

// EmailJS Configuration
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_e0xzk9u', // EmailJS service ID
  TEMPLATE_ID: 'template_9iboyvz', // EmailJS template ID
  PUBLIC_KEY: 'fncbWb_Sq7sOWvlzE'   // EmailJS public key
};

// Email Template for EmailJS Dashboard
export const EMAILJS_TEMPLATE = {
  template_name: 'Email Verification - Puviyan Account',
  subject: 'Verify Your Email - Puviyan Account',
  html_content: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Puviyan Account</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #48C84F;
          margin-bottom: 10px;
        }
        .title {
          color: #1a1a1a;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content {
          margin-bottom: 30px;
        }
        .verification-button {
          display: inline-block;
          background-color: #48C84F;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin: 20px 0;
          transition: background-color 0.3s;
        }
        .verification-button:hover {
          background-color: #5ABA52;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
        .security-note {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Puviyan</div>
          <h1 class="title">Verify Your Email Address</h1>
        </div>
        
        <div class="content">
          <p>Dear {{to_name}},</p>
          <p>Thank you for creating an account with Puviyan! We're excited to have you join our community dedicated to sustainable living.</p>
          
          <p>To complete your registration and activate your account, please click the button below to verify your email address:</p>
          
          <div style="text-align: center;">
            <a href="{{verification_link}}" class="verification-button">Verify Email Address</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace;">
            {{verification_link}}
          </p>
          
          <div class="security-note">
            <strong>Security Notice:</strong> This verification link will expire in 24 hours for security reasons. If you didn't create an account with Puviyan, please ignore this email or contact our support team.
          </div>
        </div>
        
        <div class="footer">
          <p>This email was sent to {{to_email}} because you created an account with Puviyan.</p>
          <p>&copy; 2025 Puviyan Digital Solutions Private Limited. All rights reserved.</p>
          <p>If you have any questions, please contact our support team at support@puviyan.com</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text_content: `
    Verify Your Email - Puviyan Account
    
    Dear {{to_name}},
    
    Thank you for creating an account with Puviyan! We're excited to have you join our community dedicated to sustainable living.
    
    To complete your registration and activate your account, please visit this link:
    {{verification_link}}
    
    Or copy and paste this link into your browser:
    {{verification_link}}
    
    Security Notice: This verification link will expire in 24 hours for security reasons. If you didn't create an account with Puviyan, please ignore this email or contact our support team.
    
    This email was sent to {{to_email}} because you created an account with Puviyan.
    
    © 2025 Puviyan Digital Solutions Private Limited. All rights reserved.
    If you have any questions, please contact our support team at support@puviyan.com
  `
};

// EmailJS Variables for Template
export const EMAILJS_VARIABLES = {
  to_name: 'User', // This will be replaced with the actual user's name or email
  to_email: '{{to_email}}', // This will be replaced with the recipient's email
  verification_link: '{{verification_link}}' // This will be replaced with the verification link
};

// Initialize EmailJS
export const initializeEmailJS = () => {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
};

// Send verification email using EmailJS
export const sendVerificationEmailViaEmailJS = async (
  toEmail: string, 
  verificationLink: string,
  userName?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const templateParams = {
      to_name: userName || toEmail.split('@')[0], // Use email prefix as name if not provided
      to_email: toEmail,
      verification_link: verificationLink
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Verification email sent successfully!'
      };
    } else {
      return {
        success: false,
        message: 'Failed to send verification email. Please try again.'
      };
    }
  } catch (error) {
    console.error('Error sending verification email via EmailJS:', error);
    return {
      success: false,
      message: 'Failed to send verification email. Please try again later.'
    };
  }
};
