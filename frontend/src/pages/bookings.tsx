import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Button,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  List,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
// eslint-disable-next-line camelcase
import { useRecoilValue, useRecoilRefresher_UNSTABLE } from 'recoil';
import { Booking } from '../api/types';
import { bookingsSelector } from '../recoil/bookings/atom';
import { createHotelbedsSrcSetFromPath } from '../utils';

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

  const isTooLateToCancel = booking.status === 'CA' || moment(booking.check_in).isBefore(moment().add(1, 'day'));

  return (
    <ListItem
      secondaryAction={
        <Button variant="contained" component={Link} to={linkToDetails}>
          View
        </Button>
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
          <Typography variant="h6" color="text.primary">
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
    <main className="card push">
      <h1>My Bookings</h1>
      <BookingsList />
    </main>
  );
}
