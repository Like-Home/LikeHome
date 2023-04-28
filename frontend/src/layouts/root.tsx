import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RootAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
