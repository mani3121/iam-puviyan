import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import {
  CheckCircle,
  School,
  FileText,
  Users,
  TrendingUp
} from 'lucide-react'

const Onboarding = () => {
  const steps = ['Welcome', 'Profile Setup', 'Team Integration', 'First Project']
  const currentStep = 1

  const onboardingTasks = [
    {
      title: 'Complete Profile',
      description: 'Fill in your personal and professional information',
      icon: <FileText />,
      completed: true
    },
    {
      title: 'Join Team Channels',
      description: 'Connect with your team members on communication platforms',
      icon: <Users />,
      completed: true
    },
    {
      title: 'Complete Training',
      description: 'Finish the mandatory training modules',
      icon: <School />,
      completed: false
    },
    {
      title: 'Set Goals',
      description: 'Define your 30-day and 90-day objectives',
      icon: <TrendingUp />,
      completed: false
    }
  ]

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#ffffff', fontWeight: 'bold' }}>
        Onboarding Progress
      </Typography>

      {/* Progress Stepper */}
      <Card sx={{ mb: 4, backgroundColor: '#2a2a2a', border: '1px solid #333' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, color: '#ffffff' }}>
            Your Journey
          </Typography>
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel sx={{ color: '#A3A3A3' }}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card sx={{ backgroundColor: '#2a2a2a', border: '1px solid #333' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, color: '#ffffff' }}>
            Onboarding Tasks
          </Typography>
          <List>
            {onboardingTasks.map((task, index) => (
              <ListItem key={index} sx={{ mb: 2 }}>
                <ListItemIcon sx={{ color: task.completed ? '#4CAF50' : '#A3A3A3' }}>
                  {task.completed ? <CheckCircle /> : task.icon}
                </ListItemIcon>
                <ListItemText
                  primary={task.title}
                  secondary={task.description}
                  primaryTypographyProps={{
                    sx: { 
                      color: task.completed ? '#4CAF50' : '#ffffff',
                      fontWeight: task.completed ? 'bold' : 'normal'
                    }
                  }}
                  secondaryTypographyProps={{
                    sx: { color: '#A3A3A3' }
                  }}
                />
                {!task.completed && (
                  <Button 
                    variant="outlined" 
                    size="small"
                    sx={{ 
                      borderColor: '#4CAF50', 
                      color: '#4CAF50',
                      '&:hover': {
                        borderColor: '#45a049',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)'
                      }
                    }}
                  >
                    Start
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          sx={{ 
            backgroundColor: '#4CAF50',
            '&:hover': {
              backgroundColor: '#45a049'
            }
          }}
        >
          Continue Setup
        </Button>
        <Button 
          variant="outlined"
          sx={{ 
            borderColor: '#4CAF50', 
            color: '#4CAF50',
            '&:hover': {
              borderColor: '#45a049',
              backgroundColor: 'rgba(76, 175, 80, 0.1)'
            }
          }}
        >
          View Resources
        </Button>
      </Box>
    </Box>
  )
}

export default Onboarding
