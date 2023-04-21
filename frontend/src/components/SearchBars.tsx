import { ChangeEvent, useState } from 'react';
import { Stack, Button, Grid } from '@mui/material';
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

  const [location, setLocation] = useState(props.location);
  const [checkin, setCheckin] = useState(props.checkin);
  const [checkout, setCheckout] = useState(props.checkout);
  const [guests, setGuests] = useState(props.guests || '1');
  const [rooms, setRooms] = useState(props.rooms || '1');

  const gridLayouts = {
    withLocation: {
      location: { xs: 24, sm: 4, md: 3 },
      checkin: { xs: 12, sm: 4, md: 2 },
      checkout: { xs: 12, sm: 4, md: 2 },
      guests: { xs: 12, sm: 6, md: 3 },
      search: { xs: 12, sm: 6, md: 2 },
    },
    withoutLocation: {
      location: { xs: 0, sm: 0, md: 0 },
      checkin: { xs: 12, sm: 4, md: 4 },
      checkout: { xs: 12, sm: 4, md: 4 },
      guests: { xs: 12, sm: 4, md: 2 },
      search: { xs: 12, sm: 12, md: 2 },
    },
  };

  const layout = props.noLocation ? gridLayouts.withoutLocation : gridLayouts.withLocation;

  return (
    <Grid container spacing={1}>
      {!props.noLocation && (
        <Grid item {...layout.location}>
          <LocationAutocomplete value={location} setValue={setLocation} />
        </Grid>
      )}
      <Grid item {...layout.checkin}>
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
      <Grid item {...layout.checkout}>
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
      <Grid item {...layout.guests}>
        <GuestsInput guests={guests} setGuests={setGuests} rooms={rooms} setRooms={setRooms} />
      </Grid>
      <Grid item {...layout.search}>
        <Button
          sx={{ fontSize: 20, width: '100%', height: '100%' }}
          onClick={() => {
            if (!location || !checkin || !checkout) {
              // TODO: Alert
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
  );
}
