import { InputBase, Paper, PaperProps, InputBaseProps, Theme, SxProps } from '@mui/material';

function Control({ sx = {}, ...props }: PaperProps) {
  return (
    <Paper
      sx={{
        background: '#494747',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.25)',
        borderRadius: '6px',
        ...sx,
      }}
      {...props}
    />
  );
}

export interface TextInputProps extends InputBaseProps {
  label?: string;
}

export default function TextInput({ sx = {}, label, ...props }: TextInputProps) {
  return (
    <Control sx={{ p: 1, px: 1.5, display: 'flex', flexDirection: 'column', width: 400, height: 50 }}>
      <label style={{ fontSize: 12, opacity: 0.75, lineHeight: 0.5, marginTop: 4 }}>{label ?? ''}</label>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <InputBase sx={{ flex: 1, ...sx }} {...props} />
      </div>
    </Control>
  );
}
