import CSRFToken from './useCSRFToken';
import userAtom from '../recoil/user';
import { useRecoilValue } from 'recoil';
import './styles.scss';

export default function Navbar() {
  const user = useRecoilValue(userAtom);

  return (
    <nav className="card navbar">
      <a href="/">LikeHome</a>
      {user ? (
        <form action="/accounts/logout/" method="post">
          <CSRFToken />
          <input type="submit" value="Logout" />
        </form>
      ) : (
        <a href={`/auth`}>Log in</a>
      )}
    </nav>
  );
}
