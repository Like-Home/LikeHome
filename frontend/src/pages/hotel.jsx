// @ts-nocheck

import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { List, ListItem, ListItemText, Tab, Tabs, Box, Stack, Typography } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Rating from '@mui/material/Rating';
import userAtom from '../recoil/user';
import SearchBars from '../components/SearchBars';
// import { createBooking } from '../api/bookings';
import { hotelById } from '../recoil/hotel/atom';

function srcset(image) {
  return {
    src: `http://photos.hotelbeds.com/giata/bigger/${image}`,
    srcSet: `http://photos.hotelbeds.com/giata/bigger/${image}`,
  };
}
// function srcset(image, size, rows = 1, cols = 1) {
//   return {
//     src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
//     srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
//   };
// }
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

function convertCategoryToRatingProps(categoryDescription) {
  const numbers = categoryDescription.match(/\d/);
  const props = {};

  if (numbers) {
    props.value = parseInt(numbers[0], 10);
  }

  if (categoryDescription.match(/half/i)) {
    props.precision = 0.5;
  }

  return props;
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

  const [rawParams] = useSearchParams();
  const params = Object.fromEntries([...rawParams]);

  const user = useRecoilValue(userAtom);
  console.log(user);
  const hotel = useRecoilValue(hotelById(hotelId));
  const [value, setValue] = React.useState(0);
  function handleChange(event, newValue) {
    // window.scrollTo({
    //   top: 0,
    //   left: 0,
    //   behavior: 'smooth',
    // })
    // eslint-disable-next-line no-undef
    window.location.hash = tabs[newValue].href.slice(1);
    setValue(newValue);
  }
  // function onBookNow(roomId: string) {
  //   createBooking({
  //     hotel_id: hotelId as string,
  //     // rooms: rooms,
  //     room_id: roomId,
  //     guest_count: params.guests || '1',
  //     start_date: `${params.checkin}T00:00:00Z`,
  //     end_date: `${params.checkout}T00:00:00Z`,
  //   });
  // }

  console.log(params);

  return (
    <main className="card push-center" style={{ marginTop: 50, maxWidth: 1200 }}>
      <ImageList sx={{ width: '100%', height: 420 }} variant="quilted" cols={8} rowHeight={100} id="overview">
        {hotel.images.slice(0, 8).map((item, index) => (
          <ImageListItem key={item.path} {...rowColByIndex(index)}>
            {/* <img {...srcset(item.img, 121, item.rows, item.cols)} alt={item.title} loading="lazy" /> */}
            <img {...srcset(item.path, 121, item.rows, item.cols)} alt={item.title} loading="lazy" />
          </ImageListItem>
        ))}
      </ImageList>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="hotel listing section tabs ">
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              {...a11yProps(tab.value)}
              containerElement={<Link to={tab.href} />}
            />
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
          <p>
            {hotel.address}, {hotel.city} {hotel.state} {hotel.postalCode}
          </p>
        </Box>
      </Stack>
      <Stack id="rooms">
        <SearchBars
          noLocation={true}
          guests={params.guests}
          rooms={params.rooms}
          checkin={params.checkin}
          checkout={params.checkout}
        />
      </Stack>
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
    </main>
  );
}
