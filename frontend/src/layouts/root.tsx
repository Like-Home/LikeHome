import { Outlet } from 'react-router-dom';
import userAtom from '../recoil/user';
import { useRecoilValue } from 'recoil';
import CSRFToken from '../components/useCSRFToken';

export default function RootLayout() {
  const user = useRecoilValue(userAtom);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <nav>
          <ul>
            <li>
              <a href={`/`}>Home</a>
            </li>
            <li>
              {user ? (
                <form action="/accounts/logout/" method="post">
                  <CSRFToken />
                  <input type="submit" value="Logout" />
                </form>
              ) : (
                <a href={`/auth`}>Authenticate Yourself</a>
              )}
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
