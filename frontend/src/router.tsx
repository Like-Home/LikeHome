import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';

import { useRecoilValue } from 'recoil';
import HomePage from './pages/home';
import AuthPage from './pages/auth';
import HotelPage from './pages/hotel';
import BookingPage from './pages/booking';
import SearchPage from './pages/search';
import CheckoutPage from './pages/checkout';
import BookingsPage from './pages/bookings';
import AccountPage from './pages/account';
import AboutPage from './pages/about';
import RewardsPage from './pages/rewards';
import DestinationPage from './pages/destination';
import TermsOfServicePage from './pages/tos';
import PrivacyPage from './pages/privacy';
import CookiesPage from './pages/cookies';

import ErrorLayout from './layouts/error';
import DefaultRouterLayout from './layouts/default';

import userAtom from './recoil/user';

const AuthGuard = () => {
  const user = useRecoilValue(userAtom);
  // TODO: notify user that they need to login
  return user === null ? <Navigate to="/auth" /> : <Outlet />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultRouterLayout />,
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
        path: '/account',
        element: <AccountPage />,
      },
      {
        path: '/hotel/:hotelId/:hotelName',
        element: <HotelPage />,
      },
      {
        path: '/destination/:code/:name',
        element: <DestinationPage />,
      },
      {
        path: '/search',
        element: <SearchPage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/tos',
        element: <TermsOfServicePage />,
      },
      {
        path: '/cookies',
        element: <CookiesPage />,
      },
      {
        path: '/privacy',
        element: <PrivacyPage />,
      },
      {
        element: <AuthGuard />,
        children: [
          {
            path: '/booking/:bookingId',
            element: <BookingPage />,
          },
          {
            path: '/bookings',
            element: <BookingsPage />,
          },
          {
            path: '/rewards',
            element: <RewardsPage />,
          },
          {
            path: '/checkout/:rateKey',
            element: <CheckoutPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
