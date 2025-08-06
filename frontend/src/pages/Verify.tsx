import { useLocation } from 'react-router-dom';

import { useResendEmail } from '@/hooks/useResendEmail';

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

  const { resendEmail, isPending, cooldown, countdown } = useResendEmail();

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
