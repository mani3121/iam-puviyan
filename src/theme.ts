import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#48C84F',
      dark: '#3FA640',
      light: '#5FD55F'
    },
    secondary: {
      main: '#FFC107'
    },
    background: {
      default: '#1A1A1A',
      paper: '#2A2A2A'
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#B0B0B0'
    },
    divider: '#424242',
    error: {
      main: '#CF6679'
    },
    success: {
      main: '#4CAF50'
    }
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif'
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#48C84F #2A2A2A',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '&::-webkit-scrollbar-track': {
            background: '#2A2A2A',
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#48C84F',
            borderRadius: '4px',
            '&:hover': {
              background: '#5FD55F'
            }
          }
        }
      }
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          minHeight: 48
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minWidth: 48,
          minHeight: 48
        }
      }
    }
  }
})

export default theme
