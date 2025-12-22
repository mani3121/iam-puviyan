import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { updateDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Avatar,
  Fade,
  Slide
} from '@mui/material'
import { CheckCircle } from 'lucide-react'

// Material UI Dark Theme with Green Accents
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#48C84F',
      dark: '#388E3C',
      light: '#66BB6A',
    },
    background: {
      default: '#1a1a1a',
      paper: '#2a2a2a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af',
    },
    success: {
      main: '#48C84F',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
})
export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success'>('loading')
  const [message, setMessage] = useState('')


  useEffect(() => {
    const verifyEmail = async () => {
      const userId = searchParams.get('userId')
      //const email = searchParams.get('email')

      // Check if user exists and get their data by searching userId field
      const usersRef = collection(db, 'org_login_details')
      const q = query(usersRef, where('userId', '==', userId || ''))
      const querySnapshot = await getDocs(q)

      // Get the first matching user document
      const userDoc = querySnapshot.docs[0]
      //const userData = userDoc.data()

      // Update user document to mark email as verified
      await updateDoc(userDoc.ref, {
        emailVerified: true,
        verifiedAt: new Date().toISOString()
      })

      // Show success immediately
      setStatus('success')
      setMessage('Email verified, click Signup button to continue')

      // Redirect to signup after 3 seconds
      setTimeout(() => {
        navigate('/signup')
      }, 3000)
    }

    verifyEmail()
  }, [searchParams, navigate])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Container maxWidth="sm">
          <Card
            sx={{
              bgcolor: 'background.paper',
              borderRadius: { xs: 3, md: 4 },
              p: { xs: 3, md: 6 },
              boxShadow: { xs: 4, md: 10 },
              textAlign: 'center',
              maxWidth: { xs: 400, md: 500 },
              mx: 'auto'
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {status === 'loading' && (
                <Fade in={true} timeout={500}>
                  <Box>
                    <Box
                      sx={{
                        width: { xs: 60, md: 80 },
                        height: { xs: 60, md: 80 },
                        margin: '0 auto 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <CircularProgress size="100%" thickness={4} />
                    </Box>
                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        fontWeight: 'bold',
                        mb: 2,
                        color: 'text.primary'
                      }}
                    >
                      Verifying Your Email
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.6
                      }}
                    >
                      Please wait while we verify your email address...
                    </Typography>
                  </Box>
                </Fade>
              )}

              {status === 'success' && (
                <Slide in={true} direction="up" timeout={600}>
                  <Box>
                    <Box
                      sx={{
                        width: { xs: 60, md: 80 },
                        height: { xs: 60, md: 80 },
                        margin: '0 auto 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Avatar
                        sx={{
                          width: '100%',
                          height: '100%',
                          bgcolor: 'success.main'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CheckCircle size={48} color="white" />
                        </Box>
                      </Avatar>
                    </Box>
                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        fontWeight: 'bold',
                        mb: 2,
                        color: 'text.primary'
                      }}
                    >
                      Email Verified!
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        mb: 4
                      }}
                    >
                      {message}
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{
                        py: { xs: 1.5, md: 2 },
                        px: { xs: 4, md: 6 },
                        fontSize: { xs: '1rem', md: '1.125rem' },
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: 'success.dark'
                        }
                      }}
                    >
                      Go to Login
                    </Button>
                  </Box>
                </Slide>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
