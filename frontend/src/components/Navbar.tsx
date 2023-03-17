import CSRFToken from './useCSRFToken';
import userAtom from '../recoil/user';
import { useRecoilValue } from 'recoil';
import { Link } from 'react-router-dom';
import './styles.scss';

export default function Navbar() {
  const user = useRecoilValue(userAtom);

  return (
    <nav className="card navbar">
      <Link to="/">Home</Link>
      {user ? (
        <form action="/accounts/logout/" method="post">
          <CSRFToken />
          <input type="submit" value="Logout" />
        </form>
      ) : (
        <Link to="/auth">Log in</Link>
      )}
    </nav>
  );
}
