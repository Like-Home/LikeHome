import { Link } from 'react-router-dom';
// eslint-disable-next-line camelcase
import { useRecoilValue, useRecoilRefresher_UNSTABLE } from 'recoil';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled, useTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import { List, ListItem, Divider, ListItemText, Button, ListItemAvatar, Avatar, Typography } from '@mui/material';
import moment from 'moment';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import React from 'react';
import { bgcolor } from '@mui/system';
import { Booking } from '../api/types';
import { cancelBooking } from '../api/bookings';
import { bookingsSelector } from '../recoil/bookings/atom';
import { createHotelbedsSrcSetFromPath } from '../utils';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 350,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function BookingItem({ booking }: { booking: Booking }) {
  const linkToDetails = `/booking/${booking.id}`;
  const refreshBookings = useRecoilRefresher_UNSTABLE(bookingsSelector);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const isTooLateToCancel = booking.status === 'CA' || moment(booking.check_in).isBefore(moment().add(1, 'day'));

  // eslint-disable-next-line no-empty-pattern
  const Item = styled(Paper)(({}) => ({
    textAlign: 'center',
  }));

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
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Edit Booking
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Add Guest to account booking.
              </Typography>
              <Stack spacing={0}>
                <Item>
                  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                      <InputLabel htmlFor="guestCheckin">First Name</InputLabel>
                      <OutlinedInput label="firstName" />
                    </FormControl>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                      <InputLabel htmlFor="GuestCheckin">Last Name</InputLabel>
                      <OutlinedInput label="lastName" />
                    </FormControl>
                  </Box>
                </Item>
                <Item>
                  <FormControl sx={{ m: 1, width: '47ch' }} variant="outlined">
                    <InputLabel htmlFor="guestCheckin">Phone Number</InputLabel>
                    <OutlinedInput label="phoneNumber" />
                  </FormControl>
                </Item>
                <Item>
                  <Button>Submit</Button>
                </Item>
              </Stack>
            </Box>
          </Modal>
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
                Status: {booking.status}
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
