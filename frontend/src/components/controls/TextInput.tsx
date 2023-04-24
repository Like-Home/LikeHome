import { InputBase, FormHelperText } from '@mui/material';
import { Control, ControlProps } from './Control';

export default function TextInput({ label, icon, helperText, ...props }: ControlProps) {
  return (
    <Control
      label={label}
      icon={icon}
      sx={{
        marginBottom: helperText ? 1 : undefined,
      }}
    >
      <InputBase {...props} />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </Control>
  );
}
