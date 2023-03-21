import React from 'react';
import ReactDOM from 'react-dom/client';

import { RouterProvider } from 'react-router-dom';

import { RecoilRoot } from 'recoil';
import { CssBaseline } from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import router from './router';
import AppLoadingSpinner from './components/AppLoadingSpinner';
import './index.scss';

const darkTheme = createTheme({
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
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '8px',
        },
      },
    },
  },
});

// ensures a CSRF token is set in the cookies
fetch('/api/csrf');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RecoilRoot>
        <React.Suspense fallback={<AppLoadingSpinner />}>
          <RouterProvider router={router} />
        </React.Suspense>
      </RecoilRoot>
    </ThemeProvider>
  </React.StrictMode>,
);
