import { Divider, Typography, Stack, List, ListItem, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: 'Top Destinations',
    // TODO resolve the id's for these locations
    // TODO: Do we want to use the prefix "Hotels in"?
    links: [
      {
        // text: 'Hotels in Las Vegas',
        text: 'Las Vegas',
        to: '/destination/nnnn/las-vegas',
      },
      {
        // text: 'Hotels in New York',
        text: 'New York',
        to: '/destination/nnnn/new-york',
      },
      {
        // text: 'Hotels in Chicago',
        text: 'Chicago',
        to: '/destination/nnnn/chicago',
      },
      {
        // text: 'Hotels in Orlando',
        text: 'Orlando',
        to: '/destination/nnnn/orlando',
      },
      {
        // text: 'Hotels in New Orleans',
        text: 'New Orleans',
        to: '/destination/nnnn/new-orleans',
      },
      {
        // text: 'Hotels in San Diego',
        text: 'San Diego',
        to: '/destination/nnnn/san-diego',
      },
      {
        // text: 'Hotels in Nashville',
        text: 'Nashville',
        to: '/destination/nnnn/nashville',
      },
      {
        // text: 'Hotels in San Francisco',
        text: 'San Francisco',
        to: '/destination/nnnn/san-francisco',
      },
      {
        // text: 'Hotels in Los Angeles',
        text: 'Los Angeles',
        to: '/destination/nnnn/los-angeles',
      },
      {
        // text: 'Hotels in Miami',
        text: 'Miami',
        to: '/destination/nnnn/miami',
      },
      {
        // text: 'Hotels in Paris',
        text: 'Paris',
        to: '/destination/nnnn/paris',
      },
      {
        // text: 'Hotels in Denver',
        text: 'Denver',
        to: '/destination/nnnn/denver',
      },
      {
        // text: 'Hotels in Washington',
        text: 'Washington',
        to: '/destination/nnnn/washington',
      },
      {
        // text: 'Hotels in Austin',
        text: 'Austin',
        to: '/destination/nnnn/austin',
      },
      {
        // text: 'Hotels in Atlanta',
        text: 'Atlanta',
        to: '/destination/nnnn/atlanta',
      },
      {
        // text: 'Hotels in San Antonio',
        text: 'San Antonio',
        to: '/destination/nnnn/san-antonio',
      },
      {
        // text: 'Hotels in Boston',
        text: 'Boston',
        to: '/destination/nnnn/boston',
      },
      {
        // text: 'Hotels in Atlantic City',
        text: 'Atlantic City',
        to: '/destination/nnnn/atlantic-city',
      },
      {
        // text: 'Hotels in Key West',
        text: 'Key West',
        to: '/destination/nnnn/key-west',
      },
      {
        // text: 'Hotels in London',
        text: 'London',
        to: '/destination/nnnn/london',
      },
      {
        // text: 'Hotels in Virginia Beach',
        text: 'Virginia Beach',
        to: '/destination/nnnn/virginia-beach',
      },
      {
        // text: 'Hotels in Seattle',
        text: 'Seattle',
        to: '/destination/nnnn/seattle',
      },
      {
        // text: 'Hotels in Anaheim',
        text: 'Anaheim',
        to: '/destination/nnnn/anaheim',
      },
      {
        // text: 'Hotels in Dallas',
        text: 'Dallas',
        to: '/destination/nnnn/dallas',
      },
    ],
  },
  {
    title: 'Support & FAQ',
    links: [
      {
        text: 'Your bookings',
        to: '/bookings',
      },
      {
        text: 'FAQs',
        to: '/faqs',
      },
      {
        text: 'Contact us',
        to: '/contact',
      },
    ],
  },
  {
    title: 'Policies',
    links: [
      {
        text: 'Privacy Policy',
        to: '/privacy',
      },
      {
        text: 'Terms of Use',
        to: '/terms',
      },
      {
        text: 'Cookies Policy',
        to: '/cookies',
      },
    ],
  },
  {
    title: 'Other Information',
    links: [
      {
        text: 'About Us',
        to: '/about',
      },
      {
        text: 'Hotels near me',
        to: '/hotels-near-me',
      },
      {
        text: 'Site Index',
        to: '/site-index',
      },
    ],
  },
];

const footnotes = ['Some hotels require you to cancel more than 24 hours before check-in. Details on site.'];

function Footer() {
  const theme = useTheme();
  return (
    <Stack className="card footer" spacing={2}>
      <Typography variant="h5">LikeHome Group</Typography>
      <Stack
        direction={{
          xs: 'column',
          sm: 'row',
        }}
      >
        {...sections.map((section) => (
          <Stack
            key={section.title}
            sx={{
              flex: section.links.length > 5 ? 2 : 1,
              [theme.breakpoints.up('md')]: {
                flex: section.links.length > 5 ? 3 : 1,
              },
            }}
          >
            <Typography variant="subtitle1">{section.title}</Typography>
            <List
              sx={{
                columns: section.links.length > 5 ? 2 : 1,
                [theme.breakpoints.up('md')]: {
                  columns: section.links.length > 5 ? 3 : 1,
                },
              }}
              dense
            >
              {section.links.map((link) => (
                <ListItem key={link.text}>
                  <Link to={link.to}>
                    <Typography variant="subtitle2">{link.text}</Typography>
                  </Link>
                </ListItem>
              ))}
            </List>
          </Stack>
        ))}
      </Stack>
      <Divider />
      <List>
        {...footnotes.map((footnote, index) => (
          <ListItem key={footnote}>
            <Typography variant="caption">{`${'*'.repeat(index + 1)} ${footnote}`}</Typography>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

export default Footer;
