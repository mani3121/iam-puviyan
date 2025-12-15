import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const userId = searchParams.get('userId')
        const email = searchParams.get('email')

        if (!userId || !email) {
          setStatus('error')
          setMessage('Invalid verification link. Missing required parameters.')
          return
        }

        // Check if user exists and get their data
        const userDoc = doc(db, 'org_login_details', userId)
        const userSnapshot = await getDoc(userDoc)

        if (!userSnapshot.exists()) {
          setStatus('error')
          setMessage('User not found. Please sign up again.')
          return
        }

        const userData = userSnapshot.data()

        // Check if email matches
        if (userData.email !== email) {
          setStatus('error')
          setMessage('Email mismatch. Please use the correct verification link.')
          return
        }

        // Check if already verified
        if (userData.emailVerified) {
          setStatus('success')
          setMessage('Your email has already been verified. You can now log in.')
          return
        }

        // Update user document to mark email as verified
        await updateDoc(userDoc, {
          emailVerified: true,
          verifiedAt: new Date().toISOString()
        })

        setStatus('success')
        setMessage('Email verified, click Signup button to continue')

        // Redirect to signup after 3 seconds
        setTimeout(() => {
          navigate('/signup')
        }, 3000)

      } catch (error) {
        console.error('Email verification error:', error)
        setStatus('error')
        setMessage('Failed to verify email. Please try again or contact support.')
      }
    }

    verifyEmail()
  }, [searchParams, navigate])

  const containerStyles = isMobile ? {
    padding: '20px',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a'
  } : {
    padding: '40px',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a'
  }

  const cardStyles = isMobile ? {
    backgroundColor: '#2a2a2a',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center' as const
  } : {
    backgroundColor: '#2a2a2a',
    borderRadius: '16px',
    padding: '48px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center' as const
  }

  const iconStyles = {
    width: isMobile ? '60px' : '80px',
    height: isMobile ? '60px' : '80px',
    margin: '0 auto 24px'
  }

  const titleStyles = isMobile ? {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#ffffff'
  } : {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#ffffff'
  }

  const messageStyles = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#9ca3af',
    marginBottom: '32px'
  }

  const buttonStyles = isMobile ? {
    backgroundColor: '#48C84F',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'background-color 0.3s'
  } : {
    backgroundColor: '#48C84F',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '16px 32px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'background-color 0.3s'
  }

  return (
    <div style={containerStyles}>
      <div style={cardStyles}>
        {status === 'loading' && (
          <>
            <div style={iconStyles}>
              <div style={{
                width: '100%',
                height: '100%',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #48C84F',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
            <h1 style={titleStyles}>Verifying Your Email</h1>
            <p style={messageStyles}>Please wait while we verify your email address...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={iconStyles}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#48C84F"/>
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={titleStyles}>Email Verified!</h1>
            <p style={messageStyles}>{message}</p>
            <button 
              style={buttonStyles}
              onClick={() => navigate('/signup')}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5ABA52'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#48C84F'}
            >
              Go to Signup
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={iconStyles}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#ef4444"/>
                <path d="M12 8v4m0 4h.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={titleStyles}>Verification Failed</h1>
            <p style={messageStyles}>{message}</p>
            <button 
              style={buttonStyles}
              onClick={() => navigate('/signup')}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5ABA52'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#48C84F'}
            >
              Back to Sign Up
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
