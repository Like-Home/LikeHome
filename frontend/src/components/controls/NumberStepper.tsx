import { Button, ButtonProps } from '@mui/material';
import { Stack } from '@mui/system';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';

export default function NumberStepper({
  value = 0,
  min = 0,
  step = 1,
  label = '',
  max = Number.POSITIVE_INFINITY,
  onChange = () => null,
}: any) {
  const StepperButton = (props: ButtonProps) => (
    <Button size="small" sx={{ maxWidth: 30, minWidth: 30 }} fullWidth={false} variant="outlined" {...props} />
  );
  const doStep = (n: number) => {
    return onChange(Math.max(Math.min(value + n, max), min));
  };

  return (
    <Stack direction="row" justifyContent="space-between" sx={{ minWidth: 200, mb: 2 }}>
      <label>{label}</label>
      <Stack direction="row" spacing={1} alignItems="center">
        <StepperButton disabled={value <= min} onClick={() => doStep(-step)}>
          <Remove />
        </StepperButton>
        <span style={{ minWidth: 20, textAlign: 'center' }}>{value}</span>
        <StepperButton disabled={value >= max} onClick={() => doStep(+step)}>
          <Add />
        </StepperButton>
      </Stack>
    </Stack>
  );
}
