import { Stack, Button } from '@mui/material';
import { useState } from 'react';
import { Form } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Place from '@mui/icons-material/Place';
import userAtom from '../recoil/user';
import TextInput from './controls/TextInput';
import GuestsInput from './controls/GuestsInput';

export default function SearchBars({ query }: any) {
  const user = useRecoilValue(userAtom);
  const [q, setQ] = useState(query);

  return (
    <Form method="get" action="/search">
      <Stack direction="row" justifyContent="center" spacing={2} m={1}>
        <TextInput
          name="q"
          icon={(props: any) => <Place {...props} />}
          placeholder="Search destinations..."
          value={q}
          onChange={(e: any) => setQ(e.target.value)}
        />
        <TextInput name="date" type="date" label="Start Date" />
        <GuestsInput />
        <Button type="submit" sx={{ px: 5, fontSize: 20 }}>
          Search
        </Button>
      </Stack>
    </Form>
  );
}
