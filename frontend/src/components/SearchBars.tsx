import { ChangeEvent, useState } from 'react';
import { Stack, Button, Alert } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useNavigate } from 'react-router-dom';
import TextInput from './controls/TextInput';
import GuestsInput from './controls/GuestsInput';
import LocationAutocomplete from './LocationAutocomplete';

export type SearchPageParams = {
  location?: string;
  checkin?: string;
  checkout?: string;
  guests?: string;
  rooms?: string;
};

export type onSearchProps = {
  location?: {
    code: string;
    name: string;
  };
  checkin?: string;
  checkout?: string;
  guests?: string;
  rooms?: string;
};

type SearchBarProps = SearchPageParams & {
  location?: {
    code: string;
    name: string;
  };
  noLocation?: boolean;
  onSearch?: (props: onSearchProps) => void;
};

/**
 * Renders the hotel search bars
 * @param query
 * @param onSearch redirect to /search if not set
 * @returns
 */
export default function SearchBars(props: SearchPageParams & SearchBarProps) {
  const navigate = useNavigate();

  // default to setting the checkin/checkout date to the next weekend
  const today = new Date();
  const nextWeekend = new Date();
  nextWeekend.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7) + 1);
  const nextWeekendStr = nextWeekend.toISOString().split('T')[0];
  const nextWeekendPlusOne = new Date(nextWeekend);
  nextWeekendPlusOne.setDate(nextWeekendPlusOne.getDate() + 2);
  const nextWeekendPlusOneStr = nextWeekendPlusOne.toISOString().split('T')[0];

  const [location, setLocation] = useState(props.location);
  const [checkin, setCheckin] = useState(props.checkin || nextWeekendStr);
  const [checkout, setCheckout] = useState(props.checkout || nextWeekendPlusOneStr);
  const [guests, setGuests] = useState(props.guests || '2');
  const [rooms, setRooms] = useState(props.rooms || '1');

  const [alert, setAlert] = useState('');

  const gridLayouts = {
    withLocation: {
      location: { xs: 24, sm: 4, md: 3.25 },
      checkin: { xs: 12, sm: 4, md: 2.25 },
      checkout: { xs: 12, sm: 4, md: 2.25 },
      guests: { xs: 12, sm: 6, md: 2.25 },
      search: { xs: 12, sm: 6, md: 2 },
    },
    withoutLocation: {
      location: { xs: 0, sm: 0, md: 0 },
      checkin: { xs: 12, sm: 4, md: 3 },
      checkout: { xs: 12, sm: 4, md: 3 },
      guests: { xs: 12, sm: 4, md: 3 },
      search: { xs: 12, sm: 12, md: 3 },
    },
  };

  const layout = props.noLocation ? gridLayouts.withoutLocation : gridLayouts.withLocation;

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      {alert && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {alert}
        </Alert>
      )}
      <Grid container spacing={1} sx={{ width: '100%' }}>
        {!props.noLocation && (
          <Grid {...layout.location}>
            <LocationAutocomplete value={location} setValue={setLocation} />
          </Grid>
        )}
        <Grid {...layout.checkin}>
          <Stack justifyContent="center">
            <TextInput
              name="date"
              type="date"
              label="Check-in Date"
              value={checkin}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckin(e.target.value)}
              sx={{
                height: '100%',
              }}
            />
          </Stack>
        </Grid>
        <Grid {...layout.checkout}>
          <Stack justifyContent="center">
            <TextInput
              name="date"
              type="date"
              label="Checkout Date"
              value={checkout}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckout(e.target.value)}
              sx={{
                height: '100%',
              }}
            />
          </Stack>
        </Grid>
        <Grid {...layout.guests}>
          <GuestsInput guests={guests} setGuests={setGuests} rooms={rooms} setRooms={setRooms} />
        </Grid>
        <Grid {...layout.search}>
          <Button
            sx={{ fontSize: 20, width: '100%', height: '100%' }}
            onClick={() => {
              if (!checkin || !checkout) {
                setAlert('Please enter check-in and checkout dates.');
                return;
              }
              if (!props.noLocation && !location) {
                setAlert('Please select a location.');
                return;
              }
              if (props.onSearch) {
                props.onSearch({
                  location,
                  checkin,
                  checkout,
                  guests,
                  rooms,
                });
              } else {
                // TODO: kidna hacky to pass this in the URL. Any ides?
                const locationHash = btoa(JSON.stringify(location));
                // TODO: validate dates before proceeding
                navigate(
                  `/search?location=${locationHash}&checkin=${checkin}&checkout=${checkout}&guests=${guests}&rooms=${rooms}`,
                );
              }
            }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
}
