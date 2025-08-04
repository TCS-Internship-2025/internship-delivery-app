import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

import { useSmallScreen } from '@/hooks/useSmallScreen.ts';
import { useAuth } from '@/contexts/AuthContext.tsx';
import { useTheme } from '@/providers/ThemeProvider.tsx';

import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Navigation } from './Navigation.tsx';
import { NavItem } from './NavItem.tsx';

export const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();

  const navigate = useNavigate();
  const { mode, toggleTheme } = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const isSmallScreen = useSmallScreen();
  const location = useLocation();

  const handleLogoClick = () => {
    void navigate('/');
  };

  const handleLogout = () => {
    void logout().then(() => {
      void navigate('/login');
    });
  };

  const routes = useMemo(() => ['/', ROUTES.TRACKING, ROUTES.RECIPIENT_FORM, ROUTES.PARCELS], []); //add route's here whenever adding a new element to navbar for example: add ROUTES.PROFILE and put line 171 onClick={() => handleNavigation([the index of ROUTES.PROFILE in the array])}
  const [currentIndex, setCurrentIndex] = useState<number>(routes.indexOf(location.pathname.replace('/', '')));

  const handleDrawerClick = () => {
    setOpen(!open);
  };

  const handleNavigation = (index: number) => {
    setOpen(false);
    setCurrentIndex(index);
    void navigate(routes[index]);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        width: '100%',
        position: 'fixed',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 50,
        height: 64,
      }}
    >
      <Navigation open={open} isSmallScreen={isSmallScreen} handleDrawerClick={handleDrawerClick}>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: isSmallScreen ? '100%' : '15%' }}>
          {!isSmallScreen && (
            <ButtonBase onClick={handleLogoClick}>
              <img
                src="/image.png"
                style={{
                  height: 50,
                  width: 'auto',
                  objectFit: 'contain',
                  borderRadius: 0.5,
                }}
                alt="Logo"
              />
              <Divider variant="middle" sx={{ my: 0.1 }} />
              <Typography>SwiftParcel</Typography>
            </ButtonBase>
          )}
        </Box>
        <Box
          sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: isSmallScreen ? 'flex-start' : 'center' }}
        >
          <Box display={'flex'} flexDirection={isSmallScreen ? 'column' : 'row'} width={'100%'}>
            {isSmallScreen && (
              <NavItem
                icon={<HomeIcon />}
                label="Home"
                isActive={currentIndex === 0}
                onClick={() => handleNavigation(0)}
              />
            )}
            <NavItem
              icon={<TrackChangesIcon />}
              label="Tracking"
              isActive={currentIndex === 1}
              onClick={() => handleNavigation(1)}
            />
            <>
              <NavItem
                icon={<LocalShippingIcon />}
                label="Send Parcel"
                isActive={currentIndex === 2}
                onClick={() => handleNavigation(2)}
                disabled={isAuthenticated ? false : true}
              />
              <NavItem
                icon={<LocalShippingIcon />}
                label="My Parcels"
                isActive={currentIndex === 3}
                onClick={() => handleNavigation(3)}
                disabled={isAuthenticated ? false : true}
              />
            </>
          </Box>
        </Box>
      </Navigation>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: '2',
          width: isSmallScreen ? 'auto' : '15%',
          justifyContent: 'center',
          paddingRight: isSmallScreen ? 0 : 10,
        }}
      >
        <Tooltip title="Toggle theme" arrow>
          <IconButton size="small" color="primary" sx={{ px: 1, borderRadius: 1 }} onClick={toggleTheme}>
            {mode === 'light' ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
            {!isSmallScreen && (
              <Typography variant="caption" fontWeight={600} sx={{ ml: 1 }}>
                {mode === 'light' ? 'Light' : 'Dark'}
              </Typography>
            )}
          </IconButton>
        </Tooltip>
        {isAuthenticated && (
          <Tooltip title={'Your Profile'} arrow>
            <IconButton
              size="small"
              color="primary"
              sx={{ px: 1, borderRadius: 1 }}
              onClick={() => {
                void navigate(ROUTES.PROFILE);
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon />
                {!isSmallScreen ? (
                  <Typography variant="caption" fontWeight={600} sx={{ ml: 1 }}>
                    {user?.name}
                  </Typography>
                ) : (
                  user?.name && (
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      sx={{
                        ml: 0.5,
                        fontSize: '0.8rem',
                        color: 'text.secondary',
                        backgroundColor: 'background.paper',
                        borderRadius: '50%',
                        width: 16,
                        height: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Typography>
                  )
                )}
              </Box>
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={isAuthenticated ? 'Logout' : 'Login'} arrow>
          <IconButton
            size="small"
            color={isAuthenticated ? 'error' : 'primary'}
            sx={{ px: 1, borderRadius: 1 }}
            onClick={() => {
              if (isAuthenticated) {
                handleLogout();
              } else {
                void navigate(ROUTES.LOGIN);
              }
            }}
          >
            {isAuthenticated ? <LogoutIcon fontSize="small" /> : <ExitToAppIcon fontSize="small" />}
            {!isSmallScreen && (
              <Typography variant="caption" fontWeight={600} sx={{ ml: 1 }}>
                {isAuthenticated ? 'Logout' : 'Login'}
              </Typography>
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};
