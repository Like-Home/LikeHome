import { ChangeEvent, useEffect, useState } from 'react';
import { Avatar, Stack, Typography, Button, Checkbox } from '@mui/material';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import TextInput from '../components/controls/TextInput';
import { AccountOverview } from '../components/Navbar';
import userAtom from '../recoil/user';
import { putUser } from '../api';

export default function AboutPage() {
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.first_name as string);
  const [lastName, setLastName] = useState(user?.last_name as string);
  const [email, setEmail] = useState(user?.email as string);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number as string);
  const [autoFillBookingInfo, setAutoFillBookingInfo] = useState(user?.autofill_booking_info as boolean);
  const [changesToSave, setChangesToSave] = useState(false);

  // console.log(autoFillBookingInfo, user?.autofill_booking_info);

  useEffect(() => {
    setChangesToSave(false);
    if (firstName !== user?.first_name) {
      setChangesToSave(true);
    }
    if (lastName !== user?.last_name) {
      setChangesToSave(true);
    }
    if (email !== user?.email) {
      setChangesToSave(true);
    }
    if (phoneNumber !== user?.phone_number) {
      setChangesToSave(true);
    }
    if (autoFillBookingInfo !== user?.autofill_booking_info) {
      setChangesToSave(true);
    }
  }, [user, firstName, lastName, email, phoneNumber, autoFillBookingInfo]);

  if (user === null) {
    navigate('/auth');
    return <div>Redirecting...</div>;
  }

  const resetProfile = () => {
    setFirstName(user?.first_name as string);
    setLastName(user?.last_name as string);
    setEmail(user?.email as string);
    setPhoneNumber(user?.phone_number as string);
    setAutoFillBookingInfo(user?.autofill_booking_info as boolean);
  };

  const saveProfile = async () => {
    // user would have been redirected if they were not logged in
    const update = {
      first_name: firstName as string,
      last_name: lastName as string,
      email: email as string,
      phone_number: phoneNumber as string,
      autofill_booking_info: autoFillBookingInfo as boolean,
    };

    await putUser(update);

    setUser({
      ...user,
      ...update,
    });
  };

  return (
    <Stack spacing={3}>
      <Stack className="card card-root" spacing={3}>
        <Typography variant="h4">Account</Typography>
        <Stack
          direction={{
            sm: 'column',
            md: 'row',
          }}
          spacing={{
            xs: 2,
            md: 4,
          }}
        >
          <Stack alignItems="center">
            <Avatar src={user.image} sx={{ width: 100, height: 100 }}></Avatar>
            <AccountOverview user={user} simple />
          </Stack>
          <Stack spacing={2} flexGrow={1} minWidth={250}>
            <Typography variant="h5">Profile</Typography>
            <TextInput
              label="First Name"
              value={firstName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFirstName(event.target.value);
              }}
            />
            <TextInput
              label="Last Name"
              value={lastName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setLastName(event.target.value);
              }}
            />
            <TextInput
              label="Email"
              value={email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(event.target.value);
              }}
            />
            <TextInput
              label="Phone Number"
              value={phoneNumber}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPhoneNumber(event.target.value);
              }}
            />
          </Stack>
          <Stack spacing={2}>
            <Typography variant="h5">Options</Typography>
            <Stack spacing={2} direction="row" alignItems="center">
              <Checkbox
                checked={autoFillBookingInfo}
                onChange={() => {
                  console.log(autoFillBookingInfo);
                  setAutoFillBookingInfo((value) => !value);
                }}
              />
              <Typography variant="body1">
                Use your information to prefill future booking check-in information?
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack justifyContent={'end'} direction="row" spacing={2}>
          {changesToSave && (
            <Button disabled={!changesToSave} onClick={resetProfile} variant="text" color="secondary">
              Reset
            </Button>
          )}
          <Button disabled={!changesToSave} onClick={saveProfile}>
            Save
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
