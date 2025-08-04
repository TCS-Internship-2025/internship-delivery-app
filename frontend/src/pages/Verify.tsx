import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

import { resendVerificationEmail } from '@/apis/authApi';

import EmailIcon from '@mui/icons-material/Email';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface LocationState {
  email?: string;
  name?: string;
}

export const Verify = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const { email, name } = state || {};

  const [cooldown, setCooldown] = useState(true);
  const [countdown, setCountdown] = useState(30);

  const { mutate: resendEmail, isPending } = useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: () => {
      enqueueSnackbar('Verification email sent successfully!', { variant: 'success' });
      setCooldown(true);
      setCountdown(30);
      const expiryTime = Date.now() + 30 * 1000;
      localStorage.setItem('cooldownExpiryTime', expiryTime.toString());
    },
    onError: (error) => {
      console.error('Failed to resend email:', error);
      enqueueSnackbar('Failed to send verification email. Please try again.', { variant: 'error' });
    },
  });

  useEffect(() => {
    // Check localStorage for existing cooldown on mount
    const cooldownExpiryTime = localStorage.getItem('cooldownExpiryTime');
    if (cooldownExpiryTime) {
      const expiryTime = parseInt(cooldownExpiryTime, 10);
      const currentTime = Date.now();

      if (expiryTime > currentTime) {
        const remainingSeconds = Math.ceil((expiryTime - currentTime) / 1000);
        setCooldown(true);
        setCountdown(remainingSeconds);
      } else {
        localStorage.removeItem('cooldownExpiryTime');
      }
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (cooldown && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCooldown(false);
      setCountdown(30);
      localStorage.removeItem('cooldownExpiryTime');
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown, countdown]);

  const handleSubmit = () => {
    if (email) {
      resendEmail(email);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
          }}
        >
          <EmailIcon color="primary" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 600 }}>
            Verify Your Email
          </Typography>
          {name && (
            <Typography variant="body1" align="center" color="text.primary" sx={{ mt: 1 }}>
              Dear {name}. We have sent an email to {email}. Please check your email for a verification link.
            </Typography>
          )}

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Didn't receive an email? Check your spam folder or request a new verification link.
          </Typography>

          <Button
            disabled={cooldown || isPending || !email}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 3 }}
          >
            {isPending ? 'Sending...' : 'Resend Email'}
          </Button>
          {cooldown && (
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Please wait {countdown} seconds before resending.
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};
