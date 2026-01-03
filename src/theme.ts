import { createTheme } from '@mui/material'

// Design System Color Palette
// Background: #1A1A1A - Default canvas (body, sections)
// Primary: #48C84F - Main actions eco-green (buttons, links)
// On-Primary: #FFFFFF - Text on primary (button labels)
// Secondary: #63DEF3 - Highlights light blue (icons, accents)
// On-Secondary: #000000 - Text on secondary (for contrast)
// Tertiary/Accent: #FABB15 - Alerts/CTAs yellow (badges, warnings)
// On-Tertiary: #000000 - Text on tertiary (badge text)
// Surface: #2C2C2C - Elevated elements (cards, dialogs)
// On-Surface: #FFFFFF - Default text (body copy)
// Error: #FF5252 - Errors (validation msgs)
// On-Error: #FFFFFF - Text on error (error buttons)
// Success: #48C84F - Confirmations (checkmarks)

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#48C84F',
      dark: '#3FA640',
      light: '#5FD55F',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#63DEF3',
      dark: '#4FC3DC',
      light: '#8BE8F7',
      contrastText: '#000000'
    },
    background: {
      default: '#1A1A1A',
      paper: '#2C2C2C'
    },
    text: {
      primary: '#FFFFFF', // 21:1 contrast ratio on #1A1A1A background (WCAG AAA)
      secondary: '#E0E0E0' // 13.5:1 contrast ratio on #1A1A1A background (WCAG AAA)
    },
    divider: '#424242',
    error: {
      main: '#FF5252',
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#FABB15',
      contrastText: '#000000'
    },
    success: {
      main: '#48C84F',
      contrastText: '#FFFFFF'
    },
    info: {
      main: '#63DEF3',
      contrastText: '#000000'
    }
  },
  typography: {
    // Inter font family with system fallbacks
    fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    // Display Large: 57px / 400 / 64px line-height - Hero titles
    h1: {
      fontSize: '3.5625rem',
      fontWeight: 400,
      lineHeight: '4rem'
    },
    // Headline Medium: 28px / 400 / 36px line-height - Page headers
    h2: {
      fontSize: '1.75rem',
      fontWeight: 400,
      lineHeight: '2.25rem'
    },
    // Title Large: 22px / 400 / 28px line-height - Card titles
    h3: {
      fontSize: '1.375rem',
      fontWeight: 400,
      lineHeight: '1.75rem'
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: '1.5rem'
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: '1.5rem'
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: '1.5rem'
    },
    // Body Large: 16px / 400 / 24px line-height - Paragraphs
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.5rem'
    },
    // Body Medium: 14px / 400 / 20px line-height - Secondary text
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.25rem'
    },
    // Label Medium: 12px / 500 / 16px line-height - Labels, buttons
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: '1rem',
      textTransform: 'none'
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: '1rem'
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: '1rem',
      textTransform: 'uppercase'
    }
  },
  // Border-Radius: 8px default, 16px for cards (per design system)
  shape: {
    borderRadius: 8
  },
  // Motion: 200ms ease-in-out for hovers/ripples, respects prefers-reduced-motion
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
    },
    // Add ripple effect configuration
    create: (props: string | string[], options?: { duration?: string | number; easing?: string; delay?: string | number }) => {
      const { duration = 550, easing = 'easeOut', delay = 0 } = options || {};
      const propsArray = Array.isArray(props) ? props : [props];
      return propsArray.map(prop => `${prop} ${duration}ms ${easing} ${delay}ms`).join(', ');
    }
  },
  components: {
    // === CSS BASELINE ===
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#48C84F #2C2C2C',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '&::-webkit-scrollbar-track': {
            background: '#2C2C2C',
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#48C84F',
            borderRadius: '4px',
            '&:hover': {
              background: '#5FD55F'
            }
          },
          '@media (prefers-reduced-motion: reduce)': {
            '*, *::before, *::after': {
              animationDuration: '0.01ms !important',
              animationIterationCount: '1 !important',
              transitionDuration: '0.01ms !important'
            }
          }
        }
      }
    },

    // === TEXT FIELDS ===
    // Type: Outlined (default for dark)
    // States: Focus ring 2px Primary; Error #FF5252; Disabled opacity 0.38
    // Form Validation: Error states, helper text patterns
    // Accessibility: ARIA label support
    MuiTextField: {
      defaultProps: {
        variant: 'outlined'
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 200ms ease-in-out',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fefffeff'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fefffeff',
              borderWidth: 2,
              boxShadow: '0 0 0 2px rgba(72, 200, 79, 0.2)'
            },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FF5252',
              borderWidth: 2,
              boxShadow: '0 0 0 2px rgba(255, 82, 82, 0.2)'
            },
            '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.12)',
              color: 'rgba(255, 255, 255, 0.38)'
            }
          },
          '& .MuiInputLabel-root': {
            '&.Mui-focused': {
              color: '#48C84F'
            },
            '&.Mui-error': {
              color: '#FF5252'
            },
            '&.Mui-disabled': {
              color: 'rgba(255, 255, 255, 0.38)'
            }
          },
          '& .MuiFormHelperText-root': {
            fontSize: '0.75rem',
            marginTop: 4,
            '&.Mui-error': {
              color: '#FF5252'
            },
            '&.Mui-focused': {
              color: '#48C84F'
            }
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#48C84F'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#48C84F',
            borderWidth: 2,
            boxShadow: '0 0 0 2px rgba(72, 200, 79, 0.2)'
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FF5252',
            borderWidth: 2,
            boxShadow: '0 0 0 2px rgba(255, 82, 82, 0.2)'
          },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.12)',
            color: 'rgba(255, 255, 255, 0.38)'
          }
        }
      }
    },

    // === BUTTONS ===
    // Types: Filled (Primary for CTAs), Outlined (Secondary), Text (Tertiary)
    // Sizes: Large (48px), Medium (40px)
    // States: Focus ring 2px, hover elevation, disabled opacity 0.38
    // Icons: Leading/trailing; ripple on click
    MuiButton: {
      defaultProps: {
        disableElevation: false
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 200ms ease-in-out',
          '&:focus-visible': {
            outline: '2px solid #48C84F',
            outlineOffset: 2
          },
          '&.Mui-disabled': {
            opacity: 0.38,
            color: 'rgba(255, 255, 255, 0.38)'
          }
        },
        sizeLarge: {
          minHeight: 48,
          padding: '12px 24px',
          fontSize: '1rem'
        },
        sizeMedium: {
          minHeight: 40,
          padding: '8px 16px',
          fontSize: '0.875rem'
        },
        sizeSmall: {
          minHeight: 40, // Minimum 48px touch target, but small buttons can be 40px
          padding: '8px 12px',
          fontSize: '0.75rem'
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(72, 200, 79, 0.3)'
          },
          '&:focus-visible': {
            outline: '2px solid #48C84F',
            outlineOffset: 2
          }
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(72, 200, 79, 0.08)'
          },
          '&:focus-visible': {
            outline: '2px solid #48C84F',
            outlineOffset: 2
          }
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(72, 200, 79, 0.08)'
          },
          '&:focus-visible': {
            outline: '2px solid #48C84F',
            outlineOffset: 2
          }
        }
      }
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          transition: 'all 200ms ease-in-out',
          '&:focus-visible': {
            outline: '2px solid #48C84F',
            outlineOffset: 2
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minWidth: 48,
          minHeight: 48,
          transition: 'all 200ms ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(72, 200, 79, 0.08)'
          },
          '&:focus-visible': {
            outline: '2px solid #48C84F',
            outlineOffset: 2
          },
          '&.Mui-disabled': {
            opacity: 0.38,
            color: 'rgba(255, 255, 255, 0.38)'
          }
        }
      }
    },

    // === CARDS ===
    // Types: Elevated (Surface #2C2C2C, shadow)
    // Structure: Header, Body, Actions
    // Radius: 16px
    MuiCard: {
      defaultProps: {
        elevation: 2
      },
      styleOverrides: {
        root: {
          backgroundColor: '#2C2C2C',
          borderRadius: 16,
          transition: 'all 200ms ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
          }
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: 16
        },
        title: {
          fontSize: '1.125rem',
          fontWeight: 500
        },
        subheader: {
          fontSize: '0.875rem',
          color: '#B0B0B0'
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 16,
          '&:last-child': {
            paddingBottom: 16
          }
        }
      }
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: 16,
          paddingTop: 0
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#2C2C2C',
          transition: 'all 200ms ease-in-out'
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
        },
        elevation3: {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
        }
      }
    },

    // === NAVIGATION ===
    // Rail/Drawer: Sidebar; Icons + labels, Primary active
    // Top App Bar: Header (logo left, actions right)
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2C2C2C',
          borderRight: '1px solid #424242'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2C2C2C',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 64
        }
      }
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#2C2C2C',
          borderTop: '1px solid #424242'
        }
      }
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#B0B0B0',
          '&.Mui-selected': {
            color: '#48C84F'
          }
        }
      }
    },

    // === CHIPS ===
    // Types: Filter (Outlined, yellow), Input (Filled green)
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
          transition: 'all 200ms ease-in-out'
        },
        outlined: {
          borderColor: '#FABB15',
          color: '#FABB15',
          '&:hover': {
            backgroundColor: 'rgba(250, 187, 21, 0.08)'
          }
        },
        filled: {
          backgroundColor: '#48C84F',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#3FA640'
          }
        },
        deleteIcon: {
          color: 'inherit',
          '&:hover': {
            color: 'inherit',
            opacity: 0.7
          }
        }
      }
    },

    // === LISTS & TABLES ===
    // Lists: One (main) / two (description) lines
    // Tables: Sortable headers, zebra stripes
    MuiList: {
      styleOverrides: {
        root: {
          padding: 8
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
          '&:hover': {
            backgroundColor: 'rgba(72, 200, 79, 0.08)'
          }
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: 'rgba(72, 200, 79, 0.16)',
            '&:hover': {
              backgroundColor: 'rgba(72, 200, 79, 0.24)'
            }
          },
          '&:hover': {
            backgroundColor: 'rgba(72, 200, 79, 0.08)'
          }
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#B0B0B0',
          minWidth: 40
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#2C2C2C'
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            backgroundColor: '#1A1A1A',
            color: '#FFFFFF'
          }
        }
      }
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          // Zebra stripes
          '& .MuiTableRow-root:nth-of-type(odd)': {
            backgroundColor: '#2C2C2C'
          },
          '& .MuiTableRow-root:nth-of-type(even)': {
            backgroundColor: '#252525'
          },
          '& .MuiTableRow-root:hover': {
            backgroundColor: 'rgba(72, 200, 79, 0.08)'
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #424242',
          padding: 16
        }
      }
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          '&.Mui-active': {
            color: '#48C84F'
          },
          '&:hover': {
            color: '#48C84F'
          }
        },
        icon: {
          color: '#48C84F !important'
        }
      }
    },

    // === DIALOGS & ALERTS ===
    // Types: Alert, Confirmation
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          backgroundColor: '#2C2C2C'
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem',
          fontWeight: 500,
          padding: 24
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: 24,
          paddingTop: 8
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: 24,
          paddingTop: 16,
          gap: 8
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          alignItems: 'center'
        },
        standardSuccess: {
          backgroundColor: 'rgba(72, 200, 79, 0.12)',
          color: '#48C84F'
        },
        standardError: {
          backgroundColor: 'rgba(255, 82, 82, 0.12)',
          color: '#FF5252'
        },
        standardWarning: {
          backgroundColor: 'rgba(250, 187, 21, 0.12)',
          color: '#FABB15'
        },
        standardInfo: {
          backgroundColor: 'rgba(99, 222, 243, 0.12)',
          color: '#63DEF3'
        }
      }
    },

    // === PROGRESS INDICATORS ===
    // Types: Linear, Circular
    // Color: Primary
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: 'rgba(72, 200, 79, 0.2)'
        },
        bar: {
          borderRadius: 4,
          backgroundColor: '#48C84F'
        }
      }
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#48C84F'
        }
      }
    },

    // === SWITCHES & CHECKBOXES ===
    // Track: Secondary; Thumb: Primary; on checked
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 52,
          height: 32,
          padding: 0
        },
        switchBase: {
          padding: 4,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: '#48C84F',
            '& + .MuiSwitch-track': {
              backgroundColor: '#63DEF3',
              opacity: 1
            }
          }
        },
        thumb: {
          width: 24,
          height: 24,
          backgroundColor: '#FFFFFF'
        },
        track: {
          borderRadius: 16,
          backgroundColor: '#424242',
          opacity: 1
        }
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#B0B0B0',
          '&.Mui-checked': {
            color: '#48C84F'
          },
          '&:hover': {
            backgroundColor: 'rgba(72, 200, 79, 0.08)'
          }
        }
      }
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#B0B0B0',
          '&.Mui-checked': {
            color: '#48C84F'
          },
          '&:hover': {
            backgroundColor: 'rgba(72, 200, 79, 0.08)'
          }
        }
      }
    },

    // === TOOLTIPS ===
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
          backgroundColor: '#424242',
          fontSize: '0.75rem'
        },
        arrow: {
          color: '#424242'
        }
      }
    },

    // === SNACKBAR ===
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#2C2C2C',
            borderRadius: 8
          }
        }
      }
    },

    // === TABS ===
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48
        },
        indicator: {
          backgroundColor: '#48C84F',
          height: 3,
          borderRadius: '3px 3px 0 0'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minHeight: 48,
          '&.Mui-selected': {
            color: '#48C84F'
          }
        }
      }
    },

    // === MENU ===
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2C2C2C',
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: 40,
          '&:hover': {
            backgroundColor: 'rgba(72, 200, 79, 0.08)'
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(72, 200, 79, 0.16)',
            '&:hover': {
              backgroundColor: 'rgba(72, 200, 79, 0.24)'
            }
          }
        }
      }
    },

    // === SELECT ===
    MuiSelect: {
      styleOverrides: {
        select: {
          borderRadius: 8
        }
      }
    },

    // === DIVIDER ===
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#424242'
        }
      }
    },

    // === BADGE ===
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 500
        },
        colorPrimary: {
          backgroundColor: '#48C84F'
        },
        colorSecondary: {
          backgroundColor: '#63DEF3',
          color: '#000000'
        },
        colorError: {
          backgroundColor: '#FF5252'
        }
      }
    },

    // === AVATAR ===
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#424242'
        },
        colorDefault: {
          backgroundColor: '#48C84F',
          color: '#FFFFFF'
        }
      }
    },

    // === SKELETON ===
    // Loading states with pulse animation and proper contrast
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '&::after': {
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            animation: 'skeleton-pulse 1.5s ease-in-out infinite'
          }
        }
      }
    },

    // === BACKDROP ===
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }
      }
    },

    // === PAGINATION ===
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            color: '#FFFFFF',
            '&.Mui-selected': {
              backgroundColor: '#48C84F',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#3FA640'
              }
            },
            '&:hover': {
              backgroundColor: 'rgba(72, 200, 79, 0.08)'
            }
          }
        }
      }
    }
  }
})

export default theme
