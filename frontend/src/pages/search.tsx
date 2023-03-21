import { Card, Stack, Typography } from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';
import HotelCard from '../components/HotelCard';
import SearchBars from '../components/SearchBars';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const { q: query } = Object.fromEntries([...params]);

  return (
    <main className="card push-center" style={{ marginTop: 50, maxWidth: 1200 }}>
      <SearchBars query={query} />
      <Stack sx={{ mt: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography color="#999">Found 120 locations</Typography>
        <Stack spacing={3} mt={2} mb={3}>
          <HotelCard />
          <HotelCard />
        </Stack>
      </Stack>
    </main>
  );
}
