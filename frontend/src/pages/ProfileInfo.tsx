import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHANGE_MODAL_TYPES, ROUTES } from '@/constants';

import { useGetAllParcels } from '@/apis/parcelGet';
import { useGetProfileInfo } from '@/apis/profileInfo';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ChangeAddressModal from '@/components/ChangeAddressModal';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import ChangeProfileModal from '@/components/ChangeProfileModal';
import DeleteUserButton from '@/components/DeleteUserButton';
import { QueryStates } from '@/components/QueryStates';

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

export const ProfileInfo = () => {
  const navigate = useNavigate();

  const { data: parcels, status: parcelsStatus } = useGetAllParcels();
  const { data: profileData, status: profileStatus } = useGetProfileInfo();
  const [openModal, setOpenModal] = useState<string | null>(null);

  const profile = profileData;

  const getFirstThreeInitials = (fullName: string | undefined) => {
    if (fullName)
      return fullName
        .split(' ')
        .slice(0, 3)
        .map((word) => word[0])
        .join('')
        .toUpperCase();
  };

  const firstTwoParcels = parcels?.slice(0, 2) ?? [];

  const handleOpen = (identifier: string) => {
    setOpenModal(identifier);
  };
  const handleClose = () => {
    setOpenModal(null);
  };

  return (
    <QueryStates state={profileStatus} errorTitle="Failed to load profile information">
      <Box sx={{ p: 4, mx: 'auto' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 28 }}>
                {getFirstThreeInitials(profile?.name)}
              </Avatar>
            </Grid>

            <Grid>
              <Typography variant="h5" fontWeight={600}>
                {profile?.name}
              </Typography>
              <Typography color="text.secondary">{profile?.email}</Typography>
            </Grid>
          </Grid>
          
        <Divider sx={{ my: 3 }} />
        <Stack direction={'column'} spacing={2}>
          <ProfileInfoButton onClick={() => void navigate(`/${ROUTES.PARCELS}`)}>My parcels</ProfileInfoButton>
          <ProfileInfoButton
            onClick={() => {
              handleOpen(CHANGE_MODAL_TYPES.CHANGE_PASSWORD);
            }}
          >
            Edit password
          </ProfileInfoButton>
          <ProfileInfoButton
            onClick={() => {
              handleOpen(CHANGE_MODAL_TYPES.CHANGE_ADDRESS);
            }}
          >
            Edit address
          </ProfileInfoButton>
          <ProfileInfoButton
            onClick={() => {
              handleOpen(CHANGE_MODAL_TYPES.CHANGE_PROFILE);
            }}
          >
            Edit user info
          </ProfileInfoButton>
          <DeleteUserButton showDangerZone={false} buttonVariant="contained" buttonColor="error" />
        </Stack>
        <ChangeProfileModal
          open={openModal === CHANGE_MODAL_TYPES.CHANGE_PROFILE}
          handleClose={handleClose}
          formData={{ name: profile.name, email: profile.email, phoneNumber: profile.phone?.toString() }}
        />
        <ChangePasswordModal open={openModal === CHANGE_MODAL_TYPES.CHANGE_PASSWORD} handleClose={handleClose} />
        <ChangeAddressModal open={openModal === CHANGE_MODAL_TYPES.CHANGE_ADDRESS} handleClose={handleClose} />
      </Paper>

        <Box sx={{ mx: 'auto', mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            My last 2 packages
          </Typography>

          {(() => {
            return (
              <QueryStates state={parcelsStatus} errorTitle="Failed to load parcels">
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
              </QueryStates>
            );
          })()}
        </Box>
      </Box>
    </QueryStates>
  );
};
