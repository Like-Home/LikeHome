import React from 'react';
import { Snackbar, Alert, Stack } from '@mui/material';
import Errors from '../api/errorlog';

function Notif(e: { [key: string]: any }, index: number, open: boolean, setOpen: (o: boolean) => void) {
  console.log(e);
  return (
    <div key={index} style={{ marginTop: 12 }}>
      <Alert
        onClose={() => {
          setOpen(false);
        }}
        severity="error"
        sx={{ width: '100%', display: !e.closed ? 'flex' : 'none' }}
      >
        {e?.response?.status} {e?.response?.statusText}
      </Alert>
    </div>
  );
}

export default function Notifications() {
  const [errors, setErrors] = React.useState(Errors.list);

  React.useEffect(() => {
    Errors.subscribe((errs: any) => {
      setErrors(errs);
    });
  }, [errors]);

  return (
    <Snackbar open={true} sx={{ display: 'flex' }}>
      <Stack flexDirection="column">
        {errors.map((e, i) =>
          Notif(e, i, !!e, (o: boolean) => {
            if (!o) setErrors((Errors.list = errors.filter((err) => err !== e)));
          }),
        )}
      </Stack>
    </Snackbar>
  );
}
