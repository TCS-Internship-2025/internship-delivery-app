import type { Profile } from '@/apis/profileInfo';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import type { ProfileSettingPages } from '@/pages/ProfileInfo';

import { ChangeAddressTab } from './ChangeAddressTab';
import { ChangePasswordTab } from './ChangePasswordTab';
import { ChangeProfileTab } from './ChangeProfileTab';

interface ProfilePageContentProps {
  page: ProfileSettingPages;
  profile: Profile;
}

export const ProfilePageContent = ({ page, profile }: ProfilePageContentProps) => {
  const renderPage = () => {
    switch (page) {
      case 'profile':
        return <ChangeProfileTab profile={profile} />;
      case 'address':
        return <ChangeAddressTab profile={profile} />;
      case 'password':
        return <ChangePasswordTab />;
      default:
        return <Typography>Page not found</Typography>;
    }
  };

  return (
    <Box flex={1} p={4} flexDirection={'column'}>
      {renderPage()}
    </Box>
  );
};
