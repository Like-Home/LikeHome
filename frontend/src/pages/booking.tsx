import { useState } from 'react';
import { useParams } from 'react-router-dom';
// eslint-disable-next-line camelcase
import { useRecoilValue, useRecoilRefresher_UNSTABLE } from 'recoil';
import {
  Button,
  Stack,
  Typography,
  Card,
  Divider,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  OutlinedInput,
  ListItem,
  ListItemText,
  List,
} from '@mui/material';
import moment from 'moment';
import { bookingById } from '../recoil/bookings/atom';
import { createHotelbedsSrcSetFromPath, formatAddressFromHotel, formatCurrency } from '../utils';
import { nightsFromDates } from '../api/hotel';
import { Booking } from '../api/types';
import { cancelBooking, editBooking } from '../api/bookings';
import CardModal from '../components/CardModal';

const statusToText = {
  PE: 'Pending',
  CO: 'Confirmed',
  CA: 'Cancelled',
  PA: 'Past',
};

const phoneTypeToText = {
  PHONEBOOKING: 'Booking',
  PHONEHOTEL: 'Hotel Lobby',
  FAXNUMBER: 'Fax',
};

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
    <CardModal open={open} onClose={handleClose}>
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
    </CardModal>
  );
}

export default function BookingPage() {
  const { bookingId } = useParams();

  if (!bookingId) {
    return <div>Booking not found!</div>;
  }
  const bookingSelector = bookingById(bookingId);
  const refreshBookingAtom = useRecoilRefresher_UNSTABLE(bookingSelector);
  const booking = useRecoilValue(bookingSelector);

  const [editBookingOpen, setEditBookingOpen] = useState(false);
  const handleEditBookingOpen = () => setEditBookingOpen(true);
  const handleEditBookingClose = () => {
    refreshBookingAtom();
    setEditBookingOpen(false);
  };

  const [cancelBookingOpen, setCancelBookingOpen] = useState(false);
  const handleCancelBookingOpen = () => setCancelBookingOpen(true);
  const handleCancelBookingClose = () => {
    setCancelBookingOpen(false);
  };

  const onCancel = async () => {
    await cancelBooking(booking.id);
    refreshBookingAtom();
    handleCancelBookingClose();
  };

  const onRebooking = () => {
    console.log('lol');
  };

  const hasBeenCanceled = booking.status === 'CA';
  const isWithin24Hours = moment(booking.check_in).isBefore(moment().add(1, 'day'));

  // eslint-disable-next-line no-nested-ternary
  const cancelationMessage = isWithin24Hours
    ? 'Because this booking is in less than 24 hours, you are not eligible for a refund. Are you sure you want to cancel?'
    : booking.overlapping
    ? 'Because this booking was booked while overlapping with another booking, there is a 10% non-refundable fee. Are you sure you want to cancel?'
    : 'Are you sure you want to cancel this booking?';

  const nights = nightsFromDates(new Date(booking.check_in), new Date(booking.check_out));

  return (
    <>
      <Stack spacing={2}>
        <Typography variant="h4">{booking.hotel.name}</Typography>
        <Stack
          className="push-center"
          direction={{
            xs: 'column',
            md: 'row',
          }}
          spacing={2}
        >
          <Stack direction="column" spacing={2} flex={2}>
            <Stack className="card" spacing={1}>
              <Typography variant="h4">Hotel Information</Typography>
              <Typography variant="body1">{booking.hotel.description}</Typography>
              <Typography variant="h5">Phones</Typography>
              <List dense>
                {booking.hotel.phones.map((phone) => (
                  <ListItem key={phone.id}>
                    <ListItemText
                      primary={phoneTypeToText[phone.phoneType] || 'Other'}
                      secondary={<a href={`tel:${phone.phoneNumber}`}>{phone.phoneNumber}</a>}
                    />
                  </ListItem>
                ))}
              </List>
            </Stack>
            <Stack className="card" spacing={1}>
              <Typography variant="h4">Your details</Typography>
              <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: 'bold' }}>First Name:</Typography>
                <Typography>{booking.first_name}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: 'bold' }}>Last Name:</Typography>
                <Typography>{booking.last_name}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: 'bold' }}>Email:</Typography>
                <Typography>{booking.email}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: 'bold' }}>Phone:</Typography>
                <Typography>{booking.phone}</Typography>
              </Stack>
              {!hasBeenCanceled && <Button onClick={handleEditBookingOpen}>Update Information</Button>}
            </Stack>
          </Stack>
          <Stack className="card" direction="column" spacing={2} flex={1}>
            <img
              alt=""
              {...createHotelbedsSrcSetFromPath(booking.image)}
              style={{
                borderRadius: 4,
                height: 200,
                objectFit: 'cover',
                width: '100%',
              }}
            />
            <Typography variant="h6" sx={{ marginBottom: 0, fontWeight: 'bold' }}>
              {booking.hotel.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ marginTop: 0 }}>
              {formatAddressFromHotel(booking.hotel)}
            </Typography>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                    <Typography variant="body1">Check-in</Typography>
                    <Stack spacing={1} direction="row">
                      <Typography variant="body1" component="span">
                        {moment(booking.check_in).format('MMMM Do, YYYY')}
                      </Typography>
                      <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                        (3 PM)
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                    <Typography variant="body1">Check-out</Typography>
                    <Stack spacing={1} direction="row">
                      <Typography variant="body1" component="span">
                        {moment(booking.check_out).format('MMMM Do, YYYY')}
                      </Typography>
                      <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                        (11 AM)
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                    <Typography variant="body1">Nights</Typography>
                    <Typography variant="body1">{nights}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                    <Typography variant="body1">Status</Typography>
                    <Typography variant="body1">{statusToText[booking.status]}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                    <Typography variant="body1">Total</Typography>
                    <Typography variant="body1">{formatCurrency(booking.amount_paid)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                    <Typography variant="body1">Points Earned</Typography>
                    <Typography variant="body1">{booking.points_earned}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                    <Typography variant="body1">Points Spent</Typography>
                    <Typography variant="body1">{booking.points_spent}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
            {!hasBeenCanceled && (
              <>
                <Divider />
                <Button onClick={onRebooking}>Re-book</Button>
                <Button color="error" onClick={handleCancelBookingOpen}>
                  Cancel
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
      <EditBookingModal booking={booking} open={editBookingOpen} handleClose={handleEditBookingClose} />
      <CardModal open={cancelBookingOpen} onClose={handleCancelBookingClose}>
        <CardHeader title="Cancelation"></CardHeader>
        <CardContent>
          <Typography variant="body1">{cancelationMessage}</Typography>
          <Stack direction="row-reverse" spacing={2}>
            <Button onClick={onCancel} color="error">
              Yes
            </Button>
            <Button onClick={handleCancelBookingClose}>No</Button>
          </Stack>
        </CardContent>
      </CardModal>
    </>
  );
}
