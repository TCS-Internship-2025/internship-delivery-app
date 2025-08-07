import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import type { ProfileSettingPages } from '@/pages/ProfileInfo';

import { ChangeAddressTab } from './ChangeAddressTab';
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
        return <ChangeAddressTab />;
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
