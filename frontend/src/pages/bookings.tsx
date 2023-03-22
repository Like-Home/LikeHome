import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { Booking } from '../api/types';
import bookingsAtom from '../recoil/bookings/index';

const exampleBookingImage =
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80';
const exampleHotelName = 'Luxor';

function BookingItem({ booking }: { booking: Booking }) {
  const linkToDetails = `/booking/${booking.id}`;
  const theme = useTheme();

  const isTooLateToCancel = moment(booking.start_date).isBefore(moment().add(1, 'day'));

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
          <Button variant="contained" color="error" component={Link} to={linkToDetails} disabled={isTooLateToCancel}>
            Cancel
          </Button>
        </>
      }
    >
      <ListItemAvatar>
        <Avatar
          alt="Hotel Room Image"
          src={exampleBookingImage}
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
            {exampleHotelName}
          </Typography>
        }
        secondary={
          <div>
            <div>
              <Typography variant="body2" color="text.primary">
                Check-in: {moment(booking.start_date).format('ll')}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="text.primary">
                Check-out: {moment(booking.end_date).format('ll')}
              </Typography>
            </div>
          </div>
        }
      />
    </ListItem>
  );
}

function BookingsList() {
  const bookings = useRecoilValue(bookingsAtom);

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
