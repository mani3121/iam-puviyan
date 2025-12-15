import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Mail, Linkedin, Chrome, Lock, Eye, EyeOff } from 'lucide-react'
import { LinkedInAuthService } from '../services/linkedInAuthService'
import { storeUserSignup, sendVerificationEmail } from '../services/firebaseService'
import PageLayout from '../components/PageLayout'
import ContentWrapper from '../components/ContentWrapper'
import CustomPopup from '../components/CustomPopup'

interface CarouselSlide {
  id: number
  title: string
  description: string
  image: string
}

const carouselSlides: CarouselSlide[] = [
  {
    id: 1,
    title: "Sustainable Living",
    description: "Join the movement towards a greener, more sustainable future for everyone.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: 2,
    title: "Green Communities",
    description: "Connect with changemakers building sustainable communities worldwide.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: 3,
    title: "Eco-Innovation",
    description: "Transform your environmental impact with powerful sustainable tools.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  }
]

export default function AuthPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupConfig, setPopupConfig] = useState({
    title: '',
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  })
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [authLoading, setAuthLoading] = useState(false)
  const [signupLoading, setSignupLoading] = useState(false)

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
        // You can redirect to dashboard or update UI state here
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
      // Clean up URL
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
    
    // For signup, validate that passwords match
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setPopupConfig({
        title: 'Password Mismatch',
        message: 'Passwords do not match. Please try again.',
        type: 'error'
      })
      setShowPopup(true)
      return
    }
    
    // If signing up, store user data in Firestore
    if (!isLogin) {
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
        
        // Optionally switch to login mode after successful signup
        setIsLogin(true)
        // Clear form
        setFormData({
          email: '',
          password: '',
          confirmPassword: ''
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
    } else {
      // Handle login logic here (for now just log to console)
      setPopupConfig({
        title: 'Login Coming Soon',
        message: 'Login functionality will be implemented soon.',
        type: 'info'
      })
      setShowPopup(true)
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
    }
  }

  return (
    <PageLayout>
      <ContentWrapper maxWidth="desktop">
        <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Background Carousel for all devices */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900">
          <img
            src={carouselSlides[currentSlide].image}
            alt={carouselSlides[currentSlide].title}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Side - Carousel */}
        <div className="lg:w-1/2 relative overflow-hidden">
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">{carouselSlides[currentSlide].title}</h2>
            <p className="text-xl mb-8 text-gray-300">{carouselSlides[currentSlide].description}</p>
            
            <div className="flex space-x-2 mb-8">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 bg-[#1a1a1a]/95 backdrop-blur-sm">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-gray-400">
                {isLogin ? 'Sign in to continue to your account' : 'Join us and start your journey'}
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocialLogin('Microsoft')}
                className="w-full flex items-center justify-center space-x-3 bg-[#1a1a1a] hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors border border-gray-700"
              >
                <Chrome className="w-5 h-5" />
                <span>Continue with Microsoft</span>
              </button>
              
              <button
                onClick={() => handleSocialLogin('LinkedIn')}
                disabled={authLoading}
                className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Linkedin className="w-5 h-5" />
                <span>{authLoading ? 'Connecting...' : 'Continue with LinkedIn'}</span>
              </button>
              
              <button
                onClick={() => handleSocialLogin('Google')}
                className="w-full flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>Continue with Gmail</span>
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with email</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:border-[#5ABA52] text-white focus:bg-[#1a1a1a] autofill:bg-[#1a1a1a] autofill:text-white autofill:shadow-[inset_0_0_0px_1000px_#1a1a1a] [&:autofill]:bg-[#1a1a1a] [&:-webkit-autofill]:bg-[#1a1a1a] [&:-webkit-autofill]:text-white [&:-webkit-autofill]:-webkit-text-fill-color-white [&:-webkit-autofill]:-webkit-box-shadow-[inset_0_0_0_1000px_#1a1a1a]"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:border-[#5ABA52] text-white focus:bg-[#1a1a1a] autofill:bg-[#1a1a1a] autofill:text-white autofill:shadow-[inset_0_0_0px_1000px_#1a1a1a] [&:autofill]:bg-[#1a1a1a] [&:-webkit-autofill]:bg-[#1a1a1a] [&:-webkit-autofill]:text-white [&:-webkit-autofill]:-webkit-text-fill-color-white [&:-webkit-autofill]:-webkit-box-shadow-[inset_0_0_0_1000px_#1a1a1a]"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:border-[#5ABA52] text-white focus:bg-[#1a1a1a] autofill:bg-[#1a1a1a] autofill:text-white autofill:shadow-[inset_0_0_0px_1000px_#1a1a1a] [&:autofill]:bg-[#1a1a1a] [&:-webkit-autofill]:bg-[#1a1a1a] [&:-webkit-autofill]:text-white [&:-webkit-autofill]:-webkit-text-fill-color-white [&:-webkit-autofill]:-webkit-box-shadow-[inset_0_0_0_1000px_#1a1a1a]"
                      placeholder="Confirm your password"
                      required={!isLogin}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}
              
              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 rounded border-gray-700 bg-gray-800 text-blue-500" />
                    <span className="text-sm text-gray-400">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                    Forgot password?
                  </a>
                </div>
              )}
              
              <button
                type="submit"
                disabled={signupLoading}
                className="w-full bg-[#48C84F] hover:bg-[#5ABA52] text-white py-3 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                  isLogin ? 'Sign In' : 'Sign Up'
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-blue-400 hover:text-blue-300 font-medium"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Layout */}
      <div className="lg:hidden h-screen flex flex-col justify-center p-4 md:p-6 relative z-10 overflow-hidden">
        {/* Carousel Content Overlay */}
        <div className="text-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold mb-2">{carouselSlides[currentSlide].title}</h2>
          <p className="text-base md:text-lg text-gray-300 mb-4">{carouselSlides[currentSlide].description}</p>
          
          <div className="flex justify-center space-x-2 mb-4">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Auth Form Container */}
        <div className="bg-[#1a1a1a]/95 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-2xl flex-1 overflow-y-auto">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-4">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                {isLogin ? 'Sign in to continue to your account' : 'Join us and start your journey'}
              </p>
            </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-4">
            <button
              onClick={() => handleSocialLogin('Microsoft')}
              className="w-full flex items-center justify-center space-x-3 bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors border border-gray-700"
            >
              <Chrome className="w-5 h-5" />
              <span className="text-sm md:text-base">Continue with Microsoft</span>
            </button>
            
            <button
              onClick={() => handleSocialLogin('LinkedIn')}
              className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span className="text-sm md:text-base">Continue with LinkedIn</span>
            </button>
            
            <button
              onClick={() => handleSocialLogin('Google')}
              className="w-full flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="text-sm md:text-base">Continue with Gmail</span>
            </button>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1a1a1a] text-gray-400">Or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:border-[#5ABA52] text-white focus:bg-[#1a1a1a] autofill:bg-[#1a1a1a] autofill:text-white autofill:shadow-[inset_0_0_0px_1000px_#1a1a1a] [&:autofill]:bg-[#1a1a1a] [&:-webkit-autofill]:bg-[#1a1a1a] [&:-webkit-autofill]:text-white [&:-webkit-autofill]:-webkit-text-fill-color-white [&:-webkit-autofill]:-webkit-box-shadow-[inset_0_0_0_1000px_#1a1a1a]"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:border-[#5ABA52] text-white focus:bg-[#1a1a1a] autofill:bg-[#1a1a1a] autofill:text-white autofill:shadow-[inset_0_0_0px_1000px_#1a1a1a] [&:autofill]:bg-[#1a1a1a] [&:-webkit-autofill]:bg-[#1a1a1a] [&:-webkit-autofill]:text-white [&:-webkit-autofill]:-webkit-text-fill-color-white [&:-webkit-autofill]:-webkit-box-shadow-[inset_0_0_0_1000px_#1a1a1a]"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:border-[#5ABA52] text-white focus:bg-[#1a1a1a] autofill:bg-[#1a1a1a] autofill:text-white autofill:shadow-[inset_0_0_0px_1000px_#1a1a1a] [&:autofill]:bg-[#1a1a1a] [&:-webkit-autofill]:bg-[#1a1a1a] [&:-webkit-autofill]:text-white [&:-webkit-autofill]:-webkit-text-fill-color-white [&:-webkit-autofill]:-webkit-box-shadow-[inset_0_0_0_1000px_#1a1a1a]"
                    placeholder="Confirm your password"
                    required={!isLogin}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}
            
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 rounded border-gray-700 bg-gray-800 text-blue-500" />
                  <span className="text-sm text-gray-400">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                  Forgot password?
                </a>
              </div>
            )}
            
            <button
              type="submit"
              disabled={signupLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                isLogin ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-blue-400 hover:text-blue-300 font-medium"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
          </div>
        </div>

        {/* Mobile/Tablet Navigation Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors z-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors z-20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
      
      {/* Custom Popup */}
      <CustomPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title={popupConfig.title}
        message={popupConfig.message}
        type={popupConfig.type}
      />
      </ContentWrapper>
    </PageLayout>
  )
}
