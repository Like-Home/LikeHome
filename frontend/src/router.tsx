import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';

import { useRecoilValue } from 'recoil';
import HomePage from './pages/home';
import HotelPage from './pages/hotel';
import AuthPage from './pages/auth';
import BookingPage from './pages/booking';
import SearchPage from './pages/search';
import CheckoutPage from './pages/checkout';
import BookingsPage from './pages/bookings';
import AboutPage from './pages/about';
import RewardsPage from './pages/rewards';

import ErrorLayout from './layouts/error';
import RootLayout from './layouts/root';

import userAtom from './recoil/user';

const AuthGuard = () => {
  const user = useRecoilValue(userAtom);
  // TODO: notify user that they need to login
  return user === null ? <Navigate to="/auth" /> : <Outlet />;
};

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
        path: '/search/:query',
        element: <SearchPage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
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
            path: '/checkout',
            element: <CheckoutPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
