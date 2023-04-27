import { Button, Stack, Typography } from '@mui/material';
import InputCSRF from '../api/csrf';

export default function AuthPage() {
  // TODO: Redirect to previous path
  return (
    <Stack className="card card-root push-center" spacing={3}>
      <Typography variant="h4">Sign in</Typography>
      <Typography variant="body1">To access your bookings and rewards, please sign in.</Typography>
      <Stack spacing={3} direction="row">
        <form action="/accounts/google/login/?process=login" method="post">
          <InputCSRF />
          <Button variant="contained" type="submit">
            Login With Google
          </Button>
        </form>
        <form action="/accounts/google/login/?process=login" method="post">
          <InputCSRF />
          <Button variant="contained" type="submit">
            Sign Up With Google
          </Button>
        </form>
      </Stack>
    </Stack>
  );
}
