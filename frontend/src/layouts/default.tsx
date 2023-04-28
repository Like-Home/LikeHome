import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { Box, Alert, Snackbar } from '@mui/material';
import Navbar from '../components/Navbar';
import Foorter from '../components/Footer';
import Spinner from '../components/Spinner';
import config from '../config';
import Notifications from '../components/Notifications';

const Loading = () => (
  <div className="card card-root">
    <Spinner />
  </div>
);

export default function DefaultRouterLayout() {
  return (
    <>
      <Navbar />
      <Notifications />
      <Box
        style={{
          maxWidth: config.maxWidth,
          margin: 'auto',
        }}
      >
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
        <Foorter />
      </Box>
    </>
  );
}
