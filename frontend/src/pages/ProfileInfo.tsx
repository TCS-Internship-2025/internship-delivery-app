import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

import { useGetAllParcels } from '@/apis/parcelGet';
import { useGetProfileInfo } from '@/apis/profileInfo';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ChangeAddressModal from '@/components/ChangeAddressModal';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import ChangeProfileModal from '@/components/ChangeProfileModal';
import DeleteUserButton from '@/components/DeleteUserButton';

const ProfileInfoButton = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
  return (
    <Button variant="contained" color="primary" onClick={onClick}>
      {children}
    </Button>
  );
};

const Body2Typography = ({ children }: { children: React.ReactNode }) => {
  return <Typography variant="body2">{children}</Typography>;
};
type ModalType = 'changeProfile' | 'changePassword' | 'changeAddress';

export const ProfileInfo = () => {
  const navigate = useNavigate();

  const { data: parcels, isPending: parcelsLoading, isError: parcelsError } = useGetAllParcels();
  const { data: profileData, isPending: profileLoading, isError: profileError } = useGetProfileInfo();
  const [openModal, setOpenModal] = useState<ModalType | null>(null);
  const profile = profileData;

  const getFirstThreeInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .slice(0, 3)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  const firstTwoParcels = parcels?.slice(0, 2) ?? [];

  const handleOpen = (identifier: ModalType) => {
    setOpenModal(identifier);
  };
  const handleClose = () => {
    setOpenModal(null);
  };
  if (profileLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (profileError || !profile) {
    return (
      <Typography color="error" align="center">
        Failed to load profile information.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 4, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 28 }}>
              {getFirstThreeInitials(profile.name)}
            </Avatar>
          </Grid>

          <Grid>
            <Typography variant="h5" fontWeight={600}>
              {profile.name}
            </Typography>
            <Typography color="text.secondary">{profile.email}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
        <Stack direction={'column'} spacing={2}>
          <ProfileInfoButton onClick={() => void navigate(`/${ROUTES.PARCELS}`)}>My parcels</ProfileInfoButton>
          <ProfileInfoButton
            onClick={() => {
              handleOpen('changePassword');
            }}
          >
            Edit password
          </ProfileInfoButton>
          <ProfileInfoButton
            onClick={() => {
              handleOpen('changeAddress');
            }}
          >
            Edit address
          </ProfileInfoButton>
          <ProfileInfoButton
            onClick={() => {
              handleOpen('changeProfile');
            }}
          >
            Edit user info
          </ProfileInfoButton>
          <DeleteUserButton showDangerZone={false} buttonVariant="contained" buttonColor="error" />
        </Stack>
        <ChangeProfileModal
          open={openModal === 'changeProfile'}
          handleClose={handleClose}
          formData={{ name: profile.name, email: profile.email, phoneNumber: profile.phone?.toString() }}
        />
        <ChangePasswordModal open={openModal === 'changePassword'} handleClose={handleClose} />
        <ChangeAddressModal open={openModal === 'changeAddress'} handleClose={handleClose} />
      </Paper>

      <Box sx={{ mx: 'auto', mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          My last 2 packages
        </Typography>

        {(() => {
          if (parcelsLoading) {
            return (
              <Box display="flex" justifyContent="center" alignItems="center" height={100}>
                <CircularProgress />
              </Box>
            );
          }
          if (parcelsError) {
            return <Typography color="error">Failed to load parcels.</Typography>;
          }
          return (
            <Stack spacing={2}>
              {firstTwoParcels?.map((parcel) => (
                <Paper key={parcel.id} sx={{ p: 2 }} elevation={3}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Tracking: {parcel.trackingCode}
                  </Typography>
                  <Body2Typography>To: {parcel.recipient.name}</Body2Typography>
                  <Body2Typography>Delivery: {parcel.deliveryType}</Body2Typography>
                  <Body2Typography>Status: {parcel.currentStatus}</Body2Typography>
                  <Typography variant="caption" color="text.secondary">
                    Updated: {new Date(parcel.updatedAt).toLocaleDateString()}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          );
        })()}
      </Box>
    </Box>
  );
};
