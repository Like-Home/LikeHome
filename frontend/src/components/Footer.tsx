// import Stack and list components from Material UI
import { Divider, Typography, Stack, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: 'Top Destinations',
    // TODO resolve the id's for these locations
    links: [
      {
        text: 'Hotels in Las Vegas',
        to: '/destination/nnnn/las-vegas',
      },
      {
        text: 'Hotels in New York',
        to: '/destination/nnnn/new-york',
      },
      {
        text: 'Hotels in Chicago',
        to: '/destination/nnnn/chicago',
      },
      {
        text: 'Hotels in Orlando',
        to: '/destination/nnnn/orlando',
      },
      {
        text: 'Hotels in New Orleans',
        to: '/destination/nnnn/new-orleans',
      },
      {
        text: 'Hotels in San Diego',
        to: '/destination/nnnn/san-diego',
      },
      {
        text: 'Hotels in Nashville',
        to: '/destination/nnnn/nashville',
      },
      {
        text: 'Hotels in San Francisco',
        to: '/destination/nnnn/san-francisco',
      },
      {
        text: 'Hotels in Los Angeles',
        to: '/destination/nnnn/los-angeles',
      },
      {
        text: 'Hotels in Miami',
        to: '/destination/nnnn/miami',
      },
      {
        text: 'Hotels in Paris',
        to: '/destination/nnnn/paris',
      },
      {
        text: 'Hotels in Denver',
        to: '/destination/nnnn/denver',
      },
      {
        text: 'Hotels in Washington',
        to: '/destination/nnnn/washington',
      },
      {
        text: 'Hotels in Austin',
        to: '/destination/nnnn/austin',
      },
      {
        text: 'Hotels in Atlanta',
        to: '/destination/nnnn/atlanta',
      },
      {
        text: 'Hotels in San Antonio',
        to: '/destination/nnnn/san-antonio',
      },
      {
        text: 'Hotels in Boston',
        to: '/destination/nnnn/boston',
      },
      {
        text: 'Hotels in Atlantic City',
        to: '/destination/nnnn/atlantic-city',
      },
      {
        text: 'Hotels in Key West',
        to: '/destination/nnnn/key-west',
      },
      {
        text: 'Hotels in London',
        to: '/destination/nnnn/london',
      },
      {
        text: 'Hotels in Virginia Beach',
        to: '/destination/nnnn/virginia-beach',
      },
      {
        text: 'Hotels in Seattle',
        to: '/destination/nnnn/seattle',
      },
      {
        text: 'Hotels in Anaheim',
        to: '/destination/nnnn/anaheim',
      },
      {
        text: 'Hotels in Dallas',
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
        to: '/about-us',
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
  return (
    <Stack className="card footer">
      <Typography variant="h5">LikeHome Group</Typography>
      <Stack
        direction={{
          xs: 'column',
          sm: 'row',
        }}
      >
        {...sections.map((section) => (
          <List
            key={section.title}
            sx={{
              flex: 1,
            }}
          >
            <ListItem>
              <ListItemText primary={section.title} />
            </ListItem>
            {section.links.map((link) => (
              <ListItem key={link.text}>
                <Link to={link.to}>
                  <ListItemText primary={link.text} />
                </Link>
              </ListItem>
            ))}
          </List>
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
