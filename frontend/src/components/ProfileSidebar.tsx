import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import type { ProfileSettingPages } from '@/pages/ProfileInfo';

import DeleteUserButton from './DeleteUserButton';

const pages: ProfileSettingPages[] = ['profile', 'address', 'password'];

interface ProfileSidebarProps {
  selected: ProfileSettingPages;
  onSelect: (page: ProfileSettingPages) => void;
  drawerOpen: boolean;
  useDrawer?: boolean;
}

export const ProfileSidebar = ({ selected, onSelect, drawerOpen, useDrawer = false }: ProfileSidebarProps) => {
  const sidebarContent = (
    <Paper
      elevation={3}
      sx={{
        width: 220,
        height: '88vh',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="h6" mb={2}>
        Profile Settings
      </Typography>

      <List sx={{ flexGrow: 1 }}>
        {pages.map((page) => (
          <ListItemButton key={page} selected={selected === page} onClick={() => onSelect(page)}>
            <ListItemText primary={page.charAt(0).toUpperCase() + page.slice(1)} />
          </ListItemButton>
        ))}
      </List>

      <DeleteUserButton showDangerZone={false} />
    </Paper>
  );

  return useDrawer ? (
    <Drawer open={drawerOpen} onClose={() => onSelect(selected)}>
      {sidebarContent}
    </Drawer>
  ) : (
    sidebarContent
  );
};
