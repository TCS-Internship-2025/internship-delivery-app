import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export const ProfileInfo = () => {
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
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
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
          <Button variant="contained" color="primary">
            My parcels
          </Button>
          <Button variant="contained" color="primary">
            Edit Profile
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
