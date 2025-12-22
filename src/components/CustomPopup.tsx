import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Avatar,
  Fade,
  createTheme,
  ThemeProvider
} from '@mui/material'
import { styled } from '@mui/material/styles'

// Material UI Dark Theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: '#1a1a1a',
    },
    primary: {
      main: '#48C84F',
    },
    success: {
      main: '#4CAF50',
    },
    error: {
      main: '#CF6679',
    },
    info: {
      main: '#2196F3',
    },
  },
  shape: {
    borderRadius: 12,
  },
})

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
  },
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: theme.shadows[24],
  },
}))

interface CustomPopupProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  customActions?: Array<{
    label: string
    onClick: () => void
    variant?: 'text' | 'outlined' | 'contained'
    color?: 'primary' | 'secondary' | 'error'
  }>
}

export default function CustomPopup({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'success',
  duration = 5000,
  customActions
}: CustomPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setIsExiting(false)
      
      // Auto close after duration only if no custom actions
      if (!customActions || customActions.length === 0) {
        const timer = setTimeout(() => {
          handleClose()
        }, duration)
        
        return () => clearTimeout(timer)
      }
    }
  }, [isOpen, duration, customActions])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 300)
  }

  const getIcon = () => {
    const iconProps = { size: 24 }
    switch (type) {
      case 'success':
        return (
          <Avatar sx={{ bgcolor: 'success.main' }}>
            <CheckCircle {...iconProps} />
          </Avatar>
        )
      case 'error':
        return (
          <Avatar sx={{ bgcolor: 'error.main' }}>
            <AlertCircle {...iconProps} />
          </Avatar>
        )
      default:
        return (
          <Avatar sx={{ bgcolor: 'info.main' }}>
            <AlertCircle {...iconProps} />
          </Avatar>
        )
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'success.main'
      case 'error':
        return 'error.main'
      default:
        return 'info.main'
    }
  }

  if (!isVisible) return null

  return (
    <ThemeProvider theme={darkTheme}>
      <StyledDialog
        open={isVisible}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{
          timeout: 300,
        }}
        PaperProps={{
          sx: {
            border: 2,
            borderColor: getBorderColor(),
            transform: isExiting ? 'scale(0.95) translateY(16px)' : 'scale(1) translateY(0)',
            opacity: isExiting ? 0 : 1,
            transition: 'all 0.3s ease',
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {getIcon()}
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: 'white' }}>
              {title}
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
              }
            }}
          >
            <X fontSize={20} />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            {message}
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          {customActions && customActions.length > 0 ? (
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              {customActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    action.onClick()
                    if (!action.onClick.toString().includes('navigate')) {
                      handleClose()
                    }
                  }}
                  variant={action.variant || 'contained'}
                  color={action.color || 'primary'}
                  fullWidth={customActions.length === 1}
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: action.color === 'primary' ? 'primary.dark' : 
                               action.color === 'error' ? 'error.dark' : 
                               'action.hover',
                    }
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </Box>
          ) : (
            <Button
              onClick={handleClose}
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            >
              Got it
            </Button>
          )}
        </DialogActions>
      </StyledDialog>
    </ThemeProvider>
  )
}
