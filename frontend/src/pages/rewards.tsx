import { useRecoilValue } from 'recoil';
import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import { bookingsSelector } from '../recoil/bookings/atom';

export default function RewardsPage() {
  const bookings = useRecoilValue(bookingsSelector);

  const pointBalance = bookings.reduce<number>(
    (points, booking) => points + booking.points_earned - booking.points_spent,
    0,
  );

  return (
    <main className="card push-center" style={{ marginTop: 50, maxWidth: 1200 }}>
      <Stack direction="column" spacing={2} m={1}>
        <Box>
          <Typography variant="h3">Point balance</Typography>
          <Typography variant="body1">{pointBalance}</Typography>
        </Box>
        {bookings.map((booking) => (
          <Box key={booking.id}>
            <Typography variant="h4">{moment(booking.created_at).format('ll')}</Typography>

            {booking.points_spent > 0 && (
              <Typography variant="body1" color="red">
                {`-${booking.points_spent}`}
              </Typography>
            )}
            {booking.points_earned > 0 && (
              <Typography variant="body1" color="green">
                {`+${booking.points_earned}`}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    </main>
  );
}
