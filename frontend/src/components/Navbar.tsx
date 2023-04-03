import { createRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { Avatar, Button, ButtonProps, Menu, MenuItem } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import InputCSRF from '../api/csrf';
import userAtom from '../recoil/user';
import './styles.scss';

function NavButton(props?: ButtonProps) {
  return <Button variant="text" sx={{ color: '#9b99ff' }} {...props} />;
}

type ComponentType = React.ComponentType<{ onClick: () => void; children: React.ReactNode }>;

const makeLink = (Component: ComponentType) => {
  const Link = ({ to, children }: { to: string; children: React.ReactNode }) => {
    const navigate = useNavigate();
    return <Component onClick={() => navigate(to)}>{children}</Component>;
  };
  return Link;
};

const LinkButton = makeLink(NavButton);
const LinkMenuItem = makeLink(MenuItem);

function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const ref = createRef<HTMLFormElement>();

  return (
    <>
      <IconButton
        onClick={(e: Event | React.SyntheticEvent) => setAnchorEl(e.target as HTMLElement)}
        sx={{ p: 0.5 }}
        size="large"
      >
        <Avatar />
      </IconButton>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        <LinkMenuItem to="/bookings">My Bookings</LinkMenuItem>
        <form ref={ref} action="/accounts/logout/" method="post">
          <InputCSRF />
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
          <InputCSRF />
          <Button variant="contained" type="submit">
            Log in
          </Button>
        </form>
      )}
    </nav>
  );
}
