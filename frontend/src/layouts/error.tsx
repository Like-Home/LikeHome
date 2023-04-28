import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Stack, Typography, Box } from '@mui/material';
import Navbar from '../components/Navbar';
import Result from '../components/Result';
import Notifications from '../components/Notifications';
import Errors from '../api/errorlog';
import { APIError } from '../api/fetch';

export default function ErrorLayout() {
  const error = useRouteError();

  return (
    <>
      <Navbar />
      <Notifications />
      <Box
        className="card"
        sx={{
          width: 'fit-content',
          margin: 'auto',
          padding: 7,
        }}
      >
        <Result variant="error" title="Oops!" primaryButtonTo="/" primaryButtonText="Go Home">
          <Stack spacing={1} alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 'normal' }}>
              {isRouteErrorResponse(error) ? (
                <>
                  <b>{error.status}</b> {error.statusText}
                </>
              ) : (
                <>Unknown Error</>
              )}
            </Typography>
            <Typography variant="body1">We&apos;re Sorry, an unexpected error has occurred!</Typography>
            <Typography variant="body1">We know this doesn&apos;t feel like home...</Typography>
          </Stack>
        </Result>
      </Box>
    </>
  );
}
