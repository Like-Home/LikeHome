import { Divider, Typography, Stack, List, ListItem, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import slugify from 'slugify';
import Locations from '../data/locations';
import codeWranglers from '../assets/codewranglers.svg';

const sections = [
  {
    title: 'Top Destinations',
    // TODO resolve the id's for these locations
    links: Object.entries(Locations.codes).map(([key, value]) => ({
      text: value[2] ?? value[0],
      to: `/destination/${key}/${slugify(value[0]).toLowerCase()}`,
    })),
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
    <Stack className="card card-root footer" spacing={2}>
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
      <img src={codeWranglers} alt="Code Wranglers" width={300} style={{ position: 'absolute', right: 10, top: 195 }} />
      <Divider />
      <List dense sx={{ p: 0 }}>
        {...footnotes.map((footnote, index) => (
          <ListItem key={footnote} sx={{ py: 0 }}>
            <Typography color="gray" variant="caption">{`${'*'.repeat(index + 1)} ${footnote}`}</Typography>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

export default Footer;
