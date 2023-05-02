import { Button, Stack, Typography } from '@mui/material';
import InputCSRF from '../api/csrf';

export default function AuthPage() {
  const redirect = new URLSearchParams(window.location.search).get('redirect');
  let action = `/accounts/google/login/?process=login`;

  if (redirect) {
    action += `&next=${redirect}`;
  }

  return (
    <Stack className="card card-root push-center" spacing={3}>
      <Typography variant="h4">Sign in</Typography>
      <Typography variant="body1">To access your bookings and rewards, please sign in.</Typography>
      <Stack spacing={3} direction="row">
        <form action={action} method="post">
          <InputCSRF />
          <Button variant="contained" type="submit">
            Login With Google
          </Button>
        </form>
        <form action={action} method="post">
          <InputCSRF />
          <Button variant="contained" type="submit">
            Sign Up With Google
          </Button>
        </form>
      </Stack>
    </Stack>
  );
}
