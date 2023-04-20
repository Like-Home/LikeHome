import { createRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, ButtonProps, Menu, MenuItem, Stack } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import InputCSRF from '../api/csrf';
import userAtom from '../recoil/user';
import './styles.scss';
import config from '../config';
import logoSvg from '../assets/logo.svg';

function NavButton(props?: ButtonProps) {
  return <Button variant="text" sx={{ color: '#9b99ff' }} {...props} />;
}

type ComponentType = React.ComponentType<{ onClick: () => void; children: React.ReactNode }>;

const makeLink = (Component: ComponentType) => {
  const Link = ({ to, children, ...props }: { to: string; children: React.ReactNode }) => {
    const navigate = useNavigate();
    return (
      <Component onClick={() => navigate(to)} {...props}>
        {children}
      </Component>
    );
  };
  return Link;
};

const LinkButton = makeLink(NavButton);
const LinkMenuItem = makeLink(MenuItem);

function AccountMenu() {
  const theme = useTheme();
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
        <LinkMenuItem to="/rewards">Rewards</LinkMenuItem>
        <LinkMenuItem to="/me">Account</LinkMenuItem>
        <form ref={ref} action="/accounts/logout/" method="post">
          <InputCSRF />
          <MenuItem
            sx={{
              backgroundColor: theme.palette.error.main,
            }}
            onClick={() => ref.current && ref.current.submit()}
          >
            Log out
          </MenuItem>
        </form>
      </Menu>
    </>
  );
}

export default function Navbar() {
  const user = useRecoilValue(userAtom);

  return (
    <nav
      className="card navbar"
      style={{
        maxWidth: config.maxWidth,
      }}
    >
      <Stack alignItems="center" direction="row" spacing={1}>
        <img
          src={logoSvg}
          alt="Logo"
          style={{
            height: '2rem',
          }}
        />
        <LinkButton to="/">LikeHome</LinkButton>
      </Stack>
      <div className="right">
        <LinkButton to="/about">About Us</LinkButton>
        <LinkButton to="/hotels">Hotels</LinkButton>
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
      </div>
    </nav>
  );
}
