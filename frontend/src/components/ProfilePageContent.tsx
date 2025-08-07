import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import type { ProfileSettingPages } from '@/pages/ProfileInfo';

import { ChangePasswordTab } from './ChangePasswordTab';
import { ChangeProfileTab } from './ChangeProfileTab';

interface ProfilePageContentProps {
  page: ProfileSettingPages;
}

export const ProfilePageContent = ({ page }: ProfilePageContentProps) => {
  const renderPage = () => {
    switch (page) {
      case 'profile':
        return <ChangeProfileTab />;
      case 'address':
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
      case 'password':
        return <ChangePasswordTab />;
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
