import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { Box, useTheme } from '@mui/material';
import Navbar from '../components/Navbar';
import Foorter from '../components/Footer';
import Spinner from '../components/Spinner';
import config from '../config';

const Loading = () => (
  <div className="card">
    <Spinner />
  </div>
);

export default function RootLayout() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        [theme.breakpoints.up('sm')]: {
          padding: '2em',
        },
      }}
    >
      <Navbar />
      <div
        style={{
          maxWidth: config.maxWidth,
          margin: 'auto',
        }}
      >
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
        <Foorter />
      </div>
    </Box>
  );
}
