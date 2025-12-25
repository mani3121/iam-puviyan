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
  useTheme
} from '@mui/material'
import { styled } from '@mui/material/styles'

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
  useTheme()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      
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

  if (!isVisible) return null

  return (
    <StyledDialog
      open={isVisible}
      onClose={handleClose}
      TransitionComponent={Fade}
      keepMounted
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: 'background.paper',
        }
      }}
    >
      <DialogTitle sx={{
        pb: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {getIcon()}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <IconButton
          aria-label="Close"
          onClick={handleClose}
          size="small"
          sx={{
            color: 'text.secondary',
            mt: 0.5,
          }}
        >
          <X fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        {customActions && customActions.length > 0 ? (
          <Box sx={{ width: '100%', display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            {customActions.map((action, idx) => (
              <Button
                key={idx}
                onClick={() => {
                  action.onClick()
                  handleClose()
                }}
                variant={action.variant || 'contained'}
                color={action.color || 'primary'}
                sx={{
                  borderRadius: 2,
                  minWidth: 100
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
  )
}
