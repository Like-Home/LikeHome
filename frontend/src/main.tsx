import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { RecoilRoot } from 'recoil';
import HomePage from './pages/home';
import HotelPage from './pages/hotel';
import AuthPage from './pages/auth';
import BookingPage from './pages/booking';
import SearchPage from './pages/search';
import CheckoutPage from './pages/checkout';
import BookingsPage from './pages/bookings';
import AboutPage from './pages/about';
import RewardsPage from './pages/rewards';

import './index.scss';

import ErrorLayout from './layouts/error';
import RootLayout from './layouts/root';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// ensures a CSRF token is set in the cookies
fetch('/api/csrf');

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/auth',
        element: <AuthPage />,
      },
      {
        path: '/hotel/:hotelId',
        element: <HotelPage />,
      },
      {
        path: '/booking/:id',
        element: <BookingPage />,
      },
      {
        path: '/search/:query',
        element: <SearchPage />,
      },
      {
        path: '/checkout',
        element: <CheckoutPage />,
      },
      {
        path: '/bookings',
        element: <BookingsPage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/rewards',
        element: <RewardsPage />,
      },
    ],
  },
]);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RecoilRoot>
        <RouterProvider router={router} />
      </RecoilRoot>
    </ThemeProvider>
  </React.StrictMode>,
);
