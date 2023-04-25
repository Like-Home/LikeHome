import { Box, Stack, Skeleton, Slider, Typography } from '@mui/material';
import { formatCurrency } from '../../utils';

export default function PriceSlider({
  priceRange,
  setPriceRange,
  min = 0,
  max = 500,
  loading = false,
  maxIncludesAbove = false,
}: {
  priceRange: number[];
  setPriceRange: (v: number[]) => void;
  min?: number;
  max?: number;
  maxIncludesAbove?: boolean;
  loading?: boolean;
}) {
  const maxPostfix = maxIncludesAbove ? '+' : '';
  return (
    <Stack alignItems={'center'}>
      <Typography width="100%" mb={loading ? 0 : 5}>
        Price
      </Typography>
      {loading ? (
        <Skeleton width="70%" height={100} />
      ) : (
        <>
          <Box sx={{ width: '70%' }}>
            <Slider
              value={priceRange}
              max={max}
              min={min}
              step={10}
              onChange={(e, v) => Array.isArray(v) && setPriceRange(v)}
              valueLabelDisplay="on"
              valueLabelFormat={(v, i) =>
                i === 1 && v >= max ? `${formatCurrency(v)}${maxPostfix}` : `${formatCurrency(v)}`
              }
              disableSwap
            />
          </Box>
          <Typography variant="body2" sx={{ mx: 'auto' }}>
            per night per adult
          </Typography>
        </>
      )}
    </Stack>
  );
}
