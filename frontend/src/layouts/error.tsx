import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function ErrorLayout() {
  const error = useRouteError();

  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      {isRouteErrorResponse(error) ? (
        <p>
          <b>{error.status}</b>: {error.statusText}
        </p>
      ) : (
        <p>Unknown Error</p>
      )}
    </div>
  );
}
