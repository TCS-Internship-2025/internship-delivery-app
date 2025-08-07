import { useState } from 'react';

import { useSmallScreen } from '@/hooks/useSmallScreen';

import { useGetProfileInfo } from '@/apis/profileInfo';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { ProfilePageContent } from '@/components/ProfilePageContent';
import { ProfileSidebar } from '@/components/ProfileSidebar';

export type ProfileSettingPages = 'profile' | 'address' | 'password';

export const ProfileInfo = () => {
  const [selectedPage, setSelectedPage] = useState<ProfileSettingPages>('profile');
  const { data: profileData, isPending: profileLoading, isError: profileError } = useGetProfileInfo();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const isSmallScreen = useSmallScreen();

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
    <Paper sx={{ display: 'flex', justifyContent: 'center', width: '60%', alignSelf: 'center' }} elevation={2}>
      <button onClick={() => setDrawerOpen(!drawerOpen)}>sadasads</button>
      <ProfileSidebar
        selected={selectedPage}
        onSelect={setSelectedPage}
        drawerOpen={drawerOpen}
        useDrawer={isSmallScreen}
      />
      <ProfilePageContent page={selectedPage} />
    </Paper>
  );
};
