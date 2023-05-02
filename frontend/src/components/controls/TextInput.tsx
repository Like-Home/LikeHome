import { InputBase, FormHelperText, InputBaseProps } from '@mui/material';
import React from 'react';
import { Control, ControlProps } from './Control';

export const TextInput = React.forwardRef(function TextInput(
  { label, icon, error, helperText, ...props }: ControlProps & InputBaseProps,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <>
      <Control
        label={label}
        icon={icon}
        error={error}
        sx={{
          marginBottom: helperText ? 1 : undefined,
        }}
        ref={ref}
      >
        <InputBase {...props} />
      </Control>
      {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
    </>
  );
});

export default TextInput;
