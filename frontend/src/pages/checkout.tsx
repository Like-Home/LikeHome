import { ChangeEvent, useState } from 'react';
import { Modal, Button, Stack, Typography, Card, CardActions, CardContent, CardHeader } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { createStripeCheckout } from '../api/checkout';
import { APIError } from '../api/fetch';
import { checkoutDetails } from '../recoil/checkout/atom';
import TextInput from '../components/controls/TextInput';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 600,
};

export default function CheckoutPage() {
  const { rateKey } = useParams();

  if (!rateKey) {
    return <div>Invalid rate key!</div>;
  }

  const checkoutDetailsState = useRecoilValue(checkoutDetails(rateKey));
  const [firstName, setFirstName] = useState('Noah');
  const [lastName, setLastName] = useState('Cardoza');
  const [email, setEmail] = useState('noahcardoza@gmail.com');
  const [phone, setPhone] = useState('1234567890');

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const onCheckout = async () => {
    try {
      const wasOpen = open;
      setOpen(false);

      const data = await createStripeCheckout({
        rate_key: rateKey,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        force: wasOpen ? 'true' : 'false',
      });

      setOpen(false);

      window.open(data.url, '_blank');
    } catch (e) {
      if (!(e instanceof APIError)) {
        throw e; // Unhandled error
      }

      const body = await e.response.json();

      if (body.date === 'CONFLICTING_BOOKING') {
        setOpen(true);
      }
    }
  };

  return (
    <main className="card push-center" style={{ marginTop: 50, maxWidth: 1200 }}>
      <Stack direction="column" spacing={2} m={1}>
        <Typography variant="h3">Checkout</Typography>
        <Typography variant="h4">{checkoutDetailsState.hotel.name}</Typography>
        <Typography variant="h5">{checkoutDetailsState.hotel.rooms[0].name}</Typography>
        <Typography variant="body1">{checkoutDetailsState.hotel.rooms[0].rates[0].rateComments}</Typography>
        <TextInput
          label="First name"
          value={firstName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
        ></TextInput>
        <TextInput
          label="Last name"
          value={lastName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
        ></TextInput>
        <TextInput
          label="Email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        ></TextInput>
        <TextInput
          label="Phone"
          value={phone}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
        ></TextInput>
        <Button onClick={onCheckout}>Checkout</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Card sx={style}>
            <CardHeader title="Warning" />
            <CardContent>
              <Typography variant="body1">
                You already have an existing booking that overlaps with this one. If you are sure you want to make this
                booking you can but there is a 10% nonrefundable fee for canceling overlapping bookings.
              </Typography>
            </CardContent>
            <CardActions>
              <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                <Button onClick={handleClose} color="error">
                  Cancel
                </Button>
                <Button onClick={onCheckout}>Confirm Reservation</Button>
              </Stack>
            </CardActions>
          </Card>
        </Modal>
      </Stack>
    </main>
  );
}
