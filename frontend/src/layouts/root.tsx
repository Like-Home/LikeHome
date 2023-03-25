import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';

const Loading = () => (
  <div className="card" style={{ maxWidth: 900, marginTop: 100, margin: 'auto' }}>
    <Spinner />
  </div>
);

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </>
  );
}
