import { useState } from 'react';

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
      <ProfileSidebar selected={selectedPage} onSelect={setSelectedPage} />
      <ProfilePageContent page={selectedPage} />
    </Paper>
  );
};
