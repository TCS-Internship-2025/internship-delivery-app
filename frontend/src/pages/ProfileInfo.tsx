import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const mockParcels = [
  {
    id: '1234',
    sender: 'Alice',
    recipient: 'Bob',
    delivery: 'Express',
    tracking: 'TRACK1234',
    status: 'Delivered',
    created: new Date('2025-07-25'),
    updated: new Date('2025-07-26'),
  },
  {
    id: '5678',
    sender: 'Charlie',
    recipient: 'Dave',
    delivery: 'Standard',
    tracking: 'TRACK5678',
    status: 'In Transit',
    created: new Date('2025-07-27'),
    updated: new Date('2025-07-29'),
  },
];

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

  const name = 'Example Human';
  const email = 'example.human@example.com';

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Box sx={{ p: 4, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 28 }}>{getInitials(name)}</Avatar>
          </Grid>

          <Grid>
            <Typography variant="h5" fontWeight={600}>
              {name}
            </Typography>
            <Typography color="text.secondary">{email}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Stack direction={'row'} justifyContent={'space-between'}>
          <ProfileInfoButton onClick={() => void navigate(`/${ROUTES.PARCELS}`)}>My parcels</ProfileInfoButton>
          <ProfileInfoButton>Edit Profile</ProfileInfoButton>
        </Stack>
      </Paper>
      <Box sx={{ mx: 'auto', mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          My last 2 parcels
        </Typography>
        <Stack spacing={2}>
          {mockParcels.map((parcel) => (
            <Paper key={parcel.id} sx={{ p: 2 }} elevation={3}>
              <Typography variant="subtitle1" fontWeight={600}>
                Tracking: {parcel.tracking}
              </Typography>
              <Body2Typography>
                From: {parcel.sender} &nbsp;&nbsp; To: {parcel.recipient}
              </Body2Typography>
              <Body2Typography>Delivery: {parcel.delivery}</Body2Typography>
              <Body2Typography>Status: {parcel.status}</Body2Typography>
              <Typography variant="caption" color="text.secondary">
                Updated: {parcel.updated.toLocaleDateString()}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};
