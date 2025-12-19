import { Box, Typography } from '@mui/material'

const OnboardingContent = () => (
  <Box>
    <Typography variant="h4" sx={{ mb: 4, color: '#ffffff', fontWeight: 'bold' }}>
      Welcome to Your Dashboard
    </Typography>
    
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
      <Box sx={{ p: 3, backgroundColor: '#2a2a2a', borderRadius: 2, border: '1px solid #333' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#4CAF50' }}>
          Getting Started
        </Typography>
        <Typography variant="body2" sx={{ color: '#A3A3A3', mb: 2 }}>
          Complete your profile setup to unlock all features and personalize your experience.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4CAF50' }} />
          <Typography variant="body2" sx={{ color: '#ffffff' }}>Profile Information</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4CAF50' }} />
          <Typography variant="body2" sx={{ color: '#ffffff' }}>Preferences Set</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#666' }} />
          <Typography variant="body2" sx={{ color: '#A3A3A3' }}>Tutorial Completion</Typography>
        </Box>
      </Box>

      <Box sx={{ p: 3, backgroundColor: '#2a2a2a', borderRadius: 2, border: '1px solid #333' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#4CAF50' }}>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ p: 2, backgroundColor: '#333', borderRadius: 1, cursor: 'pointer', '&:hover': { backgroundColor: '#444' } }}>
            <Typography variant="body2" sx={{ color: '#ffffff' }}>View Tutorial</Typography>
            <Typography variant="caption" sx={{ color: '#A3A3A3' }}>Learn the basics</Typography>
          </Box>
          <Box sx={{ p: 2, backgroundColor: '#333', borderRadius: 1, cursor: 'pointer', '&:hover': { backgroundColor: '#444' } }}>
            <Typography variant="body2" sx={{ color: '#ffffff' }}>Explore Features</Typography>
            <Typography variant="caption" sx={{ color: '#A3A3A3' }}>Discover what's available</Typography>
          </Box>
          <Box sx={{ p: 2, backgroundColor: '#333', borderRadius: 1, cursor: 'pointer', '&:hover': { backgroundColor: '#444' } }}>
            <Typography variant="body2" sx={{ color: '#ffffff' }}>Get Help</Typography>
            <Typography variant="caption" sx={{ color: '#A3A3A3' }}>Support and documentation</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
)

export default OnboardingContent
