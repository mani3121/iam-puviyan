import {
  Box,
  Button,
  CircularProgress,
  createTheme,
  CssBaseline,
  Link,
  TextField,
  ThemeProvider,
  Typography,
  Paper
} from '@mui/material'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoImage from '../assets/IamPuviyanLogo.png'
import ContentWrapper from '../components/ContentWrapper'
import CustomPopup from '../components/CustomPopup'
import PageLayout from '../components/PageLayout'
import { checkEmailExists, generatePasswordResetLink } from '../services/firebaseService'
import { sendVerificationEmailViaEmailJS, initializeEmailJS } from '../services/emailjsConfig'

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

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(false)
  const [popupConfig, setPopupConfig] = useState<PopupConfig>({
    title: '',
    message: '',
    type: 'success'
  })
  const [email, setEmail] = useState('')
  const [emailValid, setEmailValid] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailFound, setEmailFound] = useState<boolean | null>(null)
  const [resetEmailSent, setResetEmailSent] = useState(false)

  // Initialize EmailJS on component mount
  useEffect(() => {
    initializeEmailJS()
  }, [])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setEmailError(false)
    
    if (validateEmail(value)) {
      setEmailValid(true)
    } else {
      setEmailValid(false)
    }
    
    // Reset email found state when user changes email
    if (emailFound !== null) {
      setEmailFound(null)
      setResetEmailSent(false)
    }
  }

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !validateEmail(email)) {
      setEmailError(true)
      return
    }

    setIsLoading(true)
    try {
      const result = await checkEmailExists(email)
      
      if (result.exists) {
        // Email found - generate reset link and send email
        setEmailFound(true)
        
        // Generate password reset link
        const resetResult = await generatePasswordResetLink(email)
        
        if (resetResult.success && resetResult.resetLink) {
          // Send password reset email
          const emailResult = await sendVerificationEmailViaEmailJS(
            email,
            resetResult.resetLink,
            email.split('@')[0] // Use email prefix as name
          )
          
          if (emailResult.success) {
            setResetEmailSent(true)
          } else {
            setPopupConfig({
              title: 'Email Sending Failed',
              message: 'Failed to send password reset email. Please try again.',
              type: 'error'
            })
            setShowPopup(true)
          }
        } else {
          setPopupConfig({
            title: 'Reset Link Generation Failed',
            message: 'Failed to generate reset link. Please try again.',
            type: 'error'
          })
          setShowPopup(true)
        }
      } else {
        // Email not found - show error popup with signup option
        setEmailFound(false)
        setPopupConfig({
          title: 'Email Not Registered',
          message: 'Your email is not registered yet.',
          type: 'error',
          customActions: [
            {
              label: 'Sign Up',
              onClick: () => navigate('/signup'),
              variant: 'contained',
              color: 'primary'
            }
          ]
        })
        setShowPopup(true)
      }
    } catch (error) {
      setPopupConfig({
        title: 'Error',
        message: 'Failed to process request. Please try again.',
        type: 'error'
      })
      setShowPopup(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
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
                <Typography sx={{ color: '#D4D4D4', fontFamily: '"Segoe UI Variable"', fontSize: '12px', lineHeight: 1.2, textAlign: 'center' }}>
                  IAMPUVIYAN
                  <br />
                  <Typography component="span" sx={{ fontSize: '14px' }}>
                    ORGANISATION
                  </Typography>
                </Typography>
              </Box>
            </Box>

            {/* Forgot Password Card */}
            <Paper
              elevation={24}
              sx={{
                width: '100%',
                maxWidth: 400,
                p: 4,
                bgcolor: '#1e1e1e',
                border: '1px solid rgba(255, 255, 255, 0.1)',
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
                    bgcolor: emailFound === true ? 'rgba(76, 175, 80, 0.1)' : 
                              emailFound === false ? 'rgba(207, 102, 121, 0.1)' : 
                              'rgba(76, 175, 80, 0.1)',
                    mb: 2
                  }}
                >
                  {emailFound === true ? (
                    <CheckCircle style={{ fontSize: 40, color: '#4CAF50' }} />
                  ) : (
                    <Mail style={{ fontSize: 40, color: emailFound === false ? '#CF6679' : '#4CAF50' }} />
                  )}
                </Box>
              </Box>

              {/* Title and Description */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ color: '#D4D4D4', fontWeight: 'bold', mb: 2, fontFamily: '"Segoe UI Variable"' }}>
                  {resetEmailSent ? 'Reset Email Sent' : 
                   emailFound === false ? 'Email Not Found' :
                   'Forgot Password?'}
                </Typography>
                
                {resetEmailSent ? (
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    Password reset link has been sent to your email address.
                    <br />
                    <Typography component="span" sx={{ color: 'primary.main', fontWeight: 'medium' }}>
                      {email}
                    </Typography>
                    <br />
                    Please check your inbox and click the link to reset your password.
                  </Typography>
                ) : emailFound === false ? (
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    The email you entered is not registered in our system.
                  </Typography>
                ) : (
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    Enter your email address and we'll send you a link to reset your password.
                  </Typography>
                )}
              </Box>

              {/* Email Input Form */}
              {!resetEmailSent && (
                <Box component="form" onSubmit={handleCheckEmail} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    id="email"
                    label="Email address"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    error={emailError}
                    InputProps={{
                      endAdornment: emailValid && (
                        <Box 
                          component={CheckCircle}
                          className="tick-fade-in"
                          sx={{ 
                            color: '#4CAF50', 
                            fontSize: '20px'
                          }} 
                        />
                      )
                    }}
                    InputLabelProps={{
                      sx: {
                        '& .MuiInputLabel-asterisk': {
                          color: 'red'
                        }
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-error fieldset': {
                          borderColor: 'red'
                        }
                      }
                    }}
                    variant="outlined"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={!email || !emailValid || isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{
                      py: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'success.dark'
                      }
                    }}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </Box>
              )}

              {/* Back to Login Link */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Link
                  component="button"
                  onClick={handleBackToLogin}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'none'
                    }
                  }}
                >
                  <ArrowLeft style={{ fontSize: 16 }} />
                  Back to login
                </Link>
              </Box>
            </Paper>

            {/* Custom Popup */}
            <CustomPopup
              isOpen={showPopup}
              onClose={() => setShowPopup(false)}
              title={popupConfig.title}
              message={popupConfig.message}
              type={popupConfig.type}
              customActions={popupConfig.customActions}
            />
          </Box>
        </ContentWrapper>
      </PageLayout>
    </ThemeProvider>
  )
}
