import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  createTheme,
  CssBaseline,
  IconButton,
  Link,
  TextField,
  ThemeProvider,
  Typography
} from '@mui/material'
import { Eye, EyeOff, Linkedin, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import slide1Image from '../assets/1.jpg'
import slide2Image from '../assets/2.jpg'
import slide3Image from '../assets/3.jpg'
import logoImage from '../assets/IamPuviyanLogo.png'
import ContentWrapper from '../components/ContentWrapper'
import CustomPopup from '../components/CustomPopup'
import LeftHeroPanel from '../components/LeftHeroPanel'
import PageLayout from '../components/PageLayout'
import { sendVerificationEmailViaEmailJS, initializeEmailJS } from '../services/emailjsConfig'
import { storeUserSignup } from '../services/firebaseService'
import { LinkedInAuthService } from '../services/linkedInAuthService'

// Slides data for LeftHeroPanel
const heroSlides = [
  {
    imageUrl: slide1Image,
    title: 'EMPOWER SUSTAINABLE LIVING',
    subtitle: 'Better employee retention. Attract top talent. Embrace higher productivity.',
  },
  {
    imageUrl: slide2Image, 
    title: 'BUILD YOUR',
    highlight: 'FUTURE.',
    subtitle: 'INNOVATE WITH CONFIDENCE.',
  },
  {
    imageUrl: slide3Image,
    title: 'ACCELERATE YOUR',
    subtitle: 'SUCCESS JOURNEY.',
  }
]

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

export default function Signup() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupConfig, setPopupConfig] = useState<PopupConfig>({
    title: '',
    message: '',
    type: 'success'
  })
  const [formData, setFormData] = useState({
    fullName: '',
    organizationName: '',
    email: '',
    password: '',
    agreeToTerms: false
  })
  const [formErrors, setFormErrors] = useState({
    fullName: false,
    organizationName: false,
    email: false,
    password: false,
    agreeToTerms: false
  })
  const [signupLoading, setSignupLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [emailValid, setEmailValid] = useState(false)

  // Initialize EmailJS on component mount
  useEffect(() => {
    initializeEmailJS()
  }, [])

  const validateForm = () => {
    const errors = {
      fullName: false,
      organizationName: false,
      email: false,
      password: false,
      agreeToTerms: false
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      errors.email = true
      setEmailValid(false)
    } else if (!emailRegex.test(formData.email)) {
      errors.email = true
      setEmailValid(false)
    } else {
      setEmailValid(true)
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = true
    } else if (formData.password.length < 8) {
      errors.password = true
    }
    
    // Full name validation
    if (!formData.fullName) {
      errors.fullName = true
    } else if (formData.fullName.length < 2) {
      errors.fullName = true
    }
    
    // Organization name validation
    if (!formData.organizationName) {
      errors.organizationName = true
    } else if (formData.organizationName.length < 2) {
      errors.organizationName = true
    }
    
    // Terms agreement validation Shuttle
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = true
    }
    
    setFormErrors(errors)
    return !errors.fullName && !errors.organizationName && !errors.email && !errors.password && !errors.agreeToTerms
  }

  useEffect(() => {
    // Check if this is a LinkedIn OAuth callback
    if (LinkedInAuthService.isLinkedInCallback()) {
      const params = LinkedInAuthService.extractOAuthParams()
      if (params) {
        handleLinkedInCallback(params.code, params.state)
      }
    }
  }, [])

  const handleLinkedInCallback = async (code: string, state: string) => {
    setAuthLoading(true)
    try {
      const result = await LinkedInAuthService.handleAuthCallback(code, state)
      if (result.success && result.user) {
        setPopupConfig({
          title: 'Authentication Successful!',
          message: `Welcome ${result.user.firstName} ${result.user.lastName}!`,
          type: 'success'
        })
        setShowPopup(true)
      } else {
        setPopupConfig({
          title: 'Authentication Failed',
          message: result.message || 'LinkedIn authentication failed. Please try again.',
          type: 'error'
        })
        setShowPopup(true)
      }
    } catch (error) {
      setPopupConfig({
        title: 'Authentication Error',
        message: 'An error occurred during authentication. Please try again.',
        type: 'error'
      })
      setShowPopup(true)
    } finally {
      setAuthLoading(false)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!validateForm()) {
      return
    }
    
    // Check terms agreement
    if (!formData.agreeToTerms) {
      setFormErrors({ ...formErrors, agreeToTerms: true })
      setPopupConfig({
        title: 'Terms Agreement Required',
        message: 'Please agree to the Terms of Service and Privacy Policy to continue.',
        type: 'error'
      })
      setShowPopup(true)
      return
    }
    
    setSignupLoading(true)
    try {
      const result = await storeUserSignup(formData.email, formData.password)
      
      if (!result.success) {
        if (result.alreadyExists) {
          // Show custom popup with login button for already registered email
          setPopupConfig({
            title: 'Account Already Registered',
            message: 'Your account is already registered with this email address.',
            type: 'info',
            customActions: [
              {
                label: 'Login',
                onClick: () => navigate('/login'),
                variant: 'contained',
                color: 'primary'
              }
            ]
          })
          setShowPopup(true)
        } else {
          setPopupConfig({
            title: 'Signup Failed',
            message: result.message,
            type: 'error'
          })
          setShowPopup(true)
        }
        return
      }
      
      // Send verification email using EmailJS
      if (result.verificationLink) {
        const emailResult = await sendVerificationEmailViaEmailJS(
          formData.email, 
          result.verificationLink, 
          formData.fullName
        )
        
        if (emailResult.success) {
          // Navigate to verify email page instead of showing popup
          navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`)
        } else {
          setPopupConfig({
            title: 'Email Verification Issue',
            message: `${result.message} However, there was an issue sending the verification email: ${emailResult.message}`,
            type: 'error'
          })
          setShowPopup(true)
        }
      } else {
        setPopupConfig({
          title: 'Signup Successful',
          message: result.message,
          type: 'success'
        })
        setShowPopup(true)
      }
      
      // Clear form
      setFormData({
        fullName: '',
        organizationName: '',
        email: '',
        password: '',
        agreeToTerms: false
      })
    } catch (error) {
      console.error('Signup error:', error)
      setPopupConfig({
        title: 'Signup Error',
        message: 'An error occurred during signup. Please try again.',
        type: 'error'
      })
      setShowPopup(true)
    } finally {
      setSignupLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    if (provider === 'LinkedIn') {
      setAuthLoading(true)
      try {
        LinkedInAuthService.initiateLinkedInAuth()
      } catch (error) {
        console.error('LinkedIn auth initiation failed:', error)
        setPopupConfig({
          title: 'Authentication Error',
          message: 'Failed to initiate LinkedIn authentication. Please try again.',
          type: 'error'
        })
        setShowPopup(true)
      }
    } else {
      // TODO: Implement other providers (Microsoft, Google)
      setPopupConfig({
        title: 'Coming Soon',
        message: `${provider} authentication will be available soon.`,
        type: 'info'
      })
      setShowPopup(true)
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <PageLayout>
        <ContentWrapper maxWidth="desktop">
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor:  '#1a1a1a' }}>
            {/* Main Content */}
            <Box sx={{ flex: 1, display: 'flex' }}>
              {/* Left Side - Hero Panel */}
              <Box
                sx={{
                  display: { xs: 'none', lg: 'flex' },
                  width: { lg: '55%' },
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  p: 6,
                  background: '#1a1a1a'
                }}
              >
                <LeftHeroPanel 
                  slides={heroSlides}
                  // autoRotate={true}
                  // intervalMs={6000}
                  className="w-full h-full max-h-[800px]"
                />
              </Box>

              {/* Right Side - Signup Form */}
              <Box sx={{ width: { xs: '100%', lg: '45%' }, display: 'flex', flexDirection: 'column', justifyContent: 'center',  }}>
                <Box sx={{ bgcolor: '#1a1a1a', textAlign: 'left', pl: 2, pr: 2, pt: 2, pb: 0 }}>
                  <Box sx={{ mb: 1, textAlign: 'left', ml: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 3 }}>
                      <Box  
                        component="img"
                        src={logoImage}
                        alt="IamPuviyan Logo"
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                      <Typography sx={{ color: '#D4D4D4', fontFamily: '"Segoe UI Variable"', fontSize: '12px', lineHeight: 1.2, textAlign: 'left' }}>
                        IAMPUVIYAN
                        <br />
                        <Typography component="span" sx={{ fontSize: '14px' }}>
                          ORGANISATION
                        </Typography>
                      </Typography>
                    </Box>
                    <Box >
                      <Typography sx={{ color: '#D4D4D4', textAlign: 'left', fontFamily: '"Segoe UI Variable"', fontSize: '28px' }}>
                        Let's get started
                      </Typography> 
                    </Box>
                </Box>

                {/* Signup Form */}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3, bgcolor: '#1a1a1a', border: '22px solid', borderColor: '#1a1a1a', alignItems: 'center' }}>
                  <Box sx={{ width: '100%' }}>
                    <TextField
                      fullWidth
                      id="fullName"
                      label="Full name"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value })
                        // Clear error when user starts typing
                        if (formErrors.fullName) {
                          setFormErrors({ ...formErrors, fullName: false })
                        }
                      }}
                      required
                      error={formErrors.fullName}
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
                    <TextField
                      fullWidth
                      id="email"
                      label="Work Email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value })
                        // Clear error when user starts typing
                        if (formErrors.email) {
                          setFormErrors({ ...formErrors, email: false })
                        }
                        // Validate email on change
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        if (e.target.value && emailRegex.test(e.target.value)) {
                          setEmailValid(true)
                        } else {
                          setEmailValid(false)
                        }
                      }}
                      required
                      error={formErrors.email}
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
                        },
                        mt: 2
                      }}
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      id="organizationName"
                      label="Organisation Name"
                      placeholder="Enter your organisation or community name"
                      value={formData.organizationName}
                      onChange={(e) => {
                        setFormData({ ...formData, organizationName: e.target.value })
                        // Clear error when user starts typing
                        if (formErrors.organizationName) {
                          setFormErrors({ ...formErrors, organizationName: false })
                        }
                      }}
                      required
                      error={formErrors.organizationName}
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
                        },
                        mt: 2
                      }}
                      variant="outlined"
                    />
                  </Box>
                  
                  <TextField
                    fullWidth
                    id="password"
                    label="Password*"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      // Clear error when user starts typing
                      if (formErrors.password) {
                        setFormErrors({ ...formErrors, password: false })
                      }
                    }}
                    required
                    error={formErrors.password}
                    InputProps={{
                      // Lock icon removed as requested
                      endAdornment: (
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <EyeOff style={{ color: 'text.secondary' }} /> : <Eye style={{ color: 'text.secondary' }} />}
                        </IconButton>
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

                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onChange={(e) => {
                          setFormData({ ...formData, agreeToTerms: e.target.checked })
                          // Clear error when user clicks checkbox
                          if (formErrors.agreeToTerms) {
                            setFormErrors({ ...formErrors, agreeToTerms: false })
                          }
                        }}
                        color={formErrors.agreeToTerms ? 'error' : 'primary'}
                        sx={{
                          color: formErrors.agreeToTerms ? 'red' : 'inherit'
                        }}
                      />
                      <Box component="label" htmlFor="terms" sx={{ fontSize: '0.720rem', color: 'text.secondary', lineHeight: 1.4, cursor: 'pointer' }}>
                        I agree to the{' '}
                        <Link href="/terms" sx={{ color: 'primary.main', '&:hover': { color: 'primary.light' } }}>
                          Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link href="/privacy" sx={{ color: 'primary.main', '&:hover': { color: 'primary.light' } }}>
                          Privacy Policy
                        </Link>
                      </Box>
                    </Box>
                    
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={signupLoading}
                      size="large"
                      sx={{ py: 1.5, fontSize: '1rem', fontWeight: 600, color: 'white' }}
                    >
                      {signupLoading ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                          Creating Account...
                        </>
                      ) : (
                        'SIGN UP'
                      )}
                    </Button>
                  </Box>
                  <br/>
                    </Box>
                    
                    <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 1, maxWidth: 400, mx: 'auto', px: 0 }}>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider', maxWidth: '150px' }} />
                    <Typography variant="body2" sx={{ px: 2, color: 'text.secondary', fontSize: '0.875rem', flexShrink: 0 }}>
                      or sign up using
                    </Typography>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider', maxWidth: '150px' }} />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                    <Chip
                      icon={
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      }
                      label="Google"
                      onClick={() => handleSocialLogin('Google')}
                      sx={{ 
                        bgcolor: 'background.paper', 
                        border: '1px solid',
                        borderColor: 'divider',
                         borderRadius: '8px',
                        '&:hover': { 
                          bgcolor: 'action.hover',
                          borderColor: 'text.secondary'
                        },
                        cursor: 'pointer'
                      }}
                    />
                    
                    <Chip
                      icon={
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path fill="#F25022" d="M11.4 11.4H2.6V2.6h8.8v8.8z"/>
                          <path fill="#7FBA00" d="M21.4 11.4h-8.8V2.6h8.8v8.8z"/>
                          <path fill="#00A4EF" d="M11.4 21.4H2.6v-8.8h8.8v8.8z"/>
                          <path fill="#FFB900" d="M21.4 21.4h-8.8v-8.8h8.8v8.8z"/>
                        </svg>
                      }
                      label="Microsoft"
                      onClick={() => handleSocialLogin('Microsoft')}
                      sx={{ 
                        bgcolor: 'background.paper', 
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '8px',
                        '&:hover': { 
                          bgcolor: 'action.hover',
                          borderColor: 'text.secondary'
                        },
                        cursor: 'pointer'
                      }}
                    />
                    
                    <Chip
                      icon={<Linkedin style={{ color: '#0077B5', fontSize: '20px' }} />}
                      label="LinkedIn"
                      onClick={() => handleSocialLogin('LinkedIn')}
                      disabled={authLoading}
                      sx={{ 
                        bgcolor: 'background.paper', 
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '8px',
                        '&:hover': { 
                          bgcolor: 'action.hover',
                          borderColor: 'text.secondary'
                        },
                        cursor: authLoading ? 'not-allowed' : 'pointer'
                      }}
                    />
                  </Box>

                  <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
                    Already have an account?{' '}
                    <Link 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault()
                        navigate('/login')
                      }}
                      sx={{ color: 'primary.main', fontWeight: 'medium', '&:hover': { color: 'primary.light' } }}
                    >
                      Sign in
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Footer */}
            <Box component="footer" sx={{  bgcolor: '#1a1a1a', borderTop: 1, borderColor: 'divider', py: 3, px: 4 }}>
              <Box sx={{ maxWidth: 'lg', mx: 'auto', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ mb: { xs: 2, sm: 0 } }}>
                  <Link href="/terms" sx={{ color: '#A3A3A3', '&:hover': { color: 'text.primary' }, mr: 1, fontFamily: '"Segoe UI Variable"', fontSize: '14px', fontStyle: 'normal', fontWeight: 400, lineHeight: '17.5px', textDecoration: 'none' }}>Terms of Service</Link>
                  <Typography component="span" sx={{ color: '#A3A3A3', mx: 1, fontFamily: '"Segoe UI Variable"', fontSize: '14px', fontStyle: 'normal', fontWeight: 400, lineHeight: '17.5px' }}>|</Typography>
                  <Link href="/privacy" sx={{ color: '#A3A3A3', '&:hover': { color: 'text.primary' }, fontFamily: '"Segoe UI Variable"', fontSize: '14px', fontStyle: 'normal', fontWeight: 400, lineHeight: '17.5px', textDecoration: 'none' }}>Privacy Policy</Link>
                </Box>
                <Typography variant="body2" sx={{ color: '#A3A3A3', fontFamily: '"Segoe UI Variable"', fontSize: '14px', fontStyle: 'normal', fontWeight: 400, lineHeight: '17.5px' }}>
                  All rights reserved © 2025 Puviyan Digital Solutions Private Limited.
                </Typography>
              </Box>
            </Box>

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
