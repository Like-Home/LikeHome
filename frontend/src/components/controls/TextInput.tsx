import { InputBase, FormHelperText, InputBaseProps } from '@mui/material';
import { Control, ControlProps } from './Control';

export default function TextInput({ label, icon, helperText, ...props }: ControlProps & InputBaseProps) {
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
