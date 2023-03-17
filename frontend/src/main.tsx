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
    mode: 'dark',
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
