// @ts-nocheck
/* eslint-disable react/prop-types */

import {
  Stack,
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  ListItemIcon,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import Person from '@mui/icons-material/Person';
import Fitness from '@mui/icons-material/FitnessCenter';
import Sailing from '@mui/icons-material/Sailing';
import Bed from '@mui/icons-material/Bed';
import { createHotelbedsSrcSetFromPath, formatCurrency } from '../utils';

const FacilityIcons = {
  Sailing,
  Fitness,
  'Children share the bed with parents': Bed,
};

export default function HotelRoomCard({ room, reserveText, onClick }) {
  // TODO: Price per night
  return (
    <Grid item sm={12} md={6} lg={3.5} mr={2} mb={2} key={room.code}>
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
          <List dense>
            <ListItem icon={Person}>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText>
                Sleeps {room.details.maxAdults}
                {room.details.maxChildren > 0
                  ? ` adults, ${room.details.maxChildren} child${room.details.maxChildren !== 1 ? 'ren' : ''}`
                  : ''}
              </ListItemText>
            </ListItem>
            {room.facilities.map((facility) => {
              const Icon = FacilityIcons[facility.facility];
              return (
                <ListItem key={facility.facility}>
                  {Icon && (
                    <ListItemIcon>
                      <Icon />
                    </ListItemIcon>
                  )}
                  <ListItemText primary={facility.facility} secondary={room.maxOccupancy} />
                </ListItem>
              );
            })}
          </List>
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
