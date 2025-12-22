import {
  Box,
  Button,
  CircularProgress,
  createTheme,
  CssBaseline,
  Link,
  ThemeProvider,
  Typography,
  Paper
} from '@mui/material'
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import logoImage from '../assets/IamPuviyanLogo.png'
import ContentWrapper from '../components/ContentWrapper'
import CustomPopup from '../components/CustomPopup'
import PageLayout from '../components/PageLayout'
import { verifyEmail } from '../services/firebaseService'

// Material UI Dark Theme with Green Accents
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#48C84F',
      dark: '#3FA640',
      light: '#5FD55F',
    },
    secondary: {
      main: '#FFC107',
    },
    background: {
      default: '#1A1A1A',
      paper: '#242424',
    },
    error: {
      main: '#CF6679',
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#B0B0B0',
    },
    divider: '#424242',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
})

interface PopupConfig {
  title: string
  message: string
  type: 'success' | 'error' | 'info'
  customActions?: Array<{
    label: string
    onClick: () => void
    variant?: 'text' | 'outlined' | 'contained'
    color?: 'primary' | 'secondary' | 'error'
  }>
}

export default function VerifyEmail() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showPopup, setShowPopup] = useState(false)
  const [popupConfig, setPopupConfig] = useState<PopupConfig>({
    title: '',
    message: '',
    type: 'success'
  })
  const [resendLoading, setResendLoading] = useState(false)
  const [email] = useState(searchParams.get('email') || '')
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')

  // Handle email verification when component loads
  useEffect(() => {
    const userId = searchParams.get('userId')
    const emailParam = searchParams.get('email')
    
    if (userId && emailParam) {
      handleEmailVerification(userId, emailParam)
    }
  }, [searchParams])

  const handleEmailVerification = async (userId: string, email: string) => {
    setIsVerifying(true)
    try {
      const result = await verifyEmail(userId, email)
      
      if (result.success) {
        setVerificationStatus('success')
        setPopupConfig({
          title: 'Email Verified!',
          message: result.message,
          type: 'success',
          customActions: [
            {
              label: 'Login',
              onClick: () => navigate('/login'),
              variant: 'contained',
              color: 'primary'
            }
          ]
        })
      } else {
        setVerificationStatus('error')
        setPopupConfig({
          title: 'Verification Failed',
          message: result.message,
          type: 'error'
        })
      }
      setShowPopup(true)
    } catch (error) {
      setVerificationStatus('error')
      setPopupConfig({
        title: 'Verification Error',
        message: 'An error occurred during email verification. Please try again.',
        type: 'error'
      })
      setShowPopup(true)
    } finally {
      setIsVerifying(false)
    }
  }

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleResendEmail = async () => {
    setResendLoading(true)
    try {
      // TODO: Implement resend verification email logic
      // This would call your email service to resend the verification email
      
      setPopupConfig({
        title: 'Email Sent!',
        message: `Verification email has been resent to ${email}`,
        type: 'success'
      })
      setShowPopup(true)
      
      // Reset countdown
      setCountdown(60)
      setCanResend(false)
    } catch (error) {
      setPopupConfig({
        title: 'Error',
        message: 'Failed to resend verification email. Please try again.',
        type: 'error'
      })
      setShowPopup(true)
    } finally {
      setResendLoading(false)
    }
  }

  const handleBackToSignup = () => {
    navigate('/signup')
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <PageLayout>
        <ContentWrapper maxWidth="mobile">
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#1a1a1a', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            
            {/* Logo Section */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <Box  
                  component="img"
                  src={logoImage}
                  alt="IamPuviyan Logo"
                  sx={{ width: 50, height: 50, mr: 2 }}
                />
                <Typography sx={{ color: '#D4D4D4', fontFamily: '"Segoe UI Variable"', fontSize: '14px', lineHeight: 1.2, textAlign: 'center' }}>
                  IAMPUVIYAN
                  <br />
                  <Typography component="span" sx={{ fontSize: '16px' }}>
                    ORGANISATION
                  </Typography>
                </Typography>
              </Box>
            </Box>

            {/* Verification Card */}
            <Paper 
              elevation={3}
              sx={{ 
                p: 4, 
                maxWidth: 450, 
                width: '100%',
                bgcolor: '#1e1e1e',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3
              }}
            >
              {/* Email Icon */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box 
                  sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: verificationStatus === 'success' ? 'rgba(76, 175, 80, 0.1)' : 
                              verificationStatus === 'error' ? 'rgba(207, 102, 121, 0.1)' : 
                              'rgba(76, 175, 80, 0.1)',
                    mb: 2
                  }}
                >
                  {isVerifying ? (
                    <CircularProgress size={40} color="primary" />
                  ) : verificationStatus === 'success' ? (
                    <Mail style={{ fontSize: 40, color: '#4CAF50' }} />
                  ) : verificationStatus === 'error' ? (
                    <Mail style={{ fontSize: 40, color: '#CF6679' }} />
                  ) : (
                    <Mail style={{ fontSize: 40, color: '#4CAF50' }} />
                  )}
                </Box>
              </Box>

              {/* Title and Description */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ color: '#D4D4D4', fontWeight: 'bold', mb: 2, fontFamily: '"Segoe UI Variable"' }}>
                  {isVerifying ? 'Verifying Your Email...' : 
                   verificationStatus === 'success' ? 'Email Verified!' :
                   verificationStatus === 'error' ? 'Verification Failed' :
                   'Verify your email'}
                </Typography>
                
                {isVerifying ? (
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    Please wait while we verify your email address...
                  </Typography>
                ) : verificationStatus === 'success' ? (
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    Your email has been successfully verified! You can now log in to your account.
                  </Typography>
                ) : verificationStatus === 'error' ? (
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    There was an issue verifying your email. Please check the verification link or request a new one.
                  </Typography>
                ) : (
                  <>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1, lineHeight: 1.6 }}>
                      We've sent a verification email to:
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 'medium', mb: 2 }}>
                      {email}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                      Click the verification link in the email to complete your registration. 
                      If you don't see the email, check your spam folder.
                    </Typography>
                  </>
                )}
              </Box>

              {/* Action Buttons */}
              {verificationStatus === 'pending' && !isVerifying && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleResendEmail}
                    disabled={!canResend || resendLoading}
                    startIcon={resendLoading ? <CircularProgress size={20} color="inherit" /> : <RefreshCw />}
                    sx={{ 
                      py: 1.5,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.light',
                        bgcolor: 'rgba(76, 175, 80, 0.08)'
                      },
                      '&:disabled': {
                        borderColor: 'divider',
                        color: 'text.secondary'
                      }
                    }}
                  >
                    {resendLoading 
                      ? 'Sending...' 
                      : canResend 
                        ? 'Resend verification email' 
                        : `Resend (${countdown}s)`
                    }
                  </Button>

                  <Button
                    variant="text"
                    onClick={handleBackToSignup}
                    startIcon={<ArrowLeft />}
                    sx={{ 
                      py: 1.5,
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: 'rgba(76, 175, 80, 0.08)'
                      }
                    }}
                  >
                    Back to signup
                  </Button>
                </Box>
              )}

              {verificationStatus === 'error' && !isVerifying && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleResendEmail}
                    disabled={!canResend || resendLoading}
                    startIcon={resendLoading ? <CircularProgress size={20} color="inherit" /> : <RefreshCw />}
                    sx={{ 
                      py: 1.5,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.light',
                        bgcolor: 'rgba(76, 175, 80, 0.08)'
                      }
                    }}
                  >
                    {resendLoading 
                      ? 'Sending...' 
                      : canResend 
                        ? 'Request new verification email' 
                        : `Request new (${countdown}s)`
                    }
                  </Button>

                  <Button
                    variant="text"
                    onClick={handleBackToSignup}
                    startIcon={<ArrowLeft />}
                    sx={{ 
                      py: 1.5,
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: 'rgba(76, 175, 80, 0.08)'
                      }
                    }}
                  >
                    Back to signup
                  </Button>
                </Box>
              )}

              {/* Help Text */}
              <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Didn't receive the email? Check your spam folder or{' '}
                  <Link 
                    component="button"
                    onClick={handleResendEmail}
                    disabled={!canResend || resendLoading}
                    sx={{ 
                      color: 'primary.main',
                      '&:hover': { color: 'primary.light' },
                      '&:disabled': { color: 'text.secondary' },
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      p: 0,
                      font: 'inherit'
                    }}
                  >
                    request a new one
                  </Link>
                </Typography>
              </Box>
            </Paper>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                Need help? Contact support at{' '}
                <Link href="mailto:support@iamPuviyan.com" sx={{ color: 'primary.main', '&:hover': { color: 'primary.light' } }}>
                  support@iamPuviyan.com
                </Link>
              </Typography>
            </Box>

            {/* Custom Popup */}
            <CustomPopup
              isOpen={showPopup}
              onClose={() => setShowPopup(false)}
              title={popupConfig.title}
              message={popupConfig.message}
              type={popupConfig.type}
            />
          </Box>
        </ContentWrapper>
      </PageLayout>
    </ThemeProvider>
  )
}
