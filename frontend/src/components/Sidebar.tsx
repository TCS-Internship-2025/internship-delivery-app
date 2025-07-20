import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

import { useTheme } from '@/providers/ThemeProvider.tsx';

import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { NavItem } from './NavItem.tsx';

const SIDEBAR_WIDTH = 240;

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState(0);

  const tabIndexToRoute = ['/', `/${ROUTES.PAGE1}`, `/${ROUTES.PAGE2}`, `/${ROUTES.PAGE3}`, `/${ROUTES.PAGE4}`];

  useEffect(() => {
    const routeToTabIndex: Record<string, number> = {
      '/': 0,
      [`/${ROUTES.PAGE1}`]: 1,
      [`/${ROUTES.PAGE2}`]: 2,
      [`/${ROUTES.PAGE3}`]: 3,
      [`/${ROUTES.PAGE4}`]: 4,
      [`/${ROUTES.PAGE5}/${ROUTES.SUCCESS}`]: 5,
      [`/${ROUTES.PAGE5}/${ROUTES.ERROR}`]: 6,
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
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <img
            src="/favicon.jpg"
            style={{
              height: '100px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </Box>

        <Divider variant="middle" sx={{ my: 1 }} />

        <Box>
          <NavItem
            icon={<QuestionMarkIcon />}
            label="Page 0"
            isActive={activeTab === 0}
            onClick={() => handleNavigation(0)}
          />

          <Divider variant="middle" sx={{ my: 1 }} />

          <NavItem
            icon={<QuestionMarkIcon />}
            label="Page 1"
            isActive={activeTab === 1}
            onClick={() => handleNavigation(1)}
          />
          <NavItem
            icon={<QuestionMarkIcon />}
            label="Page 2"
            isActive={activeTab === 2}
            onClick={() => handleNavigation(2)}
          />
          <NavItem
            icon={<QuestionMarkIcon />}
            label="Page 3"
            isActive={activeTab === 3}
            onClick={() => handleNavigation(3)}
          />
          <NavItem
            icon={<QuestionMarkIcon />}
            label="Page 4"
            isActive={[4, 5, 6].includes(activeTab)}
            onClick={() => handleNavigation(4)}
          />
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

          <Tooltip title="Logout" arrow>
            <IconButton
              size="small"
              color="error"
              sx={{ px: 1, borderRadius: 1 }}
              onClick={() => console.log('Logout')}
            >
              <ExitToAppIcon fontSize="small" />
              <Typography variant="caption" fontWeight={600} sx={{ ml: 1 }}>
                Logout
              </Typography>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};
