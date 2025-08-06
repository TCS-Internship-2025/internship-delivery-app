import { useNavigate } from 'react-router-dom';

import HttpsIcon from '@mui/icons-material/Https';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export const PasswordReset = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    void navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        p: 2,
      }}
    >
      <Card
        elevation={3}
        sx={{
          padding: 6,
          borderRadius: 3,
          width: '100%',
          maxWidth: 600,
          textAlign: 'center',
          justifyContent: 'center',
        }}
      >
        <HttpsIcon sx={{ fontSize: 104, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
          Reset Password
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Enter your email address to receive a link to reset your password.
        </Typography>
        <TextField fullWidth label="Email Address" type="email" sx={{ mb: 1 }} autoComplete="email" />
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{
            mt: 2,
            mb: 2,
            height: 48,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          Send Reset Link
        </Button>
        <Divider variant="middle" sx={{ mx: 8, my: 2 }} />
        <Box sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Remember your password?{' '}
            <Button
              variant="text"
              color="primary"
              onClick={handleLoginClick}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Back to login
            </Button>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};
