import React from 'react';
import ReactDOM from 'react-dom/client';

import { RecoilRoot } from 'recoil';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import RootAppLayout from './layouts/root';

import './index.scss';

const darkTheme = responsiveFontSizes(
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
    },
  }),
);

// ensures a CSRF token is set in the cookies
fetch('/api/csrf');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RecoilRoot>
        <RootAppLayout />
      </RecoilRoot>
    </ThemeProvider>
  </React.StrictMode>,
);
