import React from 'react';

import { Modal, Card, SxProps, ModalProps, Theme } from '@mui/material';

const style: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '600px',
  boxSizing: 'border-box',
  width: 'calc(100% - 4em)', // simulate margin
  '&:focus': {
    outline: 'none',
  },
};
function CardModal({
  children,
  cardSx = {},
  ...props
}: { children: React.ReactNode; cardSx?: SxProps<Theme> } & Omit<ModalProps, 'children'>) {
  return (
    <Modal {...props}>
      <Card sx={[style, ...(Array.isArray(cardSx) ? cardSx : [cardSx])]}>{children}</Card>
    </Modal>
  );
}

export default CardModal;
