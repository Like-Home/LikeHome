// @ts-nocheck
/* eslint-disable react/prop-types */

import {
  Stack,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createHotelbedsSrcSetFromPath } from '../utils';
// import { createBooking } from '../api/bookings';

export default function HotelRoomCard({ room }) {
  const navigate = useNavigate();
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

  function onReserve() {
    navigate(`/checkout/${btoa(room.rates[0].rateKey)}`);
  }

  return (
    <Grid item sm={12} md={6} lg={4} key={room.code}>
      <Card sx={{ height: '100%', width: '100%' }}>
        <img
          {...createHotelbedsSrcSetFromPath(room.images[0].path)}
          alt="Room Preview"
          loading="lazy"
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        />
        <CardContent>
          <Typography variant="h5">{room.name}</Typography>
          <List>
            <ListItem>
              <ListItemText primary="Max Adults" secondary={room.details.maxAdults} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Max Children" secondary={room.details.maxChildren} />
            </ListItem>
            {/* {room.facilities.map(facility => (<ListItem>
              <ListItemText primary={facility.facility} secondary={room.maxOccupancy} />
            </ListItem>)} */}
          </List>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">{room.rates[0].net}</Typography>
            <Typography variant="body2">{`We have ${room.rates[0].allotment} left`}</Typography>
          </Stack>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={onReserve}>
            Reserve
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
