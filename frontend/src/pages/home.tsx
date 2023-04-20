import { Card, Stack, Button, Typography, Divider, Box } from '@mui/material';
import { CalendarMonth, Discount, ShieldMoon } from '@mui/icons-material';
import SearchBars from '../components/SearchBars';

const iconStyle = {
  fontSize: 80,
};
const cards = [
  {
    id: 1,
    title: 'Reward yourself your way',
    body: 'Stay where you want, when you want, and get rewarded',
    icon: <CalendarMonth sx={iconStyle} />,
    footer: () => (
      <Box>
        <Button variant="contained" color="primary">
          Unlock instant savings
        </Button>
      </Box>
    ),
  },
  {
    id: 2,
    title: 'Unlock instant savings',
    body: 'Earn reward points and redeem them for discounted stays!',
    icon: <Discount sx={iconStyle} />,
    footer: () => (
      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="primary">
          Sign up, it&lsquo;s free
        </Button>
        <Button variant="contained" color="primary">
          Sign in
        </Button>
      </Stack>
    ),
  },
  {
    id: 3,
    title: 'Free cancellations',
    // TODO: foot note about 24 hour cancellation
    body: 'Flexible bookings at most hotels*',
    icon: <ShieldMoon sx={iconStyle} />,
    footer: null,
  },
];

export default function HomePage() {
  return (
    <>
      <main className="card push-center">
        <Stack spacing={2}>
          <h1 className="text-center">Every hotel, simple pricing.</h1>
          <SearchBars />
          <Stack
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
                <Button>Access Member Prices</Button>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            direction={{ md: 'column', lg: 'row' }}
            spacing={{
              xs: 1,
              lg: 2,
            }}
          >
            {...cards.map((card) => (
              <Card key={card.id} sx={{ flex: 1, padding: 1 }}>
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
                    <h3>{card.title}</h3>
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
