import { InputBase, FormHelperText, InputBaseProps } from '@mui/material';
import React from 'react';
import { Control, ControlProps } from './Control';

export const TextInput = React.forwardRef(function TextInput(
  { label, icon, helperText, ...props }: ControlProps & InputBaseProps,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <Control
      label={label}
      icon={icon}
      sx={{
        marginBottom: helperText ? 1 : undefined,
      }}
      ref={ref}
    >
      <InputBase {...props} />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </Control>
  );
});

export default TextInput;
