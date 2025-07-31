import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

import { useSmallScreen } from '@/hooks/useSmallScreen.ts';
import { useAuth } from '@/contexts/AuthContext.tsx';
import { useTheme } from '@/providers/ThemeProvider.tsx';

import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
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

import DrawerComponent from './DrawerComponent.tsx';
import { NavItem } from './NavItem.tsx';

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const isSmallScreen = useSmallScreen();

  const handleLogoClick = () => {
    void navigate('/');
  };
  const handleLogout = () => {
    void logout().then(() => {
      void navigate('/login');
    });
  };

  const routes = useMemo(() => ['/', ROUTES.TRACKING, ROUTES.RECIPIENT_FORM, ROUTES.PARCELS], []);

  const currentIndex = routes.indexOf(location.pathname);
  const activeTab = currentIndex !== -1 ? currentIndex : 0;

  const handleDrawerClick = () => {
    setOpen(!open);
  };

  const handleNavigation = (index: number) => {
    setOpen(false);
    void navigate(routes[index]);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        width: '100%',
        position: 'fixed',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 50,
        height: 64,
      }}
    >
      {!isSmallScreen ? (
        <>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '15%' }}>
            <ButtonBase onClick={handleLogoClick}>
              <img
                src="/logo.jpg"
                style={{
                  height: 50,
                  width: 'auto',
                  objectFit: 'contain',
                  borderRadius: 0.5,
                }}
                alt="Logo"
              />
            </ButtonBase>
            <Divider variant="middle" sx={{ my: 0.1 }} />
            <Typography>SwiftParcel</Typography>
          </Box>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box display={'flex'} flexDirection={'row'}>
              <NavItem
                icon={<TrackChangesIcon />}
                label="Tracking"
                isActive={activeTab === 1}
                onClick={() => handleNavigation(1)}
              />
              {isAuthenticated && (
                <>
                  <NavItem
                    icon={<LocalShippingIcon />}
                    label="Send Parcel"
                    isActive={activeTab === 2}
                    onClick={() => handleNavigation(2)}
                  />
                  <NavItem
                    icon={<LocalShippingIcon />}
                    label="My Parcels"
                    isActive={activeTab === 3}
                    onClick={() => handleNavigation(3)}
                  />
                </>
              )}
            </Box>
          </Box>
        </>
      ) : (
        <DrawerComponent
          handleDrawerClick={() => {
            handleDrawerClick();
          }}
          open={open}
        >
          <Box display={'flex'} flexDirection={'column'}>
            <NavItem
              icon={<TrackChangesIcon />}
              label="Tracking"
              isActive={activeTab === 0}
              onClick={() => handleNavigation(0)}
            />
            {isAuthenticated && (
              <>
                <NavItem
                  icon={<LocalShippingIcon />}
                  label="Send Parcel"
                  isActive={activeTab === 1}
                  onClick={() => handleNavigation(1)}
                />
                <NavItem
                  icon={<LocalShippingIcon />}
                  label="My Parcels"
                  isActive={activeTab === 2}
                  onClick={() => handleNavigation(2)}
                />
              </>
            )}
          </Box>
        </DrawerComponent>
      )}
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
                console.log('xd');
              }}
            >
              <PersonIcon />
              {!isSmallScreen && (
                <Typography variant="caption" fontWeight={600} sx={{ ml: 1 }}>
                  Profile
                </Typography>
              )}
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={isAuthenticated ? 'Logout' : 'Login'} arrow>
          <IconButton size="small" color="error" sx={{ px: 1, borderRadius: 1 }} onClick={handleLogout}>
            {isAuthenticated ? <LogoutIcon fontSize="small" /> : <ExitToAppIcon fontSize="small" />}
            {!isSmallScreen && (
              <Typography variant="caption" fontWeight={600} sx={{ ml: 1 }}>
                Logout
              </Typography>
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};
