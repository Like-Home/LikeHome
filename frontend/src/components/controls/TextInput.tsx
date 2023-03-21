import { InputBase } from '@mui/material';
import { Control, ControlProps } from './Control';

export default function TextInput({ label, icon, ...props }: ControlProps) {
  return (
    <Control label={label} icon={icon}>
      <InputBase {...props} />
    </Control>
  );
}
