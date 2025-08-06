import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useRegisterForm } from '@/hooks/useRegisterForm';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';

import { PasswordField } from './PasswordField';

import { type RegistrationFormData } from '@/utils/authZodSchemas';

interface RegistrationFormProps {
  onLoginClick: () => void;
}

export const RegistrationForm = ({ onLoginClick }: RegistrationFormProps) => {
  const navigate = useNavigate();

  const { form, onSubmit, isLoading } = useRegisterForm({
    onSuccess: (data) => {
      if (!data.emailVerified) {
        void navigate('/verify', {
          state: {
            email: data.email,
            name: data.name,
          },
        });
      }
    },
  });
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = form;

  const password = watch('password');

  return (
    <>
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit(onSubmit)(e);
        }}
        noValidate
        sx={{ mt: 2 }}
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Full Name"
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ mb: 3 }}
              autoComplete="name"
              disabled={isLoading}
            />
          )}
        />

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
              sx={{ mb: 3 }}
              autoComplete="email"
              disabled={isLoading}
            />
          )}
        />

        <PasswordField<RegistrationFormData>
          name="password"
          label="Password"
          control={control}
          error={errors.password}
          disabled={isLoading}
          showStrengthIndicator
          value={password}
        />

        <PasswordField<RegistrationFormData>
          name="confirmPassword"
          label="Confirm Password"
          control={control}
          error={errors.confirmPassword}
          disabled={isLoading}
          value={watch('confirmPassword')}
        />

        <Button
          type="submit"
          fullWidth
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
            position: 'relative',
          }}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
          {isLoading && (
            <LinearProgress
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                borderRadius: '0 0 8px 8px',
              }}
            />
          )}
        </Button>

        <Divider variant="middle" sx={{ mx: 8 }} />
        <Box sx={{ mt: 1, alignItems: 'center', textAlign: 'center', color: 'text.secondary' }}>
          Already have an account?{' '}
          <Button
            variant="text"
            color="primary"
            onClick={onLoginClick}
            sx={{ textTransform: 'none', fontWeight: 600 }}
            disabled={isLoading}
          >
            Login here
          </Button>
        </Box>
      </Box>
    </>
  );
};
