import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Spinner from '../components/Spinner';
import config from '../config';
import RootLayout from './root';

const Loading = () => (
  <div className="card card-root">
    <Spinner />
  </div>
);

export default function DefaultRouterLayout() {
  return (
    <RootLayout>
      <Box
        style={{
          maxWidth: config.maxWidth,
          margin: 'auto',
        }}
      >
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </Box>
    </RootLayout>
  );
}
