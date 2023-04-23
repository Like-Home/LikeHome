import React from 'react';
import { Paper, Stack, SxProps } from '@mui/material';

type Icon = (props: { color?: string }) => JSX.Element;

export interface ControlProps {
  helperText?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  icon?: Icon;
  label?: string;
  children?: React.ReactNode;
  sx?: SxProps;
  [arbitrary: string]: unknown;
}

export const Control = React.forwardRef(function Control(
  { sx = {}, icon, label, onClick, children = [], ...props }: ControlProps,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <Paper
      sx={{
        p: 1,
        px: 1.5,
        display: 'flex',
        flexDirection: 'column',
        height: 50,
        flex: 1,
        background: '#494747',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.25)',
        borderRadius: '6px',

        '&:hover': onClick && {
          cursor: 'pointer',
          background: '#666262',
        },
        ...sx,
      }}
      ref={ref}
      onClick={onClick}
      {...props}
    >
      <label style={{ fontSize: 12, opacity: 0.75, lineHeight: 0.5, marginTop: 4, pointerEvents: 'none' }}>
        {label ?? ''}
      </label>
      <Stack direction="row" spacing={1}>
        {typeof icon === 'function' && icon({ color: 'disabled' })}
        <Stack direction="column" flex={1} alignItems="stretch">
          {children}
        </Stack>
      </Stack>
    </Paper>
  );
});
