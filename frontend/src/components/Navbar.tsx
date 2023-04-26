import { createRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import {
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Box,
  Avatar,
  Button,
  ButtonProps,
  Menu,
  MenuItem,
  Stack,
  Typography,
  Chip,
} from '@mui/material';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { Info } from '@mui/icons-material';
import InputCSRF from '../api/csrf';
import userAtom from '../recoil/user';
import './styles.scss';
import config from '../config';
import logoSvg from '../assets/logo.svg';
import { formatCurrency } from '../utils';
import CardModal from './CardModal';
import { User } from '../api/types';

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

export function AccountOverview({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((value) => !value);

  return (
    <>
      <Stack alignItems={'center'} spacing={1} sx={{ paddingY: 2, paddingX: 4 }}>
        <Typography variant="h6">Hi {user.first_name}</Typography>
        <Typography variant="body1">{user.email}</Typography>
        <Box>
          <Chip label="Member" />
        </Box>
        {user.travel_points && (
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 'bold',
            }}
          >
            {formatCurrency(user.travel_points / 100)}
          </Typography>
        )}
        <Stack direction="row" alignItems={'center'} spacing={1}>
          <Typography variant="subtitle2">Point value</Typography>
          <IconButton onClick={toggleOpen}>
            <Info fontSize="small"></Info>
          </IconButton>
        </Stack>
      </Stack>
      {/* model to explain how reward points work */}
      <CardModal open={open} onClose={toggleOpen}>
        <CardHeader title="Reward Points" />
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="body1">
              Reward points are earned by booking hotels through LikeHome. You can use them to get discounts on future
              bookings.
            </Typography>
            <Typography variant="body1">1 point is worth {formatCurrency(0.01)}.</Typography>
            <Typography variant="body1">When spent, points are nonrefundable.</Typography>
          </Stack>
        </CardContent>
        <CardActions
          sx={{
            justifyContent: 'flex-end',
          }}
        >
          <Button onClick={toggleOpen}>Close</Button>
        </CardActions>
      </CardModal>
    </>
  );
}

function AccountMenu({ navbarEl, user }: { navbarEl: React.RefObject<HTMLElement>; user: User }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const ref = createRef<HTMLFormElement>();

  return (
    <>
      <IconButton
        onClick={() => {
          setAnchorEl(navbarEl.current);
        }}
        sx={{ p: 0.5 }}
        size="large"
      >
        <Avatar src={user.image || undefined} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <Stack spacing={1}>
          <AccountOverview user={user} />
          <Divider />
          <LinkMenuItem to="/bookings">My Bookings</LinkMenuItem>
          <LinkMenuItem to="/rewards">Rewards</LinkMenuItem>
          <LinkMenuItem to="/account">Account</LinkMenuItem>
          <Divider />
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
        </Stack>
      </Menu>
    </>
  );
}

export default function Navbar() {
  const user = useRecoilValue(userAtom);
  const navbarEl = createRef<HTMLElement>();

  return (
    <nav
      className="card navbar"
      style={{
        maxWidth: config.maxWidth,
      }}
      ref={navbarEl}
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
      <Stack alignItems="center" direction="row" spacing={1}>
        <LinkButton to="/about">About Us</LinkButton>
        <LinkButton to="/hotels">Hotels</LinkButton>
        {user ? (
          <AccountMenu user={user} navbarEl={navbarEl} />
        ) : (
          <form action="/accounts/google/login/?process=login" method="post">
            <InputCSRF />
            <Button variant="contained" type="submit">
              Log in
            </Button>
          </form>
        )}
      </Stack>
    </nav>
  );
}
