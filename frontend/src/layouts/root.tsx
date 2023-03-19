import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<Spinner />}>
        <Outlet />
      </Suspense>
    </>
  );
}
