import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Button,
  Divider,
  FormControl,
  CardHeader,
  CardContent,
  InputLabel,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Card,
  OutlinedInput,
  List,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
// eslint-disable-next-line camelcase
import { useRecoilValue, useRecoilRefresher_UNSTABLE } from 'recoil';
import { Booking } from '../api/types';
import { cancelBooking, editBooking } from '../api/bookings';
import { bookingsSelector } from '../recoil/bookings/atom';
import { createHotelbedsSrcSetFromPath } from '../utils';

function EditBookingModal({
  booking,
  open,
  handleClose,
}: {
  booking: Booking;
  open: boolean;
  handleClose: () => void;
}) {
  const [firstName, setFirstName] = useState(booking.first_name);
  const [lastName, setLastName] = useState(booking.last_name);
  const [phone, setPhone] = useState(booking.phone);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleSubmit = async () => {
    await editBooking(booking.id, {
      first_name: firstName,
      last_name: lastName,
      email: booking.email,
      phone,
    });

    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Card
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 600,
        }}
      >
        <CardHeader title="Edit Booking" />
        <CardContent>
          <Stack spacing={3}>
            <Typography id="modal-modal-description">Edit your check in information below.</Typography>
            <Stack direction="row" spacing={2}>
              <FormControl variant="outlined">
                <InputLabel htmlFor="firstName">First Name</InputLabel>
                <OutlinedInput label="firstName" value={firstName} onChange={handleFirstNameChange} />
              </FormControl>
              <FormControl variant="outlined">
                <InputLabel htmlFor="lastName">Last Name</InputLabel>
                <OutlinedInput label="lastName" value={lastName} onChange={handleLastNameChange} />
              </FormControl>
            </Stack>
            <FormControl variant="outlined">
              <InputLabel htmlFor="phoneNumber">Phone Number</InputLabel>
              <OutlinedInput label="phoneNumber" value={phone} onChange={handlePhoneChange} />
            </FormControl>
            <Stack direction="row-reverse">
              <Button onClick={handleSubmit}>Submit</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Modal>
  );
}

const statusToText = {
  PE: 'Pending',
  CO: 'Confirmed',
  CA: 'Cancelled',
  PA: 'Past',
};

function BookingItem({ booking }: { booking: Booking }) {
  const linkToDetails = `/booking/${booking.id}`;
  const refreshBookings = useRecoilRefresher_UNSTABLE(bookingsSelector);
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const isTooLateToCancel = booking.status === 'CA' || moment(booking.check_in).isBefore(moment().add(1, 'day'));

  const onCancel = async () => {
    await cancelBooking(booking.id);
    refreshBookings();
  };

  return (
    <ListItem
      secondaryAction={
        <>
          <Button
            variant="contained"
            component={Link}
            to={linkToDetails}
            sx={{
              marginBlockEnd: theme.spacing(1),
              display: 'block',
              textAlign: 'center',
            }}
          >
            View
          </Button>
          <Button onClick={handleOpen} variant="contained" color="error" disabled={isTooLateToCancel}>
            Edit
          </Button>
          <EditBookingModal booking={booking} open={open} handleClose={handleClose} />
          <Button variant="contained" color="error" disabled={isTooLateToCancel} onClick={onCancel}>
            Cancel
          </Button>
        </>
      }
    >
      <ListItemAvatar>
        <Avatar
          alt="Hotel Room Image"
          {...createHotelbedsSrcSetFromPath(booking.image)}
          variant="rounded"
          sx={{
            width: theme.spacing(20),
            height: theme.spacing(20),
            marginInlineEnd: theme.spacing(2),
          }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="h4" color="text.primary">
            {booking.hotel.name}
          </Typography>
        }
        secondary={
          <div>
            <div>
              <Typography variant="body2" color="text.primary">
                Status: {statusToText[booking.status]}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="text.primary">
                Check-in: {moment(booking.check_in).format('ll')}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="text.primary">
                Check-out: {moment(booking.check_out).format('ll')}
              </Typography>
            </div>
          </div>
        }
      />
    </ListItem>
  );
}

function BookingsList() {
  const bookings = useRecoilValue(bookingsSelector);

  return bookings.length > 0 ? (
    <List sx={{ width: '100%' }}>
      {bookings.map((booking, index) => (
        <>
          <BookingItem key={booking.id} booking={booking} />
          {index + 1 !== bookings.length && <Divider variant="inset" component="li" />}
        </>
      ))}
    </List>
  ) : (
    <div
      style={{
        textAlign: 'center',
      }}
    >
      <h3>Nothing to see here. </h3>
      <p>Go spend some money and check back.</p>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <main className="card push-center" style={{ marginTop: 50, maxWidth: 900 }}>
      <h1>My Bookings</h1>
      <BookingsList />
    </main>
  );
}
