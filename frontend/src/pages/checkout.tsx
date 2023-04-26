import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Divider,
  Alert,
  Box,
  Button,
  Stack,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Popover,
  Checkbox,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import moment from 'moment';
import { createStripeCheckout, PriceBook } from '../api/checkout';
import { APIError } from '../api/fetch';
import { checkoutDetails } from '../recoil/checkout/atom';
import TextInput from '../components/controls/TextInput';
import { formatAddressFromHotel, createHotelbedsSrcSetFromPath, formatCurrency } from '../utils';
import { nightsFromDates } from '../api/hotel';
import CardModal from '../components/CardModal';
import { bookingById } from '../recoil/bookings/atom';
import userAtom from '../recoil/user';

export default function CheckoutPage() {
  const { rateKey } = useParams();
  const [searchParams] = useSearchParams();
  const user = useRecoilValue(userAtom);

  const stripeCheckoutWasCanceled = searchParams.get('stripe') === 'canceled';

  const checkoutDetailsState = useRecoilValue(checkoutDetails(rateKey || ''));
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const rebookingId = searchParams.get('rebooking');
  const rebookingSelector = bookingById(rebookingId !== null ? rebookingId : null);
  const rebooking = useRecoilValue(rebookingSelector);

  useEffect(() => {
    if (rebooking !== null) {
      setFirstName(rebooking.first_name);
      setLastName(rebooking.last_name);
      setEmail(rebooking.email);
      setPhone(rebooking.phone);
    } else if (user?.autofill_booking_info) {
      setFirstName(user?.first_name || '');
      setLastName(user?.last_name || '');
      setEmail(user?.email || '');
      setPhone(user?.phone_number || '');
    }
  }, [rebooking]);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setCheckoutLoading(false);
  };
  const nights = nightsFromDates(
    new Date(checkoutDetailsState.hotel.checkIn),
    new Date(checkoutDetailsState.hotel.checkOut),
  );

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [priceBook, setPriceBook] = useState<PriceBook>(checkoutDetailsState.price);

  useEffect(() => {
    if (applyDiscount) {
      setPriceBook(checkoutDetailsState.rewards.discounted);
    } else {
      setPriceBook(checkoutDetailsState.price);
    }
  }, [applyDiscount]);

  // TODO: how to implement this?
  if (!rateKey) {
    return <div>Invalid rate key!</div>;
  }

  const onCheckout = async () => {
    try {
      const wasOpen = open;
      setOpen(false);
      setCheckoutLoading(true);

      if (!termsAccepted) {
        return;
      }

      const data = await createStripeCheckout({
        rate_key: rateKey,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        force: wasOpen ? 'true' : 'false',
        apply_point_balance: applyDiscount ? 'true' : 'false',
        rebooking_id: rebookingId || undefined,
      });

      setOpen(false);

      window.location.href = data.url;
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

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const popoverOpen = Boolean(anchorEl);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (!termsAccepted) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack spacing={2}>
      {stripeCheckoutWasCanceled && (
        <Alert severity="warning">
          Having second thoughts? Take time time. We know it&apos;s hard to find a home LikeHome.
        </Alert>
      )}
      <Typography variant="h4">{checkoutDetailsState.hotel.rooms[0].name}</Typography>
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
            <Typography variant="h4">Check-in details</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Terms and Conditions
            </Typography>
            <Typography variant="body1">{checkoutDetailsState.hotel.rooms[0].rates[0].rateComments}</Typography>
          </Stack>
          <Stack className="card" spacing={1}>
            <Typography variant="h4">Your details</Typography>
            <Grid
              container
              columnSpacing={2}
              rowSpacing={{
                sm: 3,
                md: 5,
                lg: 3,
              }}
            >
              <Grid xs={12} md={6}>
                <TextInput
                  helperText="The name of one of the people checking in."
                  label="First name"
                  value={firstName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                ></TextInput>
              </Grid>
              <Grid xs={12} md={6}>
                <TextInput
                  helperText=" "
                  label="Last name"
                  value={lastName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                ></TextInput>
              </Grid>
              <Grid xs={12} md={6}>
                <TextInput
                  helperText="We'll send your confirmation email to this address."
                  label="Email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                ></TextInput>
              </Grid>
              <Grid xs={12} md={6}>
                <TextInput
                  helperText="We'll only contact you in an emergency."
                  label="Phone"
                  value={phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                ></TextInput>
              </Grid>
              <Grid xs={12}>
                <Stack direction="row" alignItems="center">
                  <Checkbox
                    checked={termsAccepted}
                    onChange={() => {
                      setTermsAccepted((value) => !value);
                    }}
                  ></Checkbox>
                  <Typography variant="body1">I agree to the terms and conditions</Typography>
                </Stack>
              </Grid>
              <Grid xs={12}>
                <Divider></Divider>
              </Grid>
              <Grid xs={12} md={9}>
                <Stack direction="row" justifyContent="space-between">
                  {checkoutDetailsState.rewards ? (
                    <Stack>
                      {checkoutDetailsState.rewards.free ? (
                        <Stack direction="row" alignItems="center">
                          <Typography>
                            Congratulations! You have enough points to cover this whole stay! Would you like to apply
                            your travel points?
                          </Typography>
                        </Stack>
                      ) : (
                        <Stack>
                          <Typography>You have {checkoutDetailsState.rewards.points} travel points.</Typography>
                          <Typography>
                            You can use them to cover up to {formatCurrency(checkoutDetailsState.rewards.discount)} of
                            this stay.
                          </Typography>
                          <Stack direction="row" alignItems="center">
                            <Checkbox
                              checked={applyDiscount}
                              onChange={() => {
                                setApplyDiscount((value) => !value);
                              }}
                            ></Checkbox>{' '}
                            <Typography>Apply the discount</Typography>
                          </Stack>
                        </Stack>
                      )}
                    </Stack>
                  ) : (
                    <Stack></Stack>
                  )}
                </Stack>
              </Grid>
              <Grid xs={12} md={3}>
                <Stack justifyContent="end" alignItems="end" sx={{ height: '100%' }}>
                  <Box onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
                    <Button onClick={onCheckout} disabled={!termsAccepted}>
                      {rebooking ? 'Rebook' : 'Checkout'}
                    </Button>
                  </Box>
                  <Popover
                    sx={{
                      pointerEvents: 'none',
                    }}
                    open={popoverOpen}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    disableRestoreFocus
                  >
                    <Typography sx={{ p: 1 }}>Please agree to the terms and conditions.</Typography>
                  </Popover>
                </Stack>
              </Grid>
            </Grid>
            <div>
              <Backdrop sx={{ color: 'primary.main' }} open={checkoutLoading}>
                <CircularProgress color="inherit" />
              </Backdrop>
            </div>
          </Stack>
          <CardModal open={open} onClose={handleClose}>
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
          </CardModal>
        </Stack>
        <Stack className="card" direction="column" spacing={2} flex={1}>
          <img
            alt=""
            {...createHotelbedsSrcSetFromPath(checkoutDetailsState.extended.images[0].path)}
            style={{
              borderRadius: 4,
              height: 200,
              objectFit: 'cover',
              width: '100%',
            }}
          />
          <Typography variant="h6" sx={{ marginBottom: 0, fontWeight: 'bold' }}>
            {checkoutDetailsState.hotel.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ marginTop: 0 }}>
            {formatAddressFromHotel(checkoutDetailsState.extended)}
          </Typography>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                  <Typography variant="body1">Check-in</Typography>
                  <Stack spacing={1} direction="row">
                    <Typography variant="body1" component="span">
                      {moment(checkoutDetailsState.hotel.checkIn).format('MMMM Do, YYYY')}
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
                      {moment(checkoutDetailsState.hotel.checkOut).format('MMMM Do, YYYY')}
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
              </Stack>
            </CardContent>
          </Card>
          <Divider></Divider>
          <Typography variant="h6">Breakdown</Typography>

          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
              <Typography variant="body1">
                {moment(checkoutDetailsState.hotel.checkIn).format('MMMM Do, YYYY')}
              </Typography>
              <Typography
                variant="body1"
                component="span"
                color={applyDiscount ? 'error' : undefined}
                sx={{
                  textDecoration: applyDiscount ? 'line-through' : undefined,
                }}
              >
                {formatCurrency(checkoutDetailsState.price.beforeTax)}
              </Typography>
            </Stack>
            {applyDiscount && (
              <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                <Typography variant="body1">Travel Point Discount</Typography>
                <Typography variant="body1" component="span" color="success.main">
                  -{formatCurrency(checkoutDetailsState.rewards.discount)}
                </Typography>
              </Stack>
            )}
            <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
              <Typography variant="body1">Tax</Typography>
              <Typography variant="body1" component="span">
                {formatCurrency(priceBook.tax)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
              <Typography variant="body1">Total</Typography>
              <Typography variant="body1" component="span">
                {formatCurrency(priceBook.afterTax)}
              </Typography>
            </Stack>
          </Stack>
          {rebooking && (
            <>
              <Divider></Divider>
              <Typography variant="h6">Refund</Typography>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                <Stack>
                  <Typography variant="body1">Rebooking Refund</Typography>
                  <Typography variant="body2">xxxx xxxx xxxx 4242</Typography>
                </Stack>
                <Typography variant="body1" component="span" color="success.main">
                  {formatCurrency(rebooking.amount_paid)}
                </Typography>
              </Stack>
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
