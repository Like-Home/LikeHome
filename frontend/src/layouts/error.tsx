import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ErrorLayout() {
  const error = useRouteError();

  console.error(error);

  return (
    <>
      <Navbar />
      <div id="error-page" className="card">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        {isRouteErrorResponse(error) ? (
          <h2 style={{ fontWeight: 'normal' }}>
            <b>{error.status}</b> {error.statusText}
          </h2>
        ) : (
          <p>Unknown Error</p>
        )}
      </div>
    </>
  );
}
