import React from 'react';
import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import config from '../config';

export default function RootAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      style={{
        maxWidth: config.maxWidth,
        margin: 'auto',
      }}
    >
      <Navbar />
      {children}
      <Footer />
    </Box>
  );
}
