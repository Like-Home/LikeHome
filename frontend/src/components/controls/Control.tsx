import React from 'react';
import { Paper, Stack, SxProps } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

type IconType = (props: { style?: object }) => JSX.Element;

export interface ControlProps {
  helperText?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  icon?: IconType;
  label?: string;
  error?: boolean;
  children?: React.ReactNode;
  sx?: SxProps;
  [arbitrary: string]: unknown;
}

export const Control = React.forwardRef(function Control(
  { sx = {}, icon, label, error, onClick, children = [], ...props }: ControlProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const theme = useTheme();
  const Icon = icon;
  return (
    <Paper
      sx={{
        p: 1,
        px: 1.5,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 52,
        flex: 1,
        background: '#494747',
        boxShadow: error ? `0px 2px 5px ${alpha(theme.palette.error.light, 0.25)}` : '0px 2px 5px rgba(0, 0, 0, 0.25)',
        borderRadius: '6px',
        overflow: 'hidden',
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
      <label
        style={{
          fontSize: 12,
          opacity: 0.75,
          lineHeight: 0.5,
          marginTop: 4,
          pointerEvents: 'none',
          // color: error ? theme.palette.error.main : undefined,
        }}
      >
        {label ?? ''}
      </label>
      <Stack direction="row" spacing={1}>
        {Icon && (
          <div>
            <Icon style={{ opacity: 0.5, marginTop: 6, fontSize: '20px' }} />
          </div>
        )}
        <Stack direction="column" flex={1} alignItems="stretch">
          {children}
        </Stack>
      </Stack>
    </Paper>
  );
});
