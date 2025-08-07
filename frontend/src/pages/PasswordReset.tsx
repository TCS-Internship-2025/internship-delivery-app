import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { usePasswordReset } from '@/hooks/usePasswordReset';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HttpsIcon from '@mui/icons-material/Https';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export const PasswordReset = () => {
  const navigate = useNavigate();
  const { form, onSubmit, isLoading, isSuccess } = usePasswordReset();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  const handleLoginClick = () => {
    void navigate('/login');
  };

  const handleFormSubmit = (e?: React.BaseSyntheticEvent) => {
    void handleSubmit(onSubmit)(e);
  };

  if (isSuccess) {
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
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              p: 6,
              textAlign: 'center',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 104, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
              Check Your Email
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              If your email is registered with us, you'll receive a password reset link shortly.
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              Don't see the email? Check your spam folder or try again.
            </Typography>

            <Button
              variant="contained"
              onClick={handleLoginClick}
              sx={{
                mt: 2,
                mb: 2,
                height: 48,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Back to Login
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

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
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            p: 6,
            textAlign: 'center',
          }}
        >
          <HttpsIcon sx={{ fontSize: 104, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
            Reset Password
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Enter your email address to receive a link to reset your password.
          </Typography>

          <Box component="form" onSubmit={handleFormSubmit} noValidate>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email Address"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ mb: 1 }}
                  autoComplete="email"
                  disabled={isLoading}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!isValid || isLoading}
              sx={{
                mt: 2,
                mb: 2,
                height: 48,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
            </Button>
          </Box>

          <Divider variant="middle" sx={{ mx: 8, my: 2 }} />
          <Box sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Remember your password?{' '}
              <Button
                variant="text"
                color="primary"
                onClick={handleLoginClick}
                sx={{ textTransform: 'none', fontWeight: 600 }}
                disabled={isLoading}
              >
                Back to login
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
