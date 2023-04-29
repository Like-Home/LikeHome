import React from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Stack,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Tab,
  Tabs,
  Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import { useRecoilValue } from 'recoil';
import { useSnackbar } from 'notistack';
import { Booking } from '../api/types';
import { bookingsByStatusSelector } from '../recoil/bookings/atom';
import { createHotelbedsSrcSetFromPath } from '../utils';
import { statusToText } from '../enums';
import Result from '../components/Result';
import PaginatedList from '../components/PaginatedList';

function BookingItem({ item: booking }: { item: Booking }) {
  const linkToDetails = `/booking/${booking.id}`;
  const theme = useTheme();

  return (
    <ListItem
      secondaryAction={
        <Button variant="contained" component={Link} to={linkToDetails}>
          View
        </Button>
      }
    >
      <ListItemAvatar>
        <Avatar
          alt="Hotel Room Image"
          {...createHotelbedsSrcSetFromPath(booking.image)}
          variant="rounded"
          sx={{
            width: theme.spacing(20),
            height: theme.spacing(20),
            marginInlineEnd: theme.spacing(2),
          }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="h6" color="text.primary">
            {booking.hotel.name}
          </Typography>
        }
        secondary={
          <div>
            <div>
              <Typography variant="body2" color="text.primary">
                Status: {statusToText[booking.status]}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="text.primary">
                Check-in: {moment(booking.check_in).format('ll')}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="text.primary">
                Check-out: {moment(booking.check_out).format('ll')}
              </Typography>
            </div>
          </div>
        }
      />
    </ListItem>
  );
}

export default function BookingsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = React.useState(0);

  const confirmedResponse = useRecoilValue(bookingsByStatusSelector(['CO', 'IP']));
  const pastResponse = useRecoilValue(bookingsByStatusSelector('PA'));
  const canceledResponse = useRecoilValue(bookingsByStatusSelector(['CA', 'RE']));

  const tabs = [
    {
      response: confirmedResponse,
      placeholder: (
        <Result
          key={1}
          variant="info"
          title="Frugal much?"
          message="Go spend some money and check back."
          primaryButtonText="Book a room now"
          primaryButtonTo="/"
        />
      ),
    },
    {
      response: pastResponse,
      placeholder: (
        <Result
          key={2}
          variant="info"
          title="Nothing to see here!"
          message="It would appear you've never had the pleasure of staying at one of our hotels!"
          primaryButtonText="Book a room now"
          primaryButtonTo="/"
        />
      ),
    },
    {
      response: canceledResponse,
      placeholder: (
        <Result
          key={3}
          variant="success"
          title="We're proud!"
          message="You've never gone back on your word and canceled a booking! Yet..."
          primaryButtonText="Cancel one now"
          onPrimaryButtonClick={() => {
            setValue(0);
            if (confirmedResponse.total > 0) {
              enqueueSnackbar("You don't have to, please don't.", {
                variant: 'warning',
              });
            } else {
              enqueueSnackbar('Ha! You have no bookings to cancel.', {
                variant: 'info',
              });
            }
          }}
        />
      ),
    },
  ].map(({ response, placeholder }) => (
    <PaginatedList
      key={response.links.generic}
      response={response}
      placeholder={placeholder}
      listItemComponent={BookingItem}
    />
  ));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Stack className="card card-root" spacing={2}>
      <Typography variant="h4">My Bookings</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Current" />
          <Tab label="Past" />
          <Tab label="Canceled" />
        </Tabs>
      </Box>
      {tabs[value]}
    </Stack>
  );
}
