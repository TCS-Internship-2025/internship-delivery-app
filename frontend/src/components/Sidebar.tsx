import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

import { useTheme } from '@/providers/ThemeProvider.tsx';

import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LogoutIcon from '@mui/icons-material/Logout';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { NavItem } from './NavItem.tsx';

const SIDEBAR_WIDTH = 240;

export const Sidebar = () => {
  const isAuthenticated = false; // Force it for testing

  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState(0);
  const handleLogoClick = () => {
    void navigate('/');
  };

  const tabIndexToRoute = [
    `/${ROUTES.TRACKING}`,
    ...(isAuthenticated ? [`/${ROUTES.SEND_PARCEL}`, `/${ROUTES.PARCELS}`] : []),
  ];

  useEffect(() => {
    const routeToTabIndex: Record<string, number> = {
      [`/${ROUTES.TRACKING}`]: 0,
      [`/${ROUTES.SEND_PARCEL}`]: 1,
      [`/${ROUTES.PARCELS}`]: 2,
    };
    const currentTabIndex = routeToTabIndex[location.pathname] ?? 0;
    setActiveTab(currentTabIndex);
  }, [location.pathname]);

  const handleNavigation = (index: number) => {
    setActiveTab(index);
    void navigate(tabIndexToRoute[index]);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        width: SIDEBAR_WIDTH,
        height: '100%',
        flexShrink: 0,
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 1, flex: 1 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ButtonBase onClick={handleLogoClick}>
            <img
              src="/logo.jpg"
              style={{
                height: '125px',
                width: 'auto',
                objectFit: 'contain',
                borderRadius: '0.5em',
              }}
              alt="Logo"
            />
          </ButtonBase>
        </Box>

        <Divider variant="middle" sx={{ my: 1 }} />

        <Box>
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
      </Box>

      <Divider variant="middle" sx={{ mb: 1 }} />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tooltip title="Toggle theme" arrow>
            <IconButton size="small" color="primary" sx={{ px: 1, borderRadius: 1 }} onClick={toggleTheme}>
              {mode === 'light' ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
              <Typography variant="caption" fontWeight={600} sx={{ ml: 1 }}>
                {mode === 'light' ? 'Light' : 'Dark'}
              </Typography>
            </IconButton>
          </Tooltip>
          <Tooltip title={isAuthenticated ? 'Logout' : 'Login'} arrow>
            <IconButton
              size="small"
              color={isAuthenticated ? 'error' : 'primary'}
              sx={{ px: 1, borderRadius: 1 }}
              onClick={() => {
                if (isAuthenticated) {
                  // Optional: Add logout logic here
                  void navigate('/login');
                } else {
                  void navigate('/login');
                }
              }}
            >
              {isAuthenticated ? <LogoutIcon fontSize="small" /> : <ExitToAppIcon fontSize="small" />}
              <Typography variant="caption" fontWeight={600} sx={{ ml: 1 }}>
                {isAuthenticated ? 'Logout' : 'Login'}
              </Typography>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};
