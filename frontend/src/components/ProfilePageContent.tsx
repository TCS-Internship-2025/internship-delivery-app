import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import type { ProfileSettingPages } from '@/pages/ProfileInfo';

interface ProfilePageContentProps {
  page: ProfileSettingPages;
}

export const ProfilePageContent = ({ page }: ProfilePageContentProps) => {
  const renderPage = () => {
    switch (page) {
      case 'profile':
        return (
          <>
            <Typography variant="h5" gutterBottom>
              Profile Settings
            </Typography>
            <TextField label="Name" fullWidth margin="normal" />
            <TextField label="Bio" fullWidth margin="normal" multiline />
            <Button variant="contained">Save</Button>
          </>
        );
      case 'account':
        return (
          <>
            <Typography variant="h5" gutterBottom>
              Account Settings
            </Typography>
            <TextField label="Email" fullWidth margin="normal" />
            <TextField label="Password" type="password" fullWidth margin="normal" />
            <Button variant="contained">Update</Button>
          </>
        );
      case 'notifications':
        return (
          <>
            <Typography variant="h5" gutterBottom>
              Notification Preferences
            </Typography>
            <Typography variant="body1">Coming soon...</Typography>
          </>
        );
      default:
        return <Typography>Page not found</Typography>;
    }
  };

  return (
    <Box flex={1} p={4}>
      {renderPage()}
    </Box>
  );
};
