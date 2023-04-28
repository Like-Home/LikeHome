import React, { Suspense } from 'react';

import { RouterProvider } from 'react-router-dom';
import { Box, useTheme, Alert } from '@mui/material';
import { SnackbarProvider, CustomContentProps } from 'notistack';
import router from '../router';
import AppLoadingSpinner from '../components/AppLoadingSpinner';

const AlertFactory = React.forwardRef<HTMLDivElement, CustomContentProps>(
  ({ variant, message }: CustomContentProps, ref) => {
    const theme = useTheme();

    return (
      <Alert
        ref={ref}
        severity={variant === 'default' ? undefined : variant}
        sx={{
          [theme.breakpoints.up('xs')]: {
            width: '100%',
          },
          [theme.breakpoints.up('sm')]: {
            maxWidth: '400px',
          },
        }}
      >
        {message}
      </Alert>
    );
  },
);
AlertFactory.displayName = 'AlertFactory';

export default function Layout() {
  const theme = useTheme();

  return (
    <SnackbarProvider
      maxSnack={3}
      Components={{
        default: AlertFactory,
        error: AlertFactory,
        success: AlertFactory,
        warning: AlertFactory,
        info: AlertFactory,
      }}
    >
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
    </SnackbarProvider>
  );
}
