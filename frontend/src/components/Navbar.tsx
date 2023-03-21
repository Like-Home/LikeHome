import { createRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Avatar, Button, ButtonProps, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import CSRFToken from './useCSRFToken';
import userAtom from '../recoil/user';
import './styles.scss';

function NavButton(props?: ButtonProps) {
  return <Button variant="text" sx={{ color: '#9b99ff' }} {...props} />;
}

const makeLink = (Component: any) =>
  function Link({ to, children }: { to: string; children?: any }) {
    const navigate = useNavigate();
    return <Component onClick={() => navigate(to)}>{children}</Component>;
  };

const LinkButton = makeLink(NavButton);
const LinkMenuItem = makeLink(MenuItem);

function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const ref = createRef<HTMLFormElement>();

  return (
    <>
      <IconButton onClick={(e: any) => setAnchorEl(e.target)} sx={{ p: 0.5 }} size="large">
        <Avatar />
      </IconButton>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        <LinkMenuItem to="/bookings">My Bookings</LinkMenuItem>
        <form ref={ref} action="/accounts/logout/" method="post">
          <CSRFToken />
          <MenuItem onClick={() => ref.current && ref.current.submit()}>Log out</MenuItem>
        </form>
      </Menu>
    </>
  );
}

export default function Navbar() {
  const user = useRecoilValue(userAtom);

  return (
    <nav className="card navbar">
      <LinkButton to="/">Home</LinkButton>
      {user ? (
        <AccountMenu />
      ) : (
        <form action="/accounts/google/login/?process=login" method="post">
          <CSRFToken />
          <Button variant="contained" type="submit">
            Log in
          </Button>
        </form>
      )}
    </nav>
  );
}
