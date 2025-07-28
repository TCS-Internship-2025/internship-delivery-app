import LoginIcon from '@mui/icons-material/Login';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const LoginHeader = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
      }}
    >
      <LoginIcon sx={{ color: 'white', fontSize: 24 }} />
    </Box>
    <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
      Welcome Back
    </Typography>
    <Typography variant="body2" color="text.secondary" textAlign="center">
      Sign in to your account to continue
    </Typography>
  </Box>
);
