import { useNavigate } from 'react-router-dom';

import { useNewPassword } from '@/hooks/useNewPassword';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PasswordIcon from '@mui/icons-material/Password';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { PasswordField } from '@/components/PasswordField';

import { type NewPasswordFormData } from '@/utils/authZodSchemas';

export const NewPassword = () => {
  const navigate = useNavigate();
  const { form, onSubmit, isLoading, isSuccess, hasValidToken } = useNewPassword();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = form;

  const newPassword = watch('newPassword');

  const handleLoginClick = () => {
    void navigate('/login');
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
          <Paper elevation={3} sx={{ borderRadius: 3, p: 6, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 104, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
              Password Reset
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Your password has been successfully reset. You can now log in with your new password.
            </Typography>
            <Button
              variant="contained"
              onClick={handleLoginClick}
              sx={{ mt: 2, mb: 2, height: 48, borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
            >
              Go to Login
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (!hasValidToken) {
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
          <Paper elevation={3} sx={{ borderRadius: 3, p: 6, textAlign: 'center' }}>
            <ErrorIcon sx={{ fontSize: 104, color: 'error.main', mb: 2 }} />
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
              Invalid Reset Link
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              This password reset link is invalid or has expired. Please request a new one.
            </Typography>
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
        <Paper elevation={3} sx={{ borderRadius: 3, p: 6, textAlign: 'center' }}>
          <PasswordIcon sx={{ fontSize: 104, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
            New Password
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Please enter your new password below. Make sure it meets the security requirements.
          </Typography>

          <Box
            component="form"
            onSubmit={(e) => {
              void handleSubmit(onSubmit)(e);
            }}
            noValidate
          >
            <PasswordField<NewPasswordFormData>
              name="newPassword"
              label="New Password"
              control={control}
              error={errors.newPassword}
              showStrengthIndicator
              autoComplete="new-password"
              value={newPassword}
              disabled={isLoading}
            />
            <PasswordField<NewPasswordFormData>
              name="confirmPassword"
              label="Confirm Password"
              control={control}
              error={errors.confirmPassword}
              autoComplete="new-password"
              value={watch('confirmPassword')}
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={!isValid || isLoading}
              sx={{ mt: 2, height: 48, borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Password'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
