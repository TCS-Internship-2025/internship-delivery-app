import { useState } from 'react';

import { useSmallScreen } from '@/hooks/useSmallScreen';

import { useGetProfileInfo } from '@/apis/profileInfo';

import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { ProfilePageContent } from '@/components/ProfilePageContent';
import { ProfileSidebar } from '@/components/ProfileSidebar';

export type ProfileSettingPages = 'profile' | 'address' | 'password';

export const ProfileInfo = () => {
  const [selectedPage, setSelectedPage] = useState<ProfileSettingPages>('profile');
  const { data: profileData, isPending: profileLoading, isError: profileError } = useGetProfileInfo();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useSmallScreen();

  const closeDrawer = () => setDrawerOpen(false);
  const openDrawer = () => setDrawerOpen(true);

  if (profileLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (profileError || !profileData) {
    return <Typography color="error">Failed to load profile information.</Typography>;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} width="100%" px={2} py={3}>
      {isSmallScreen && (
        <Button
          variant="outlined"
          startIcon={<MenuIcon />}
          onClick={openDrawer}
          sx={{
            alignSelf: 'flex-start',
            ml: 1,
          }}
        >
          Profile Menu
        </Button>
      )}

      <Paper
        elevation={2}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: isSmallScreen ? '100%' : '60%',
          maxWidth: 900,
          p: 2,
          gap: 2,
        }}
      >
        <ProfileSidebar
          selected={selectedPage}
          onSelect={setSelectedPage}
          drawerOpen={drawerOpen}
          useDrawer={isSmallScreen}
          closeDrawer={closeDrawer}
        />
        <ProfilePageContent page={selectedPage} />
      </Paper>
    </Box>
  );
};
