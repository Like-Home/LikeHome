import { Stack, Typography } from '@mui/material';
import theTeamImage from '../assets/the-team.png';
import codeWranglers from '../assets/codewranglers.svg';

export default function AboutPage() {
  return (
    <Stack className="card card-root push-center">
      <Stack spacing={3}>
        <Stack
          spacing={3}
          direction={{
            xs: 'column',
            sm: 'row',
          }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4">About Us</Typography>
          <img src={codeWranglers} alt="Code Wranglers" width={300} />
        </Stack>
        <Typography variant="body1">
          Welcome to LikeHome, the hotel booking website that helps you find the perfect place to stay, no matter where
          you are in the world. Our mission is to make travel easier and more enjoyable for everyone by providing a
          simple and hassle-free way to book your accommodations online.
        </Typography>
        <Typography variant="body1">
          At LikeHome, we understand that each traveler has unique needs and preferences when it comes to finding the
          perfect hotel. That&apos;s why we offer a wide variety of options to choose from, whether you&apos;re looking
          for a luxury resort, a cozy bed and breakfast, or a budget-friendly hostel.
        </Typography>
        <Typography variant="body1">
          Our team of travel experts works around the clock to ensure that our website is up-to-date and accurate, so
          you can trust that the information you find on LikeHome is reliable and current. We also pride ourselves on
          our excellent customer service, so if you ever have any questions or concerns, don&apos;t hesitate to reach
          out to us.
        </Typography>
        <Typography variant="body1">
          Thank you for choosing LikeHome for your travel needs. We look forward to helping you find your next home away
          from home!
        </Typography>
        <img
          src={theTeamImage}
          alt="Meet the team"
          style={{
            borderRadius: '4px',
          }}
        />
        <Typography variant="body2">
          Meet our amazing team of rockstar developers who made this project possible!
        </Typography>
      </Stack>
    </Stack>
  );
}
