import React from 'react';
import ReactDOM from 'react-dom/client';

import { RecoilRoot } from 'recoil';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import Layout from './layouts';
import theme from './theme';

import './index.scss';

// ensures a CSRF token is set in the cookies
fetch('/api/csrf');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RecoilRoot>
        <Layout />
      </RecoilRoot>
    </ThemeProvider>
  </React.StrictMode>,
);
