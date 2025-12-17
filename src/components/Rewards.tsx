import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Avatar
} from '@mui/material'
import {
  Trophy,
  Star,
  TrendingUp,
  Gift,
  Crown,
  Target,
  Users,
  School
} from 'lucide-react'

const Rewards = () => {
  const userPoints = 2450
  const nextLevelPoints = 3000
  const progressPercentage = (userPoints / nextLevelPoints) * 100

  const rewards = [
    {
      id: 1,
      title: 'Early Bird Bonus',
      description: 'Completed onboarding within first week',
      points: 500,
      icon: <Star />,
      achieved: true,
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Team Player',
      description: 'Helped 5+ team members this month',
      points: 300,
      icon: <Users />,
      achieved: true,
      date: '2024-01-20'
    },
    {
      id: 3,
      title: 'Innovation Champion',
      description: 'Submitted 3+ improvement ideas',
      points: 750,
      icon: <TrendingUp />,
      achieved: false,
      date: null
    },
    {
      id: 4,
      title: 'Perfect Attendance',
      description: '30 days consecutive activity',
      points: 400,
      icon: <Target />,
      achieved: false,
      date: null
    }
  ]

  const availableRewards = [
    {
      id: 1,
      title: 'Coffee Voucher',
      description: '$10 coffee shop gift card',
      pointsCost: 1000,
      icon: <Gift />
    },
    {
      id: 2,
      title: 'Learning Course',
      description: 'Premium online course access',
      pointsCost: 2500,
      icon: <School />
    },
    {
      id: 3,
      title: 'Extra Day Off',
      description: 'One additional paid day off',
      pointsCost: 5000,
      icon: <Crown />
    }
  ]

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#ffffff', fontWeight: 'bold' }}>
        Rewards & Recognition
      </Typography>

      {/* Points Overview */}
      <Card sx={{ mb: 4, backgroundColor: '#2a2a2a', border: '1px solid #333' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: '#4CAF50', mr: 2 }}>
              <Trophy />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                {userPoints} Points
              </Typography>
              <Typography variant="body2" sx={{ color: '#A3A3A3' }}>
                Level: Gold Member
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#A3A3A3' }}>
                Progress to Platinum
              </Typography>
              <Typography variant="body2" sx={{ color: '#A3A3A3' }}>
                {userPoints}/{nextLevelPoints}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#333',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#4CAF50',
                  borderRadius: 4,
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card sx={{ mb: 4, backgroundColor: '#2a2a2a', border: '1px solid #333' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, color: '#ffffff' }}>
            Recent Achievements
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {rewards.map((reward) => (
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' } }} key={reward.id}>
                <Card 
                  sx={{ 
                    backgroundColor: reward.achieved ? '#1a3a1a' : '#333',
                    border: reward.achieved ? '1px solid #4CAF50' : '1px solid #444',
                    opacity: reward.achieved ? 1 : 0.7
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ color: reward.achieved ? '#4CAF50' : '#A3A3A3', mr: 2 }}>
                        {reward.icon}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff' }}>
                          {reward.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#A3A3A3' }}>
                          {reward.description}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={`+${reward.points} pts`}
                        size="small"
                        sx={{
                          backgroundColor: reward.achieved ? '#4CAF50' : '#666',
                          color: '#ffffff',
                          fontSize: '0.75rem'
                        }}
                      />
                      {reward.achieved && (
                        <Typography variant="caption" sx={{ color: '#4CAF50' }}>
                          {reward.date}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <Card sx={{ backgroundColor: '#2a2a2a', border: '1px solid #333' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, color: '#ffffff' }}>
            Redeem Rewards
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {availableRewards.map((reward) => (
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(33.333% - 16px)' } }} key={reward.id}>
                <Card sx={{ backgroundColor: '#333', border: '1px solid #444' }}>
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <Box sx={{ color: '#4CAF50', mb: 2, fontSize: '2rem' }}>
                      {reward.icon}
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: '#ffffff', mb: 1 }}>
                      {reward.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#A3A3A3', mb: 2 }}>
                      {reward.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={`${reward.pointsCost} points`}
                        size="small"
                        sx={{
                          backgroundColor: '#666',
                          color: '#ffffff'
                        }}
                      />
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      disabled={userPoints < reward.pointsCost}
                      sx={{
                        borderColor: userPoints >= reward.pointsCost ? '#4CAF50' : '#666',
                        color: userPoints >= reward.pointsCost ? '#4CAF50' : '#666',
                        '&:hover': userPoints >= reward.pointsCost ? {
                          borderColor: '#45a049',
                          backgroundColor: 'rgba(76, 175, 80, 0.1)'
                        } : {}
                      }}
                    >
                      {userPoints >= reward.pointsCost ? 'Redeem' : 'Insufficient Points'}
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Rewards
