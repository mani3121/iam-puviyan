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
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  Menu as MenuIcon,
  School,
  Trophy
} from 'lucide-react'
import PageLayout from '../components/PageLayout'
import ContentWrapper from '../components/ContentWrapper'
import OnboardingContent from '../components/OnboardingContent'
import RewardsContent from '../components/RewardsContent'

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
  {
    id: 'onboarding',
    label: 'Onboarding',
    icon: <School />,
    component: () => <OnboardingContent />
  },
  {
    id: 'rewards',
    label: 'Rewards',
    icon: <Trophy />,
    component: () => <RewardsContent />
  }
]


function Dashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState('onboarding')

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuClick = (menuId: string) => {
    setSelectedMenu(menuId)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const selectedComponent = menuItems.find(item => item.id === selectedMenu)?.component || (() => <OnboardingContent />)

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Dashboard
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
    </Box>
  )

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
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
                <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  Dashboard
                </Typography>
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
        </ContentWrapper>
      </PageLayout>
    </ThemeProvider>
  )
}

export default Dashboard
