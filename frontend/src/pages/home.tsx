import { Card, Stack, Button, Typography, Box } from '@mui/material';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import Discount from '@mui/icons-material/Discount';
import ShieldMoon from '@mui/icons-material/ShieldMoon';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import SearchBars from '../components/SearchBars';
import userAtom from '../recoil/user';

const iconStyle = {
  fontSize: 80,
};

export default function HomePage() {
  const user = useRecoilValue(userAtom);
  const cards = [
    {
      id: 1,
      title: 'Reward yourself your way',
      body: 'Stay where you want, when you want, and get rewarded',
      icon: <CalendarMonth sx={iconStyle} />,
      footer: !user
        ? () => (
            <Box>
              <Button variant="contained" color="primary" component={Link} to="/auth">
                Unlock instant savings
              </Button>
            </Box>
          )
        : null,
    },
    {
      id: 2,
      title: 'Unlock instant savings',
      body: 'Earn reward points and redeem them for discounted stays!',
      icon: <Discount sx={iconStyle} />,
      footer: !user
        ? () => (
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="primary" component={Link} to="/auth">
                Sign up, it&lsquo;s free
              </Button>
              <Button variant="contained" color="primary" component={Link} to="/auth">
                Sign in
              </Button>
            </Stack>
          )
        : null,
    },
    {
      id: 3,
      title: 'Free cancellations',
      body: 'Flexible bookings at most hotels',
      footer: () => (
        <Typography sx={{ mt: 3, fontSize: 11 }} color="dimgray" variant="caption">
          * Bookings must be cancelled at least 24 hours in advance of check-in.
        </Typography>
      ),
      icon: <ShieldMoon sx={iconStyle} />,
    },
  ];
  return (
    <>
      <main className="card push-center" style={{ padding: 24, paddingBottom: 30 }}>
        <Stack spacing={2}>
          <h1 className="text-center">Every hotel, simple pricing.</h1>
          <SearchBars />
          <Stack
            style={{ margin: 4, marginTop: 10 }}
            sx={{
              background:
                "url('https://a.travel-assets.com/travel-assets-manager/cread-1037/HCOM_WeekendMOD_hero_1856x796_20230308.jpg?impolicy=fcrop&w=1400&h=600&q=mediumHigh')",
              backgroundSize: 'cover',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <Stack
              sx={{
                background: 'rgba(0, 0, 0, 0.7)',
              }}
            >
              <Stack
                sx={{
                  maxWidth: 300,
                  padding: 5,
                }}
                spacing={3}
              >
                <Typography variant="h4">Your weekend escape plan</Typography>
                <Typography variant="body1">
                  As a member, you save an average of 10% on thousands of hotels, so take that spontaneous trip.
                </Typography>
                {!user && (
                  <Button component={Link} to="/auth">
                    Access Member Prices
                  </Button>
                )}
              </Stack>
            </Stack>
          </Stack>
          <Stack
            style={{ margin: 4, marginTop: 10 }}
            direction={{ md: 'column', lg: 'row' }}
            spacing={{
              xs: 1,
              lg: 2,
            }}
          >
            {...cards.map((card) => (
              <Card key={card.id} sx={{ flex: 1, padding: 2, pb: 3 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    height: '100%',
                  }}
                >
                  {card.icon}
                  <Stack>
                    <h3 style={{ marginTop: 0 }}>{card.title}</h3>
                    <p>{card.body}</p>
                    {card.footer && card.footer()}
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Stack>
      </main>
    </>
  );
}
