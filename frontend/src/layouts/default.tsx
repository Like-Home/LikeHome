import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import Foorter from '../components/Footer';
import Spinner from '../components/Spinner';
import config from '../config';

const Loading = () => (
  <div className="card card-root">
    <Spinner />
  </div>
);

export default function DefaultRouterLayout() {
  return (
    <>
      <Navbar />
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
