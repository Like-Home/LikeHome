import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';

import { useRecoilValue } from 'recoil';
import HomePage from './pages/home';
import HotelPage from './pages/hotel';
import BookingPage from './pages/booking';
import SearchPage from './pages/search';
import CheckoutPage from './pages/checkout';
import BookingsPage from './pages/bookings';
import AboutPage from './pages/about';
import RewardsPage from './pages/rewards';

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
        path: '/hotel/:hotelId/:hotelName',
        element: <HotelPage />,
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
