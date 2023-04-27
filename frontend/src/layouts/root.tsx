import { Suspense } from 'react';

import { RouterProvider } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import router from '../router';
import AppLoadingSpinner from '../components/AppLoadingSpinner';

export default function RootAppLayout() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        [theme.breakpoints.up('sm')]: {
          padding: '2em',
        },
      }}
    >
      <Suspense fallback={<AppLoadingSpinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </Box>
  );
}
