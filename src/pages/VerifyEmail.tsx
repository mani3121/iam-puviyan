import {
  Box,
  Button,
  CircularProgress,
  Link,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material'
import { Mail, ArrowLeft, RefreshCw, Lock, CheckCircle, X, Eye, EyeOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import logoImage from '../assets/IamPuviyanLogo.png'
import ContentWrapper from '../components/ContentWrapper'
import CustomPopup from '../components/CustomPopup'
import PageLayout from '../components/PageLayout'
import { verifyEmail, updateUserPassword } from '../services/firebaseService'

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
  const [isResetPassword] = useState(searchParams.get('reset') === 'true')
  
  // Password reset form states
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Password strength helpers
  const getPasswordScore = (value: string) => {
    let score = 0
    if (!value) return 0
    if (value.length >= 8) score += 1
    if (/[A-Z]/.test(value)) score += 1
    if (/[0-9]/.test(value)) score += 1
    if (/[^A-Za-z0-9]/.test(value)) score += 1
    return score
  }

  const getStrength = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return { label: 'Too weak', color: 'error', value: 25 }
      case 2:
        return { label: 'Weak', color: 'warning', value: 50 }
      case 3:
        return { label: 'Medium', color: 'info', value: 75 }
      case 4:
        return { label: 'Strong', color: 'success', value: 100 }
      default:
        return { label: '', color: 'inherit', value: 0 }
    }
  }

  // Handle email verification when component loads (only for non-reset flows)
  useEffect(() => {
    const userId = searchParams.get('userId')
    const emailParam = searchParams.get('email')
    
    // Only auto-verify for normal signup verification, not password reset
    if (userId && emailParam && !isResetPassword) {
      handleEmailVerification(userId, emailParam)
    }
  }, [searchParams, isResetPassword])

  const handleEmailVerification = async (userId: string, email: string) => {
    setIsVerifying(true)
    try {
      const result = await verifyEmail(userId, email)
      
      if (result.success) {
        setVerificationStatus('success')
        // Normal signup verification - route to dashboard with welcome toast
        setPopupConfig({
          title: 'Email Verified!',
          message: result.message,
          type: 'success',
          customActions: [
            {
              label: 'OK',
              onClick: () => navigate('/dashboard', { state: { showWelcomeToast: true } }),
              variant: 'contained',
              color: 'primary'
            }
          ]
        })
        setShowPopup(true)
      } else {
        setVerificationStatus('error')
        setPopupConfig({
          title: 'Verification Failed',
          message: result.message,
          type: 'error'
        })
        setShowPopup(true)
      }
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

  // Password reset form validation and submission
  const validatePasswords = () => {
    let isValid = true
    
    if (!password || password.length < 8) {
      setPasswordError(true)
      isValid = false
    } else {
      setPasswordError(false)
    }
    
    if (!confirmPassword || confirmPassword !== password) {
      setConfirmPasswordError(true)
      isValid = false
    } else {
      setConfirmPasswordError(false)
    }
    
    return isValid
  }

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePasswords()) {
      return
    }

    setIsSubmitting(true)
    try {
      // Update the password
      const updateResult = await updateUserPassword(email, password)
      
      if (updateResult.success) {
        // Verify email to mark as verified
        const userId = searchParams.get('userId')
        if (userId) {
          await verifyEmail(userId, email)
        }
        
        setVerificationStatus('success')
        setPopupConfig({
          title: 'Password Reset Successful!',
          message: 'Your password has been reset successfully. You can now log in with your new password.',
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
        setShowPopup(true)
      } else {
        setPopupConfig({
          title: 'Password Reset Failed',
          message: updateResult.message,
          type: 'error'
        })
        setShowPopup(true)
      }
    } catch (error) {
      setPopupConfig({
        title: 'Error',
        message: 'Failed to reset password. Please try again.',
        type: 'error'
      })
      setShowPopup(true)
    } finally {
      setIsSubmitting(false)
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
              {/* Icon */}
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
                  {isVerifying || isSubmitting ? (
                    <CircularProgress size={40} color="primary" />
                  ) : verificationStatus === 'success' ? (
                    isResetPassword ? <Lock style={{ fontSize: 40, color: '#4CAF50' }} /> : <Mail style={{ fontSize: 40, color: '#4CAF50' }} />
                  ) : verificationStatus === 'error' ? (
                    isResetPassword ? <Lock style={{ fontSize: 40, color: '#CF6679' }} /> : <Mail style={{ fontSize: 40, color: '#CF6679' }} />
                  ) : (
                    isResetPassword ? <Lock style={{ fontSize: 40, color: '#4CAF50' }} /> : <Mail style={{ fontSize: 40, color: '#4CAF50' }} />
                  )}
                </Box>
              </Box>

              {/* Title and Description */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ color: '#D4D4D4', fontWeight: 'bold', mb: 2, fontFamily: '"Segoe UI Variable"' }}>
                  {isVerifying || isSubmitting ? (isResetPassword ? 'Resetting Password...' : 'Verifying Your Email...') : 
                   verificationStatus === 'success' ? (isResetPassword ? 'Password Reset Successful!' : 'Email Verified!') :
                   verificationStatus === 'error' ? (isResetPassword ? 'Reset Failed' : 'Verification Failed') :
                   (isResetPassword ? 'Reset Your Password' : 'Verify your email')}
                </Typography>
                
                {isVerifying || isSubmitting ? (
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {isResetPassword 
                      ? 'Please wait while we reset your password...'
                      : 'Please wait while we verify your email address...'}
                  </Typography>
                ) : verificationStatus === 'success' ? (
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {isResetPassword
                      ? 'Your password has been reset successfully! You can now log in with your new password.'
                      : 'Your email has been successfully verified! You can now log in to your account.'}
                  </Typography>
                ) : verificationStatus === 'error' ? (
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {isResetPassword
                      ? 'There was an issue resetting your password. Please try again or request a new reset link.'
                      : 'There was an issue verifying your email. Please check the verification link or request a new one.'}
                  </Typography>
                ) : isResetPassword ? (
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    Enter your new password below to complete the reset.
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
                      Click the verification link in the email to complete your registration. If you don't see the email, check your spam folder.
                    </Typography>
                  </>
                )}
              </Box>

              {/* Password Reset Form - Only show when reset=true and not yet successful */}
              {isResetPassword && verificationStatus === 'pending' && !isSubmitting && (
                <Box component="form" onSubmit={handlePasswordResetSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    id="password"
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setPasswordError(false)
                    }}
                    required
                    error={passwordError}
                    helperText={passwordError ? 'Password must be at least 8 characters long' : ''}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {password && (() => {
                            const strength = getStrength(getPasswordScore(password))
                            const strengthColor =
                              strength.color === 'inherit' ? 'text.secondary' : `${strength.color}.main`

                            return (
                              <Typography
                                variant="caption"
                                sx={{
                                  mr: 1,
                                  color: strengthColor,
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {strength.label}
                              </Typography>
                            )
                          })()}
                          <IconButton
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'text.secondary' }}
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </IconButton>
                        </InputAdornment>
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

                  <TextField
                    fullWidth
                    id="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setConfirmPasswordError(false)
                    }}
                    required
                    error={confirmPasswordError}
                    helperText={confirmPasswordError ? 'Passwords do not match' : ''}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {confirmPassword && password && (
                            confirmPassword === password ? (
                              <Box
                                component={CheckCircle}
                                className="tick-fade-in"
                                sx={{
                                  color: '#4CAF50',
                                  fontSize: '20px',
                                  mr: 1
                                }}
                              />
                            ) : (
                              <Box
                                component={X}
                                className="tick-fade-in"
                                sx={{
                                  color: '#CF6679',
                                  fontSize: '20px',
                                  mr: 1
                                }}
                              />
                            )
                          )}
                          <IconButton
                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            sx={{ color: 'text.secondary' }}
                          >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </IconButton>
                        </InputAdornment>
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
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
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
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                  </Button>

                  <Button
                    variant="text"
                    onClick={() => navigate('/login')}
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
                    Back to login
                  </Button>
                </Box>
              )}

              {/* Action Buttons for normal verification */}
              {!isResetPassword && verificationStatus === 'pending' && !isVerifying && (
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

              {/* Error state buttons */}
              {verificationStatus === 'error' && !isVerifying && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={isResetPassword ? () => navigate('/forgot-password') : handleResendEmail}
                    disabled={!isResetPassword && (!canResend || resendLoading)}
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
                    {isResetPassword 
                      ? 'Request new reset link'
                      : resendLoading 
                        ? 'Sending...' 
                        : canResend 
                          ? 'Request new verification email' 
                          : `Request new (${countdown}s)`
                    }
                  </Button>

                  <Button
                    variant="text"
                    onClick={isResetPassword ? () => navigate('/login') : handleBackToSignup}
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
                    {isResetPassword ? 'Back to login' : 'Back to signup'}
                  </Button>
                </Box>
              )}

              {/* Help Text - only for non-reset flows */}
              {!isResetPassword && verificationStatus !== 'success' && (
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
              )}
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
              customActions={popupConfig.customActions}
            />
        </Box>
      </ContentWrapper>
    </PageLayout>
  )
}
