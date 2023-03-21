import { Stack, Button } from '@mui/material';
import { useState } from 'react';
import { Form } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../recoil/user';
import TextInput from './inputs/TextInput';

export default function SearchBars({ query = null }: any) {
  const user = useRecoilValue(userAtom);
  const [q, setQ] = useState(query);

  return (
    <Form method="get" action="/search">
      <Stack direction="row" justifyContent="center" spacing={2} m={1}>
        <TextInput
          name="q"
          placeholder="Search destinations..."
          value={q}
          onChange={(e: any) => setQ(e.target.value)}
        />
        <TextInput name="date" label="Date" />
        <TextInput name="guests" label="Guests" />
        <Button type="submit" sx={{ px: 5, fontSize: 20 }}>
          Search
        </Button>
      </Stack>
    </Form>
  );
}
