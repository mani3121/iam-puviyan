import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Mail, Linkedin, Lock, Eye, EyeOff, Building } from 'lucide-react'
import { LinkedInAuthService } from '../services/linkedInAuthService'
import { storeUserSignup, sendVerificationEmail } from '../services/firebaseService'
import PageLayout from '../components/PageLayout'
import ContentWrapper from '../components/ContentWrapper'
import CustomPopup from '../components/CustomPopup'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Checkbox,
  Link,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Fade,
  Chip
} from '@mui/material'
import { styled } from '@mui/material/styles'

// Material UI Dark Theme with Green Accents
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4CAF50',
      dark: '#388E3C',
      light: '#66BB6A',
    },
    secondary: {
      main: '#FFC107',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
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

// Styled Components
const StyledCarouselCard = styled(Card)(({ theme }) => ({
  background: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(16px)',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(4),
  maxWidth: 600,
  margin: '0 auto',
  boxShadow: theme.shadows[24],
}))

const StyledCarouselImage = styled(CardMedia)(({ theme }) => ({
  height: 240,
  width: 320,
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[8],
}))

const StyledIconButton = styled(IconButton)(({ }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(8px)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
}))

const StyledDotButton = styled(Button)<{ theme?: any; active?: boolean }>(({ theme, active }) => ({
  width: active ? theme.spacing(2.5) : theme.spacing(0.75),
  height: theme.spacing(0.75),
  minWidth: 'auto',
  borderRadius: theme.spacing(0.375),
  backgroundColor: active ? theme.palette.common.white : 'rgba(255, 255, 255, 0.6)',
  padding: 0,
  margin: theme.spacing(0, 0.5),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.common.white,
  },
}))

interface CarouselSlide {
  id: number
  title: string
  description: string
  image: string
}

const carouselSlides: CarouselSlide[] = [
  {
    id: 1,
    title: "GROW YOUR IMPACT. ENERGIZE YOUR BRAND.",
    description: "Join the movement towards a greener, more sustainable future for everyone.",
    image: "/src/assets/Co-2.avif"
  },
  {
    id: 2,
    title: "SUSTAINABLE LIVING",
    description: "Connect with changemakers building sustainable communities worldwide.",
    image: "/src/assets/Co-2.avif"
  },
  {
    id: 3,
    title: "ECO-INNOVATION",
    description: "Transform your environmental impact with powerful sustainable tools.",
    image: "/src/assets/Co-2.avif"
  }
]

export default function Login() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupConfig, setPopupConfig] = useState({
    title: '',
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  })
  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    password: '',
    agreeToTerms: false
  })
  const [signupLoading, setSignupLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.agreeToTerms) {
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
        setPopupConfig({
          title: 'Signup Failed',
          message: result.message,
          type: 'error'
        })
        setShowPopup(true)
        return
      }
      
      // Send verification email
      if (result.verificationLink) {
        const emailResult = await sendVerificationEmail(formData.email, result.verificationLink)
        
        if (emailResult.success) {
          setPopupConfig({
            title: 'Signup Successful',
            message: `${result.message} ${emailResult.message}`,
            type: 'success'
          })
          setShowPopup(true)
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
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            {/* Main Content */}
            <Box sx={{ flex: 1, display: 'flex' }}>
              {/* Left Side - Carousel */}
              <Box
                sx={{
                  display: { xs: 'none', lg: 'flex' },
                  width: { lg: '50%' },
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)'
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 6, textAlign: 'center' }}>
                  <Fade in={true} timeout={800}>
                    <StyledCarouselCard>
                      <StyledCarouselImage
                        image={carouselSlides[currentSlide].image}
                        title={carouselSlides[currentSlide].title}
                      />
                      <CardContent sx={{ p: 0 }}>
                        <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 3, color: 'white', lineHeight: 1.2 }}>
                          {carouselSlides[currentSlide].title}
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3, maxWidth: 400, mx: 'auto', lineHeight: 1.6 }}>
                          {carouselSlides[currentSlide].description}
                        </Typography>
                      </CardContent>
                    </StyledCarouselCard>
                  </Fade>
                  
                  {/* Carousel Dots */}
                  <Box sx={{ display: 'flex', mt: 3 }}>
                    {carouselSlides.map((_, index) => (
                      <StyledDotButton
                        key={index}
                        active={index === currentSlide}
                        onClick={() => setCurrentSlide(index)}
                      />
                    ))}
                  </Box>
                  
                  {/* Navigation Buttons */}
                  <StyledIconButton
                    sx={{ left: 3 }}
                    onClick={prevSlide}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box component="span" sx={{ color: 'white', fontSize: 28, display: 'flex' }}>
                        <ChevronLeft size={28} color="white" />
                      </Box>
                    </Box>
                  </StyledIconButton>
                  
                  <StyledIconButton
                    sx={{ right: 3 }}
                    onClick={nextSlide}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box component="span" sx={{ color: 'white', fontSize: 28, display: 'flex' }}>
                        <ChevronRight size={28} color="white" />
                      </Box>
                    </Box>
                  </StyledIconButton>
                </Box>
              </Box>

              {/* Right Side - Signup Form */}
              <Box sx={{ width: { xs: '100%', lg: '50%' }, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: { xs: 4, lg: 8 } }}>
                <Box sx={{ maxWidth: 400, mx: 'auto', width: '100%', bgcolor: '#000000' }}>
                  <Box sx={{ mb: 6 }}>
                    {/* Placeholder for Icon */}
                    <Box sx={{ width: 40, height: 40, bgcolor: 'primary.main', borderRadius: '8px', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                      Let's get started
                    </Typography>
                  </Box>

                  {/* Signup Form */}
                  <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 , bgcolor: '#000000', border: '2px solid', borderColor: '#000000' }}>
                    <TextField
                      fullWidth
                      id="organizationName"
                      label="Organization name"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      required
                      InputProps={{
                        startAdornment: <Building style={{ color: 'text.secondary', marginRight: '4px' }} />
                      }}
                      variant="outlined"
                    />

                    <TextField
                      fullWidth
                      id="email"
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      InputProps={{
                        startAdornment: <Mail style={{ color: 'text.secondary', marginRight: '4px' }} />
                      }}
                      variant="outlined"
                    />
                    
                    <TextField
                      fullWidth
                      id="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      InputProps={{
                        startAdornment: <Lock style={{ color: 'text.secondary', marginRight: '4px' }} />,
                        endAdornment: (
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <EyeOff style={{ color: 'text.secondary' }} /> : <Eye style={{ color: 'text.secondary' }} />}
                          </IconButton>
                        )
                      }}
                      variant="outlined"
                    />

                    {/* Terms Checkbox */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                        color="primary"
                        sx={{ mt: 0.5 }}
                      />
                      <Box component="label" htmlFor="terms" sx={{ fontSize: '0.875rem', color: 'text.secondary', lineHeight: 1.4, cursor: 'pointer' }}>
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
                    </Box>
                    <Box>
                  <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
                    or sign up using
                  </Typography>

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
                    <Link href="/login" sx={{ color: 'primary.main', fontWeight: 'medium', '&:hover': { color: 'primary.light' } }}>
                      Sign in
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Footer */}
            <Box component="footer" sx={{ bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', py: 3, px: 4 }}>
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
            />
          </Box>
        </ContentWrapper>
      </PageLayout>
    </ThemeProvider>
  )
}
