import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import type { ProfileSettingPages } from '@/pages/ProfileInfo';

const pages: ProfileSettingPages[] = ['profile', 'address', 'password'];

interface ProfileSidebarProps {
  selected: ProfileSettingPages;
  onSelect: (page: ProfileSettingPages) => void;
}
export const ProfileSidebar = ({ selected, onSelect }: ProfileSidebarProps) => {
  return (
    <Paper sx={{ width: 220, height: '88vh', p: 2 }} elevation={3}>
      <Typography variant="h6" mb={2}>
        Profile Settings
      </Typography>
      <List>
        {pages.map((page) => (
          <ListItemButton key={page} selected={selected === page} onClick={() => onSelect(page)}>
            <ListItemText primary={page.charAt(0).toUpperCase() + page.slice(1)} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};
