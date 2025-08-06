import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { enqueueSnackbar } from 'notistack';

import PasswordIcon from '@mui/icons-material/Password';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { PasswordField } from '@/components/PasswordField';

import { newPasswordSchema, type NewPasswordFormData } from '@/utils/authZodSchemas';

export const NewPassword = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const onSubmit = () => {
    enqueueSnackbar('New password set successfully!', { variant: 'success' });
    // TODO: Implement new password API call

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
              e.preventDefault();
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
            />
            <PasswordField<NewPasswordFormData>
              name="confirmPassword"
              label="Confirm Password"
              control={control}
              error={errors.confirmPassword}
              autoComplete="new-password"
              value={watch('confirmPassword')}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={!isValid}
              sx={{
                mt: 2,
                height: 48,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Confirm Password
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
