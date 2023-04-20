import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Stack, Typography, Box } from '@mui/material';
import Navbar from '../components/Navbar';
import config from '../config';
import Result from '../components/Result';

export default function ErrorLayout() {
  const error = useRouteError();

  console.error(error);

  return (
    <>
      <Navbar />
      <Box
        className="card"
        sx={{
          maxWidth: config.maxWidth,
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
