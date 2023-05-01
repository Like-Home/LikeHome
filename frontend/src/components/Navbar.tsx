import { createRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import {
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Avatar,
  Button,
  ButtonProps,
  Menu,
  MenuItem,
  Stack,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import Info from '@mui/icons-material/Info';
import { Box } from '@mui/system';
import InputCSRF from '../api/csrf';
import userAtom from '../recoil/user';
import './styles.scss';
import config from '../config';
import logoSvg from '../assets/logo_dark.svg';
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
const LinkListItem = makeLink(ListItemButton);

export function PointOverview({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((value) => !value);

  return (
    <>
      {user.travel_points !== undefined && (
        <Stack direction="row" alignItems={'center'} spacing={1}>
          <Typography variant="h4">{user.travel_points}</Typography>
          <Typography variant="h6" sx={{ pt: 0.5 }}>
            points
          </Typography>
          <IconButton sx={{ mt: 1.5 }} onClick={toggleOpen}>
            <Info fontSize="small"></Info>
          </IconButton>
        </Stack>
      )}
      {/* Modal to explain how reward points work */}
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

export function AccountOverview({ user, simple = false }: { user: User; simple?: boolean }) {
  const ListItemComponent = !simple ? LinkListItem : ListItem;
  return (
    <Stack alignItems={'center'} spacing={1} sx={{ pb: 1 }}>
      {!simple ? (
        <List sx={{ pt: 0 }}>
          <ListItemComponent to="/account" sx={{ minWidth: 325 }}>
            {!simple && (
              <ListItemAvatar>
                <Avatar src={user.image || undefined} />
              </ListItemAvatar>
            )}
            <ListItemText primary={`Hi, ${user.first_name}`} secondary={user.email} />
            <Stack sx={{ ml: 1, pointerEvents: 'none' }}>
              <Chip label="Member" />
            </Stack>
          </ListItemComponent>
        </List>
      ) : (
        <Stack alignItems="center" sx={{ minWidth: 325, mb: 2, mt: 1 }}>
          <ListItemText primary={`Hi, ${user.first_name}`} />
          <ListItemText secondary={user.email} sx={{ mb: 2 }} />
          <Chip label="Member" />
        </Stack>
      )}
      <PointOverview user={user} />
    </Stack>
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
        <Stack spacing={0.5}>
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
                '&:hover': {
                  backgroundColor: theme.palette.error.main,
                },
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
      className="card card-root navbar"
      style={{
        maxWidth: config.maxWidth,
        paddingLeft: 8,
      }}
      ref={navbarEl}
    >
      <LinkButton to="/">
        <Box px={1}>
          <img
            src={logoSvg}
            alt="LikeHome logo"
            style={{
              height: '2rem',
            }}
          />
        </Box>
      </LinkButton>
      <Stack alignItems="center" direction="row" spacing={1}>
        <LinkButton to="/about">About</LinkButton>
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
