import { Paper, PaperProps, Stack, SxProps } from '@mui/material';

export interface ControlProps {
  onClick?: any;
  icon?: any;
  label?: string;
  children?: any;
  sx?: SxProps;
  [arbitrary: string]: any;
}

export function Control({ sx = {}, icon, label, onClick, children = [], ...props }: ControlProps) {
  console.log(icon);
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
}
