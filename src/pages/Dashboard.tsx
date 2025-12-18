import { useState } from 'react'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Divider
} from '@mui/material'
import { styled } from '@mui/material/styles'
import PageLayout from '../components/PageLayout'
import ContentWrapper from '../components/ContentWrapper'
import Onboarding from '../components/Onboarding'
import Rewards from '../components/Rewards'
import {
  Trophy,
  School
} from 'lucide-react'

// Material UI Dark Theme with Green Accents
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1a1a1a',
      paper: '#2a2a2a',
    },
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#81C784',
    },
    text: {
      primary: '#ffffff',
      secondary: '#A3A3A3',
    },
  },
})

const drawerWidth = 280

const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: '#2a2a2a',
    borderRight: '1px solid #333',
  },
}))

const StyledListItemButton = styled(ListItemButton)(() => ({
  '&.Mui-selected': {
    backgroundColor: '#4CAF50',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#45a049',
    },
    '& .MuiListItemIcon-root': {
      color: '#ffffff',
    },
  },
  '&:hover': {
    backgroundColor: '#333',
  },
}))

const menuItems = [
  {
    id: 'onboarding',
    label: 'Onboarding',
    icon: <School />,
    component: <Onboarding />
  },
  {
    id: 'rewards',
    label: 'Rewards',
    icon: <Trophy />,
    component: <Rewards />
  }
]

function Dashboard() {
  const [selectedMenu, setSelectedMenu] = useState('onboarding')

  const handleMenuClick = (menuId: string) => {
    setSelectedMenu(menuId)
  }

  const selectedComponent = menuItems.find(item => item.id === selectedMenu)?.component || <Onboarding />

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <PageLayout>
        <ContentWrapper maxWidth="desktop">
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, display: 'flex', height: 'calc(100vh - 200px)' }}>
            {/* Left Sidebar */}
            <StyledDrawer
              variant="permanent"
              anchor="left"
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  Dashboard
                </Typography>
              </Box>
              <Divider sx={{ borderColor: '#333' }} />
              <List sx={{ px: 2, py: 2 }}>
                {menuItems.map((item) => (
                  <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                    <StyledListItemButton
                      selected={selectedMenu === item.id}
                      onClick={() => handleMenuClick(item.id)}
                      sx={{ borderRadius: 2 }}
                    >
                      <ListItemIcon sx={{ color: selectedMenu === item.id ? '#ffffff' : '#A3A3A3' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.label}
                        primaryTypographyProps={{
                          sx: { 
                            color: selectedMenu === item.id ? '#ffffff' : '#A3A3A3',
                            fontWeight: selectedMenu === item.id ? 'bold' : 'normal'
                          }
                        }}
                      />
                    </StyledListItemButton>
                  </ListItem>
                ))}
              </List>
            </StyledDrawer>

            {/* Right Content Area */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                backgroundColor: '#1a1a1a',
                borderRadius: 2,
                ml: 2,
                overflow: 'auto'
              }}
            >
              {selectedComponent}
            </Box>
          </Box>
        </Box>
        </ContentWrapper>
      </PageLayout>
    </ThemeProvider>
  )
}

export default Dashboard
