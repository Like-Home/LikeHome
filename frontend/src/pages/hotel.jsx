// @ts-nocheck

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { List, ListItem, ListItemText, Tab, Tabs, Box, Stack, Typography } from '@mui/material';
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

export default function HotelPage() {
  const { hotelId } = useParams();

  const tabs = [
    { label: 'Overview', href: '#overview', value: 0 },
    { label: 'Rooms', href: '#rooms', value: 1 },
    { label: 'Location', href: '#location', value: 2 },
    { label: 'Amenities', href: '#amenities', value: 3 },
    { label: 'Policies', href: '#policies', value: 4 },
  ];

  if (!hotelId) {
    return <div>Hotel not found</div>;
  }
  const [params, setParams] = usePageParamsObject();

  const hotel = useRecoilValue(hotelById(hotelId));
  const hotelRoomOffers = useRecoilValue(
    hotelOffersById({
      hotelCode: hotelId,
      ...params,
    }),
  );
  const [value, setValue] = React.useState(0);
  function handleChange(event, newValue) {
    // eslint-disable-next-line no-undef
    window.location.hash = tabs[newValue].href.slice(1);
    setValue(newValue);
  }

  return (
    <Stack className="card push-center" spacing={2} alignItems={'center'}>
      <Box>
        <ImageList sx={{ width: '100%', height: 420 }} variant="quilted" cols={8} rowHeight={100} id="overview">
          {hotel.images.slice(0, 8).map((item, index) => (
            <ImageListItem key={item.path} {...rowColByIndex(index)}>
              <img {...createHotelbedsSrcSetFromPath(item.path)} alt={item.title} loading="lazy" />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="hotel listing section tabs ">
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} {...a11yProps(tab.value)} container={<Link to={tab.href} />} />
          ))}
        </Tabs>
      </Box>
      <Stack direction="row" justifyContent="space-between">
        <Box sx={{ paddingRight: 3 }}>
          <h1>{hotel.name}</h1>
          {hotel?.category?.description && (
            <Rating name="rating" readOnly {...convertCategoryToRatingProps(hotel?.category?.description)} />
          )}
          <p>{hotel.description}</p>
        </Box>
        <Box sx={{ paddingTop: 3 }}>
          <img src={hotel.google_map_url} alt="Google Maps" style={{ borderRadius: '4px' }} />
          <p>{formatAddressFromHotel(hotel)}</p>
        </Box>
      </Stack>
      <Box
        className="push-center"
        sx={{
          width: '100%',
        }}
      >
        <SearchBars
          noLocation={true}
          guests={params.guests}
          rooms={params.rooms}
          checkin={params.checkin}
          checkout={params.checkout}
          onSearch={(searchParams) => {
            console.log(searchParams);
            setParams({
              ...searchParams,
              location: btoa(JSON.stringify(searchParams.location)),
            });
          }}
        />
      </Box>
      <Grid
        id="rooms"
        container
        spacing={2}
        sx={{
          width: '100%',
        }}
      >
        {hotelRoomOffers.offers.rooms.map((room) => (
          <HotelRoomCard key={room.code} room={room} />
        ))}
      </Grid>
      <Stack direction="row" justifyContent="space-between" id="location" sx={{ marginY: 3 }}>
        <Box sx={{ flex: '25%' }}>
          <Typography variant="h5">About this location</Typography>
        </Box>
        <Stack sx={{ flex: '75%' }}>
          <Box justifyContent="center">
            <img src={hotel.google_map_url} alt="Google Maps" style={{ borderRadius: '4px', width: '80%' }} />
          </Box>
          <Stack direction="row" justifyContent="space-between" id="location" sx={{ marginY: 3 }}>
            <Stack sx={{ flex: '50%' }}>
              <Typography variant="h6">What&apos;s nearby</Typography>
              <List>
                {hotel.interestPoints.map((point) => (
                  <ListItem key={point.id}>
                    <ListItemText primary={point.poiName} secondary={`${point.distance / 1000} mi`} />
                  </ListItem>
                ))}
              </List>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
