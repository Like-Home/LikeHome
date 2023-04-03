import { ChangeEvent, useState } from 'react';
import { Box, Modal, Button, Stack, Typography, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { createStripeCheckout } from '../api/checkout';
import { checkoutDetails } from '../recoil/checkout/atom';
import TextInput from '../components/controls/TextInput';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Warning
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            You have an existing booking! <br></br>
            <br></br> Canceling 48 hours before check in will occur in a 25% fee.
            <p>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleClose}>Continue to reservation</Button>
            </p>
          </Typography>
        </Box>
      </Modal>
    </div>
  )
}

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

  const onCheckout = async () => {
    const data = await createStripeCheckout({
      rate_key: rateKey,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
    });

    window.open(data.url, '_blank');
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
      </Stack>
    </main>
  );
}
