import { useRecoilValue } from 'recoil';
import {
  ListItemButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  Chip,
} from '@mui/material';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { bookingRewardsSelector } from '../recoil/bookings/atom';
import { createHotelbedsSrcSetFromPath } from '../utils';
import userAtom from '../recoil/user/atom';
import { PointOverview } from '../components/Navbar';
import { Booking, User } from '../api/types';

import Result from '../components/Result';
import PaginatedList from '../components/PaginatedList';

const RewardPageItem = ({ item: booking }: { item: Booking }) => (
  <ListItem key={booking.id}>
    <ListItemButton component={Link} to={`/booking/${booking.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Stack
        width={'100%'}
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        justifyContent="space-between"
        spacing={1}
      >
        <Stack direction={'row'} spacing={1}>
          <ListItemAvatar>
            <Avatar
              {...createHotelbedsSrcSetFromPath(booking.image)}
              variant="rounded"
              sx={{
                width: 100,
                height: 100,
                marginRight: 3,
              }}
            />
          </ListItemAvatar>
          <Stack>
            <ListItemText primary={booking.hotel.name} secondary={moment(booking.created_at).format('ll')} />
          </Stack>
        </Stack>
        <Stack
          direction={{
            xs: 'column',
            sm: 'row',
          }}
          alignItems={{
            xs: 'end',
            sm: 'center',
          }}
          spacing={1}
        >
          <ListItemText
            sx={{
              marginLeft: 5,
            }}
            primary={booking.points_earned > 0 ? `+${booking.points_earned} points` : undefined}
            primaryTypographyProps={{
              sx: {
                color: 'success.main',
              },
            }}
            secondaryTypographyProps={{
              sx: {
                color: 'error.main',
              },
            }}
            secondary={booking.points_spent > 0 ? `-${booking.points_spent} points` : undefined}
          />
        </Stack>
      </Stack>
    </ListItemButton>
  </ListItem>
);

export default function RewardsPage() {
  const response = useRecoilValue(bookingRewardsSelector);
  const user = useRecoilValue(userAtom) as User;

  return (
    <Stack className="card card-root" direction="column" alignItems={'center'} spacing={2}>
      <Stack direction="row" sx={{ width: '100%' }} spacing={4}>
        <Typography variant="h4">Rewards</Typography>
        <Stack alignItems={'center'}>
          <PointOverview user={user} />
        </Stack>
      </Stack>
      <PaginatedList
        response={response}
        placeholder={
          <Result
            title="Not much over here!"
            message={`Like usual, you have to spend money to make money — or in this case, points.`}
            variant="info"
            primaryButtonText="Book a hotel"
            primaryButtonTo="/"
          />
        }
        listItemComponent={RewardPageItem}
      />
    </Stack>
  );
}
