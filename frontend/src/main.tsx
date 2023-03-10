import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { RecoilRoot } from 'recoil';
import HomePage from './pages/home';
import HotelPage from './pages/hotel';
import AuthPage from './pages/auth';
import Booking from './pages/booking';
import Search from './pages/search';
import Checkout from './pages/checkout';
import Bookings from './pages/bookings';
import About from './pages/about';
import Rewards from './pages/rewards';

import './index.scss';

import ErrorLayout from './layouts/error';
import RootLayout from './layouts/root';

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
        element: <Booking />,
      },
      {
        path: '/search/:query',
        element: <Search />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
      {
        path: '/bookings',
        element: <Bookings />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/rewards',
        element: <Rewards />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>,
);
