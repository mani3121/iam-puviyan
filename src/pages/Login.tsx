import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Mail, Linkedin, Chrome, Lock, Eye, EyeOff, Building } from 'lucide-react'
import { LinkedInAuthService } from '../services/linkedInAuthService'
import { storeUserSignup, sendVerificationEmail } from '../services/firebaseService'
import PageLayout from '../components/PageLayout'
import ContentWrapper from '../components/ContentWrapper'
import CustomPopup from '../components/CustomPopup'

// Material Design Colors (Dark Theme with Green Accents)
const mdColors = {
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  primaryLight: '#66BB6A',
  secondary: '#FFC107',
  surface: '#1e1e1e',
  background: '#121212',
  error: '#CF6679',
  onPrimary: '#FFFFFF',
  onSecondary: '#000000',
  onSurface: '#FFFFFF',
  onBackground: '#FFFFFF',
  text: '#E0E0E0',
  textSecondary: '#B0B0B0',
  divider: '#424242',
  outline: '#616161',
  buttonGreen: '#4CAF50'
}

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
    <PageLayout>
      <ContentWrapper maxWidth="desktop">
        <div className="min-h-screen bg-background text-text relative flex flex-col">
          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Left Side - Carousel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
              <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
                <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-10 shadow-2xl max-w-2xl mx-auto border border-gray-800">
                  <img
                    src={carouselSlides[currentSlide].image}
                    alt={carouselSlides[currentSlide].title}
                    className="w-80 h-60 object-cover rounded-2xl mb-8 shadow-xl"
                  />
                  <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-lg leading-tight">
                    {carouselSlides[currentSlide].title}
                  </h2>
                  <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
                    {carouselSlides[currentSlide].description}
                  </p>
                </div>
                
                <div className="flex space-x-3 mt-8">
                  {carouselSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentSlide ? 'bg-white w-10' : 'bg-white/60'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={prevSlide}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-gray-800/50 backdrop-blur-sm rounded-full hover:bg-gray-700/50 transition-all shadow-xl"
                >
                  <ChevronLeft className="w-7 h-7 text-white" />
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-gray-800/50 backdrop-blur-sm rounded-full hover:bg-gray-700/50 transition-all shadow-xl"
                >
                  <ChevronRight className="w-7 h-7 text-white" />
                </button>
              </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 bg-surface">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-8">
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{color: mdColors.buttonGreen}}>
                    Create Account
                  </h1>
                  <p className="text-gray-400 text-lg">
                    Join us and start your journey
                  </p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      id="organizationName"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      className="peer w-full px-4 py-3 bg-transparent border-2 border-gray-600 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-white placeholder-transparent"
                      placeholder="Organization name"
                      required
                    />
                    <label
                      htmlFor="organizationName"
                      className="absolute left-4 -top-2.5 bg-surface px-1 text-sm text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-green-500 peer-focus:bg-surface"
                    >
                      Organization name
                    </label>
                    <Building className="absolute right-3 top-3.5 w-5 h-5 text-gray-500" />
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="peer w-full px-4 py-3 bg-transparent border-2 border-gray-600 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-white placeholder-transparent"
                      placeholder="Email"
                      required
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 -top-2.5 bg-surface px-1 text-sm text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-green-500 peer-focus:bg-surface"
                    >
                      Email
                    </label>
                    <Mail className="absolute right-3 top-3.5 w-5 h-5 text-gray-500" />
                  </div>
                  
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="peer w-full px-4 py-3 pr-12 bg-transparent border-2 border-gray-600 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-white placeholder-transparent"
                      placeholder="Password"
                      required
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-4 -top-2.5 bg-surface px-1 text-sm text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-green-500 peer-focus:bg-surface"
                    >
                      Password
                    </label>
                    <Lock className="absolute right-10 top-3.5 w-5 h-5 text-gray-500" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                      className="mt-1 rounded border-gray-600 bg-surface text-green-500 focus:ring-green-500 focus:ring-2"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-400 leading-tight">
                      I agree to the <a href="/terms" className="text-green-500 hover:text-green-400 font-medium">Terms of Service</a> and <a href="/privacy" className="text-green-500 hover:text-green-400 font-medium">Privacy Policy</a>
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={signupLoading}
                    className="w-full bg-green-600 hover:bg-green-500 text-white py-3 px-6 rounded-lg transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center"
                    style={{backgroundColor: signupLoading ? undefined : mdColors.buttonGreen}}
                  >
                    {signupLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      'SIGN UP'
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center text-gray-500 text-sm">
                  or sign up using
                </div>

                <div className="flex justify-center space-x-3 mt-6">
                  <button
                    onClick={() => handleSocialLogin('Google')}
                    className="flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-300 rounded-full hover:border-gray-400 hover:shadow-md transition-all shadow-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => handleSocialLogin('Microsoft')}
                    className="flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-300 rounded-full hover:border-gray-400 hover:shadow-md transition-all shadow-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#F25022" d="M11.4 11.4H2.6V2.6h8.8v8.8z"/>
                      <path fill="#7FBA00" d="M21.4 11.4h-8.8V2.6h8.8v8.8z"/>
                      <path fill="#00A4EF" d="M11.4 21.4H2.6v-8.8h8.8v8.8z"/>
                      <path fill="#FFB900" d="M21.4 21.4h-8.8v-8.8h8.8v8.8z"/>
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => handleSocialLogin('LinkedIn')}
                    disabled={authLoading}
                    className="flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-300 rounded-full hover:border-gray-400 hover:shadow-md transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Linkedin className="w-5 h-5 text-blue-600" />
                  </button>
                </div>

                <div className="mt-8 text-center text-gray-600">
                  Already have an account?{' '}
                  <a href="/login" className="text-green-500 hover:text-green-400 font-medium">
                    Sign in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-surface border-t border-gray-800 py-6 px-8">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
              <div className="mb-3 sm:mb-0">
                <a href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                <span className="mx-2">•</span>
                <a href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
              </div>
              <div>
                All rights reserved © 2025 Puviyan Digital Solutions Private Limited.
              </div>
            </div>
          </footer>

          {/* Custom Popup */}
          <CustomPopup
            isOpen={showPopup}
            onClose={() => setShowPopup(false)}
            title={popupConfig.title}
            message={popupConfig.message}
            type={popupConfig.type}
          />
        </div>
      </ContentWrapper>
    </PageLayout>
  )
}
