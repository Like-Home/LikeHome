import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Navbar from '../components/Navbar';
import Foorter from '../components/Footer';
import Spinner from '../components/Spinner';
import config from '../config';

const Loading = () => (
  <div className="card">
    <Spinner />
  </div>
);

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <div
        style={{
          maxWidth: config.maxWidth,
          margin: 'auto',
        }}
      >
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
        <Foorter />
      </div>
    </>
  );
}
