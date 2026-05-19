// ==========================================
// MUI v6 Theme — DemoDay Design System
// Light-first with dark mode via colorSchemes API
// ==========================================

import { createTheme, type ThemeOptions } from '@mui/material/styles';

const sharedTypography: ThemeOptions['typography'] = {
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  h1: { fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 },
  h2: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
  h3: { fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 },
  h4: { fontWeight: 600, lineHeight: 1.35 },
  h5: { fontWeight: 600, lineHeight: 1.4 },
  h6: { fontWeight: 600, lineHeight: 1.4 },
  subtitle1: { fontWeight: 500, letterSpacing: '0.005em' },
  subtitle2: { fontWeight: 500, fontSize: '0.875rem' },
  body1: { lineHeight: 1.6 },
  body2: { lineHeight: 1.5, fontSize: '0.875rem' },
  button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
  caption: { fontSize: '0.75rem', lineHeight: 1.5, letterSpacing: '0.02em' },
  overline: { fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' },
};

const sharedShape = { borderRadius: 12 };

const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#4F46E5',
          light: '#818CF8',
          dark: '#3730A3',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: '#0D9488',
          light: '#2DD4BF',
          dark: '#0F766E',
          contrastText: '#FFFFFF',
        },
        background: {
          default: '#F8FAFC',
          paper: '#FFFFFF',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          disabled: '#94A3B8',
        },
        divider: '#E2E8F0',
        error: { main: '#EF4444' },
        warning: { main: '#F59E0B' },
        info: { main: '#3B82F6' },
        success: { main: '#10B981' },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#818CF8',
          light: '#A5B4FC',
          dark: '#4F46E5',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: '#2DD4BF',
          light: '#5EEAD4',
          dark: '#0D9488',
          contrastText: '#0F172A',
        },
        background: {
          default: '#0B0F1A',
          paper: '#111827',
        },
        text: {
          primary: '#F1F5F9',
          secondary: '#94A3B8',
          disabled: '#475569',
        },
        divider: '#1E293B',
        error: { main: '#F87171' },
        warning: { main: '#FBBF24' },
        info: { main: '#60A5FA' },
        success: { main: '#34D399' },
      },
    },
  },
  typography: sharedTypography,
  shape: sharedShape,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        'code, kbd, pre, samp': {
          fontFamily: '"Fira Code", "JetBrains Mono", "Cascadia Code", monospace',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 20px',
          fontSize: '0.9rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
          },
          '&:active': { transform: 'translateY(0)' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)',
          },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid',
          borderColor: 'var(--mui-palette-divider)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
          transition: 'all 0.15s ease',
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'box-shadow 0.2s ease',
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.15)',
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid',
          borderColor: 'var(--mui-palette-divider)',
        },
      },
    },
    MuiSkeleton: {
      defaultProps: { animation: 'wave' },
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: '6px 12px',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.08)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
        },
      },
    },
  },
});

export default theme;
