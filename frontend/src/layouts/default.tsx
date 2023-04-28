import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Spinner from '../components/Spinner';
import RootLayout from './root';

const Loading = () => (
  <div className="card card-root">
    <Spinner />
  </div>
);

export default function DefaultRouterLayout() {
  return (
    <RootLayout>
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </RootLayout>
  );
}
