// @ts-nocheck

import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import {
  Button,
  Card,
  CardContent,
  CardActions,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Box,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Rating from '@mui/material/Rating';
import SearchBars from '../components/SearchBars';
import { hotelById, hotelOffersById } from '../recoil/hotel/atom';
import HotelRoomCard from '../components/HotelRoomCard';
import { createHotelbedsSrcSetFromPath, formatAddressFromHotel } from '../utils';
import { convertCategoryToRatingProps } from '../api/hotel';
import { usePageParamsObject } from '../hooks';
import { bookingById } from '../recoil/bookings/atom';
import CardModal from '../components/CardModal';
import Amenities from '../components/Amenities';
import userState from '../recoil/user/atom';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function rowColByIndex(index) {
  if (index < 1) {
    return { rows: 4, cols: 4 };
  }
  if (index < 4) {
    return { rows: 2, cols: 2 };
  }
  return { rows: 1, cols: 1 };
}

function groupBy(xs, func) {
  return Object.entries(
    xs.reduce(function (rv, x) {
      const group = func(x);
      // eslint-disable-next-line no-param-reassign
      (rv[group] = rv[group] || []).push(x);
      return rv;
    }, {}),
  );
}

function amenitiesGroupName(name) {
  switch (name) {
    case 'Room facilities (Standard room)':
      return 'Room';
    case 'Facilities':
    case 'Catering':
    case 'Business':
      return 'General';
    case 'Entertainment':
    case 'Health':
    case 'Sports':
      return 'Activities';
    default:
      return name;
  }
}

export default function HotelPage() {
  const user = useRecoilValue(userState);
  const { hotelId } = useParams();

  const tabs = [
    { label: 'Overview', href: '#overview', value: 0 },
    { label: 'Amenities', href: '#amenities', value: 1 },
    { label: 'Rooms', href: '#rooms', value: 2 },
    { label: 'Location', href: '#location', value: 3 },
    // { label: 'Policies', disabled: true, href: '#policies', value: 4 },
  ];

  if (!hotelId) {
    return <div>Hotel not found</div>;
  }
  const [params, setParams] = usePageParamsObject();
  const [showAllAmenities, setShowAllAmenities] = React.useState(false);

  const [showRebookingModal, setShowRebookingModal] = React.useState(false);

  const rebookingSelector = bookingById(params.rebooking !== undefined ? params.rebooking : null);
  const rebooking = useRecoilValue(rebookingSelector);

  const hotel = useRecoilValue(hotelById(hotelId));

  // TODO: Get this from SearchBars
  const today = new Date();
  const nextWeekend = new Date();
  nextWeekend.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7) + 1);
  const nextWeekendStr = nextWeekend.toISOString().split('T')[0];
  const nextWeekendPlusOne = new Date(nextWeekend);
  nextWeekendPlusOne.setDate(nextWeekendPlusOne.getDate() + 2);
  const nextWeekendPlusOneStr = nextWeekendPlusOne.toISOString().split('T')[0];
  const hotelRoomOffers = useRecoilValue(
    hotelOffersById({
      hotelCode: hotelId,
      checkin: params.checkin ?? nextWeekendStr,
      checkout: params.checkout ?? nextWeekendPlusOneStr,
      guests: params.guests ?? 2,
      rooms: params.rooms ?? 1,
    }),
  );

  useEffect(() => {
    if (rebooking) {
      setShowRebookingModal(true);
    }
  }, []);

  const [value, setValue] = React.useState(0);
  const [amenitiesTab, setAmenitiesTab] = React.useState(0);
  function handleChange(event, newValue) {
    // eslint-disable-next-line no-undef
    window.location.hash = tabs[newValue].href.slice(1);
    setValue(newValue);
  }

  const navigate = useNavigate();

  const amenities = groupBy(hotel?.facilities ?? [], (x) => amenitiesGroupName(x.facilityGroup.description))
    .map(([key, items]) => [
      key,
      items?.map((f, i) => {
        const amenity = Amenities({ facility: f });
        return amenity ? (
          <Grid item key={i} md={4} sm={6} xs={12}>
            {amenity}
          </Grid>
        ) : null;
      }),
    ])
    .filter(([key, items]) => items && items.length !== 0 && items.some((x) => x != null));

  return (
    <>
      {rebooking && (
        <CardModal open={showRebookingModal}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h3">Rebooking</Typography>
              <Typography variant="body1">
                You are rebooking your stay at{' '}
                <Typography component="span" sx={{ fontWeight: 'bold' }}>
                  {hotel.name}
                </Typography>
                .
              </Typography>
              <Typography variant="body1">
                Your previous booking was for{' '}
                <Typography component="span" sx={{ fontWeight: 'bold' }}>
                  {rebooking.rooms} {rebooking.rooms > 1 ? 'rooms' : 'room'}
                </Typography>{' '}
                and{' '}
                <Typography component="span" sx={{ fontWeight: 'bold' }}>
                  {rebooking.adults} {rebooking.adults > 1 ? 'guests' : 'guest'}
                </Typography>{' '}
                from{' '}
                <Typography component="span" sx={{ fontWeight: 'bold' }}>
                  {rebooking.check_in}
                </Typography>{' '}
                to{' '}
                <Typography component="span" sx={{ fontWeight: 'bold' }}>
                  {rebooking.check_out}
                </Typography>
                .
              </Typography>
              <Typography variant="body1">
                You can change your booking details below. If you want to change your hotel, please cancel your booking
                and place a new one.
              </Typography>
              <Typography variant="body1">
                This is a rebooking, will effectively cancel your previous booking and create a new one. You will be
                refunded for your previous booking which may take 5-7 days and charged for the new one immediately.
              </Typography>
            </Stack>
          </CardContent>
          <CardActions>
            <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
              <Button
                onClick={() => {
                  setShowRebookingModal(false);
                  navigate(-1);
                }}
                color="error"
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  setShowRebookingModal(false);
                }}
              >
                Continue
              </Button>
            </Stack>
          </CardActions>
        </CardModal>
      )}
      <Stack alignItems={'stretch'} spacing={2}>
        {rebooking && <Card sx={{ width: '100%' }}></Card>}
        <Stack className="card" spacing={0} alignItems={'start'}>
          {!rebooking && (
            <>
              <Box>
                <ImageList
                  sx={{ width: '100%', height: 420, mb: 0 }}
                  variant="quilted"
                  cols={8}
                  rowHeight={100}
                  id="overview"
                >
                  {hotel.images.slice(0, 8).map((item, index) => (
                    <ImageListItem key={item.path} {...rowColByIndex(index)}>
                      <img {...createHotelbedsSrcSetFromPath(item.path)} alt={item.title} loading="lazy" />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', mb: 2 }}>
                <Tabs value={value} onChange={handleChange} aria-label="hotel listing section tabs ">
                  {tabs.map((tab) => (
                    <Tab
                      key={tab.value}
                      label={tab.label}
                      disabled={tab.disabled}
                      {...a11yProps(tab.value)}
                      container={<Link to={tab.href} />}
                    />
                  ))}
                </Tabs>
              </Box>
            </>
          )}
          <Grid container spacing={4} p={1} mx={{ maxWidth: '100%' }}>
            <Grid item spacing={1} md={6} mb={1}>
              <Typography variant="h4">{hotel.name}</Typography>
              {hotel?.category?.description && (
                <Rating name="rating" readOnly {...convertCategoryToRatingProps(hotel?.category?.description)} />
              )}
              <Typography variant="body1">{hotel.description}</Typography>
            </Grid>
            <Grid item md={2} p={0} />
            <Grid item md={4}>
              <Stack spacing={1}>
                <img src={hotel.google_map_url} alt="Google Maps" style={{ maxWidth: 350, borderRadius: '4px' }} />
                <Typography variant="body1">{formatAddressFromHotel(hotel)}</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
        <Stack className="card" spacing={1} sx={{ p: 3 }} alignItems={'start'}>
          <Typography variant="h4" id="amenities">
            Amenities
          </Typography>
          {amenities.map(([key, items]) => (
            <React.Fragment key={key}>
              <Typography variant="h6">{key}</Typography>
              <Grid container sx={{ width: '80%' }}>
                {items}
              </Grid>
            </React.Fragment>
          ))}
        </Stack>
        <Stack className="card" alignItems={'start'}>
          <Typography variant="h4" id="rooms">
            Choose your room
          </Typography>
          <Typography sx={{ mb: 2 }}>Choose your dates to see room prices and availability.</Typography>
          <Stack
            className="push-center"
            sx={{
              width: '100%',
              pl: 1,
              mb: 3,
            }}
            alignItems={'center'}
          >
            <SearchBars
              noLocation={true}
              guests={params.guests}
              rooms={params.rooms}
              checkin={params.checkin}
              checkout={params.checkout}
              onSearch={(searchParams) => {
                const newParams = {
                  ...searchParams,
                };
                delete newParams.location;
                if (rebooking) {
                  newParams.rebooking = params.rebooking;
                }
                setParams(newParams);
              }}
            />
          </Stack>
          <Grid
            container
            spacing={2}
            sx={{
              width: '100%',
              pl: 1,
              mb: 1,
              alignItems: 'stretch',
            }}
          >
            {hotelRoomOffers.offers.rooms.map((room) => (
              <HotelRoomCard
                key={room.code}
                room={room}
                reserveText={rebooking ? 'Rebook' : 'Reserve'}
                expanded={showAllAmenities}
                setExpanded={setShowAllAmenities}
                onClick={() => {
                  const encodedRateKey = btoa(room.rates[0].rateKey);

                  let href = `/checkout/${encodeURIComponent(encodedRateKey)}`;

                  if (rebooking) {
                    href += `/?rebooking=${params.rebooking}`;
                  }

                  if (user) {
                    navigate(href);
                  } else {
                    const redirect = encodeURIComponent(href);
                    navigate(`/auth?flow=booking&redirect=${redirect}`);
                  }
                }}
              />
            ))}
          </Grid>
        </Stack>
        {!rebooking && (
          <Grid container className="card" spacing={2} p={2} alignItems={'start'}>
            <Grid item md={3}>
              <Typography variant="h5">About this location</Typography>
            </Grid>
            <Grid item md={9}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {formatAddressFromHotel(hotel)}
              </Typography>
              <Box justifyContent="center">
                <img src={hotel.google_map_url} alt="Google Maps" style={{ borderRadius: '4px', width: 275 }} />
              </Box>
              {hotel.interestPoints.length > 0 && (
                <Stack direction="column" justifyContent="space-between" id="location" sx={{ mt: 3 }}>
                  <Typography variant="h6">What&apos;s nearby</Typography>
                  <Grid container flexWrap="wrap" sx={{ ml: 2, mt: 1 }}>
                    {hotel.interestPoints.map((point) => (
                      <Grid item xs={12} md={6} lg={4} xl={3} key={point.id}>
                        <ListItem sx={{ flex: 1, p: 0 }}>
                          <ListItemText primary={point.poiName} secondary={`${point.distance / 1000} mi`} />
                        </ListItem>
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              )}
            </Grid>
          </Grid>
        )}
      </Stack>
    </>
  );
}
