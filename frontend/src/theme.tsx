import { alpha, darken } from '@mui/material';
import { createTheme, responsiveFontSizes, Theme } from '@mui/material/styles';

const alertThemer =
  (severity: 'success' | 'info' | 'warning' | 'error') =>
  ({ theme }: { theme: Theme }) => ({
    backgroundColor: alpha(darken(theme.palette[severity].light, 0.8), 0.8),
    backdropFilter: 'blur(10px)',
  });

export default responsiveFontSizes(
  createTheme({
    palette: {
      primary: { main: '#615EFF' },
      mode: 'dark',
    },
    components: {
      MuiButton: {
        defaultProps: {
          variant: 'contained',
        },
        styleOverrides: {
          root: {
            borderRadius: '6px',
            textTransform: 'none',
            lineHeight: '1.5',
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          standardError: alertThemer('error'),
          standardInfo: alertThemer('info'),
          standardSuccess: alertThemer('success'),
          standardWarning: alertThemer('warning'),
        },
      },
      MuiMenu: {
        defaultProps: {
          disableScrollLock: true,
        },
        styleOverrides: {
          paper: {
            borderRadius: '8px',
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          dense: {
            paddingTop: 2,
            paddingBottom: 2,
            paddingLeft: 4,
            paddingRight: 4,
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: 0,
            marginRight: 16,
          },
        },
      },
    },
  }),
);
