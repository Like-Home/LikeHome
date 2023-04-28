// @ts-nocheck
/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */

import { Stack, ListItemText, Typography, Card, CardContent, CardActions, Button, ListItemIcon } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import Person from '@mui/icons-material/Person';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import { createHotelbedsSrcSetFromPath, formatCurrency } from '../utils';
import Amenities from './Amenities';

export default function HotelRoomCard({
  room,
  expanded = true,
  setExpanded = () => {
    /* do nothing */
  },
  reserveText,
  onClick,
}) {
  const amenities = room.facilities
    .map((f) => <Amenities facility={f} key={f.facility.description ?? f.facility.code} />)
    .filter((a) => a != null);
  // TODO: Price per night
  return (
    <Grid item sm={12} md={6} lg={3.5} key={room.code}>
      <Card sx={{ height: '100%', width: '100%' }}>
        <img
          {...createHotelbedsSrcSetFromPath(room.images[0].path)}
          alt="Room Preview"
          loading="lazy"
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        />
        <CardContent sx={{ pt: 0.5, pb: 0 }}>
          <Typography variant="h6" textTransform="capitalize">
            {room.name.toLowerCase()}
          </Typography>
          <Stack direction="row" icon={Person}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText>
              Sleeps {room.details.maxAdults}
              {room.details.maxChildren > 0
                ? ` adults, ${room.details.maxChildren} child${room.details.maxChildren !== 1 ? 'ren' : ''}`
                : ''}
            </ListItemText>
          </Stack>
          <Stack>
            {expanded ? amenities : amenities.slice(0, 4)}
            {amenities.length > 4 ? (
              !expanded ? (
                <Button variant="text" onClick={() => setExpanded(true)} sx={{ order: 2 }}>
                  <ExpandMore /> Show More
                </Button>
              ) : (
                <Button variant="text" onClick={() => setExpanded(false)} sx={{ order: 2 }}>
                  <ExpandLess /> Show Less
                </Button>
              )
            ) : null}
          </Stack>
        </CardContent>
        <CardActions sx={{ pb: 2, px: 2, justifyContent: 'space-between', alignItems: 'end' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {formatCurrency(room.rates[0].net)}
          </Typography>
          <Stack>
            <Typography sx={{ mb: 0.5 }} variant="body2">{`We have ${room.rates[0].allotment} left`}</Typography>
            <Button onClick={onClick}>{reserveText || 'Reserve'}</Button>
          </Stack>
        </CardActions>
      </Card>
    </Grid>
  );
}
