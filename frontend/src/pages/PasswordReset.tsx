import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import HttpsIcon from '@mui/icons-material/Https';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { resetPasswordSchema, type ResetPasswordFormData } from '@/utils/authZodSchemas';

export const PasswordReset = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    console.log('Reset password request for:', data.email);
    // TODO: Implement password reset API call
    // Example: await resetPassword(data.email);
  };

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
      <Container maxWidth="sm">
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            p: 3,
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <HttpsIcon sx={{ fontSize: 104, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
              Reset Password
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Enter your email address to receive a link to reset your password.
            </Typography>

            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                void handleSubmit(onSubmit)(e);
              }}
              noValidate
            >
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
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isValid}
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
                >
                  Back to login
                </Button>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
