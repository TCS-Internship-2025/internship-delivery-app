import { useState } from 'react';

import { useSmallScreen } from '@/hooks/useSmallScreen';

import { useGetProfileInfo } from '@/apis/profileInfo';

import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

import { ErrorPage } from '@/pages/Error';

import { ProfilePageContent } from '@/components/ProfilePageContent';
import { ProfileSidebar } from '@/components/ProfileSidebar';
import { QueryStates } from '@/components/QueryStates';

export type ProfileSettingPages = 'profile' | 'address' | 'password';

export const ProfileInfo = () => {
  const [selectedPage, setSelectedPage] = useState<ProfileSettingPages>('profile');
  const { data: profileData, status: profileStatus } = useGetProfileInfo();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useSmallScreen();

  const closeDrawer = () => setDrawerOpen(false);
  const openDrawer = () => setDrawerOpen(true);

  if (!profileData) {
    return <ErrorPage title="Failed to load profile information." />;
  }

  return (
    <QueryStates
      state={profileStatus}
      pendingMessage="Loading profile information..."
      errorTitle="Could not fetch profile data"
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={isSmallScreen ? 1 : 2}>
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
            width: isSmallScreen ? '100%' : '65%',
            maxWidth: 10000,
            p: isSmallScreen ? 0 : 2,
            gap: isSmallScreen ? 0 : 2,
          }}
        >
          <ProfileSidebar
            selected={selectedPage}
            onSelect={setSelectedPage}
            drawerOpen={drawerOpen}
            useDrawer={isSmallScreen}
            closeDrawer={closeDrawer}
          />
          <ProfilePageContent page={selectedPage} profile={profileData} />
        </Paper>
      </Box>
    </QueryStates>
  );
};
