import { ChangeEvent, useState } from 'react';
import { Stack, Button } from '@mui/material';
import { useNavigate, Form, useSearchParams } from 'react-router-dom';

import Place from '@mui/icons-material/Place';
import TextInput from './controls/TextInput';
import GuestsInput from './controls/GuestsInput';

interface SearchPageParams {
  location?: string;
  checkin?: string;
  checkout?: string;
  guests?: string;
  rooms?: string;
}

export default function SearchBars({ query }: { query?: string }) {
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const parsedParams: SearchPageParams = Object.fromEntries([...params]);

  const [location, setLocation] = useState(query || '');
  const [checkin, setCheckin] = useState(parsedParams.checkin);
  const [checkout, setCheckout] = useState(parsedParams.checkout);
  const [guests, setGuests] = useState(parsedParams.guests || '1');
  const [rooms, setRooms] = useState(parsedParams.rooms || '1');

  return (
    <Form method="get">
      <Stack direction="row" justifyContent="center" spacing={2} m={1}>
        <TextInput
          name="q"
          icon={(props: object) => <Place {...props} />}
          placeholder="Destination"
          value={location}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
        />
        <TextInput
          name="date"
          type="date"
          label="Check-in Date"
          value={checkin}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckin(e.target.value)}
        />
        <TextInput
          name="date"
          type="date"
          label="Checkout Date"
          value={checkout}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckout(e.target.value)}
        />
        <GuestsInput guests={guests} setGuests={setGuests} rooms={rooms} setRooms={setRooms} />
        <Button
          sx={{ px: 5, fontSize: 20 }}
          onClick={() => {
            navigate(`/search?q=${location}&checkin=${checkin}&checkout=${checkout}&guests=${guests}&rooms=${rooms}`);
          }}
        >
          Search
        </Button>
      </Stack>
    </Form>
  );
}
