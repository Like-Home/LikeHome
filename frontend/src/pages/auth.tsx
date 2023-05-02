import { Button, Stack, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import InputCSRF, { getCSRFValue } from '../api/csrf';
import Result from '../components/Result';

/**
 * sends a request to the specified url from a form. this will change the window location.
 * @param {string} path the path to send the post request to
 * @param {object} params the parameters to add to the url
 * @param {string} [method=post] the method to use on the form
 */

function post(path: string, params: Record<string, string>, method = 'post') {
  // The rest of this code assumes you are not using a library.
  // It can be made less verbose if you use one.
  const form = document.createElement('form');
  form.method = method;
  form.action = path;

  Object.keys(params).forEach((key) => {
    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = key;
    hiddenField.value = params[key];

    form.appendChild(hiddenField);
  });

  document.body.appendChild(form);
  form.submit();
}

export default function AuthPage() {
  const [searchPrams] = useSearchParams();
  const redirect = searchPrams.get('redirect');
  let action = `/accounts/google/login/?process=login`;

  if (redirect) {
    action += `&next=${redirect}`;
  }

  const onLoginOrSignup = () => {
    post(action, { csrfmiddlewaretoken: getCSRFValue() });
  };

  return (
    <Stack alignItems={'center'}>
      <Stack className="card card-root" spacing={3}>
        {searchPrams.get('flow') === 'booking' ? (
          <Result
            variant="error"
            color="primary"
            title="Sign in required"
            message="You must be signed in to make a booking"
            primaryButtonText="Sign Up With Google"
            secondaryButtonText="Login With Google"
            onPrimaryButtonClick={onLoginOrSignup}
            onSecondaryButtonClick={onLoginOrSignup}
          />
        ) : (
          <>
            <Typography variant="h4">Sign in</Typography>
            <Typography variant="body1">To access your bookings and rewards, please sign in.</Typography>
            <Stack spacing={3} direction="row" justifyContent={'space-between'}>
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
          </>
        )}
      </Stack>
    </Stack>
  );
}
