import {
  AppBar,
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  LogOut,
  Menu as MenuIcon,
  Leaf,
  Trophy,
  User
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ContentWrapper from '../components/ContentWrapper'
import PageLayout from '../components/PageLayout'
import RewardsContent from '../components/RewardsContent'
import UserProfileContent from '../components/UserProfileContent.tsx'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'

const drawerWidth = 240



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
  minHeight: 48,
  justifyContent: 'center',
  px: 2.5,
}))

const menuItems = [
  // {
  //   id: 'onboarding',
  //   label: 'Onboarding',
  //   icon: <School />,
  //   component: () => <OnboardingContent />
  // },
  {
    id: 'rewards',
    label: 'Rewards',
    icon: <Trophy />,
    component: () => <RewardsContent />
  },
  {
    id: 'user-profile',
    label: 'User Profile',
    icon: <User />,
    component: () => <UserProfileContent />
  }
]


function Dashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState('rewards')
  const navigate = useNavigate()
  const location = useLocation()
  const [showWelcomeToast, setShowWelcomeToast] = useState(false)
  const [showRewardPublishedToast, setShowRewardPublishedToast] = useState(false)
  const [userName, setUserName] = useState<string>('User')

  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = localStorage.getItem('userEmail')
      if (userEmail) {
        try {
          const userQuery = query(
            collection(db, 'org_login_details'),
            where('email', '==', userEmail)
          )
          const querySnapshot = await getDocs(userQuery)
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data()
            setUserName(userData.fullName || userData.displayName || 'User')
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    const state = location.state as { showWelcomeToast?: boolean; showRewardPublishedToast?: boolean } | null
    
    let shouldClearState = false
    if (state?.showWelcomeToast) {
      setShowWelcomeToast(true)
      shouldClearState = true
    }

    if (state?.showRewardPublishedToast) {
      setShowRewardPublishedToast(true)
      shouldClearState = true
    }

    if (shouldClearState) {
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuClick = (menuId: string) => {
    setSelectedMenu(menuId)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const handleLogout = () => {
    // Clear localStorage session
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userId')
    
    // Navigate to login page
    navigate('/login')
  }

  const selectedComponent = menuItems.find(item => item.id === selectedMenu)?.component || (() => <RewardsContent />)

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Welcome {userName}
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: '#333' }} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
            <StyledListItemButton
              selected={selectedMenu === item.id}
              onClick={() => handleMenuClick(item.id)}
              sx={{
                minHeight: 48,
                justifyContent: isMobile ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isMobile ? 3 : 2,
                  justifyContent: 'center',
                  color: selectedMenu === item.id ? '#ffffff' : '#A3A3A3',
                }}
              >
                {item.icon}
              </ListItemIcon> 
              <ListItemText 
                primary={item.label}
                sx={{ opacity: 1 }}
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
      <Box sx={{ flexGrow: 1 }} />
      <List>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <StyledListItemButton
            onClick={handleLogout}
            sx={{
              minHeight: 48,
              justifyContent: isMobile ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isMobile ? 3 : 2,
                justifyContent: 'center',
                color: '#A3A3A3',
              }}
            >
              <LogOut />
            </ListItemIcon> 
            <ListItemText 
              primary="Logout"
              sx={{ opacity: 1 }}
              primaryTypographyProps={{
                sx: { 
                  color: '#A3A3A3',
                  fontWeight: 'normal'
                }
              }}
            />
          </StyledListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <PageLayout>
      <ContentWrapper maxWidth="desktop">
        <Box sx={{ display: 'flex', minHeight: '100vh', height: { xs: '100vh', lg: 'auto' }, overflow: { xs: 'hidden', lg: 'visible' } }}>
            <AppBar
              position="fixed"
              sx={{
                display: { lg: 'none' },
                backgroundColor: '#2a2a2a',
                borderBottom: '1px solid #333',
                zIndex: theme.zIndex.drawer + 1,
              }}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 'bold', flexGrow: 1 }}>
                  Dashboard
                </Typography>
                <Button
                  color="inherit"
                  startIcon={<LogOut />}
                  onClick={handleLogout}
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(76, 175, 80, 0.08)'
                    }
                  }}
                >
                  Logout
                </Button>
              </Toolbar>
            </AppBar>

            <Box
              component="nav"
              sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
            >
              <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={isMobile ? mobileOpen : true}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
                sx={{
                  display: { xs: 'block', lg: 'none' },
                  '& .MuiDrawer-paper': { 
                    boxSizing: 'border-box', 
                    width: drawerWidth,
                    backgroundColor: '#2a2a2a',
                    borderRight: '1px solid #333',
                    transition: theme.transitions.create('width', {
                      easing: theme.transitions.easing.sharp,
                      duration: theme.transitions.duration.enteringScreen,
                    }),
                  },
                }}
              >
                {drawer}
              </Drawer>
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: 'none', lg: 'block' },
                  '& .MuiDrawer-paper': { 
                    boxSizing: 'border-box', 
                    width: drawerWidth,
                    backgroundColor: '#2a2a2a',
                    borderRight: '1px solid #333',
                  },
                }}
                open
              >
                {drawer}
              </Drawer>
            </Box>

            <Box
              component="main"
              sx={{
                flexGrow: 1,
                width: { lg: `calc(100% - ${drawerWidth}px)` },
                p: 3,
                backgroundColor: '#1a1a1a',
                mt: { xs: 8, lg: 0 },
                height: { xs: 'calc(100vh - 64px)', lg: 'auto' },
                overflow: { xs: 'auto', lg: 'visible' },
                transition: theme.transitions.create(['margin', 'width'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
              }}
            >
              {selectedComponent()}
            </Box>
          </Box>

          <Snackbar
            open={showWelcomeToast}
            autoHideDuration={2500}
            onClose={() => setShowWelcomeToast(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              severity="success"
              variant="filled"
              icon={<Leaf size={18} />}
              sx={{ width: '100%' }}
              onClose={() => setShowWelcomeToast(false)}
            >
              Welcome!, start creating sustainable rewards
            </Alert>
          </Snackbar>

          <Snackbar
            open={showRewardPublishedToast}
            autoHideDuration={2500}
            onClose={() => setShowRewardPublishedToast(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              severity="success"
              variant="filled"
              icon={<Leaf size={18} />}
              sx={{ width: '100%' }}
              onClose={() => setShowRewardPublishedToast(false)}
            >
              Reward published successfully
            </Alert>
          </Snackbar>
      </ContentWrapper>
    </PageLayout>
  )
}

export default Dashboard
