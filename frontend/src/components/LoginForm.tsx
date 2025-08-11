import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useLoginForm } from '../hooks/useLoginForm';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

interface LoginFormProps {
  onRegisterClick: () => void;
  onForgotPasswordClick?: () => void;
}

export const LoginForm = ({ onRegisterClick, onForgotPasswordClick }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { form, onSubmit, isLoading } = useLoginForm();
  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = form;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit(onSubmit)(e);
        }}
        sx={{ mt: 2 }}
      >
        {errors.root && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.root.message}
          </Alert>
        )}

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label="Email Address"
              type="email"
              error={!!error}
              helperText={error?.message}
              sx={{ mb: 3 }}
              autoComplete="email"
              autoFocus
              disabled={isLoading}
              slotProps={{
                input: {
                  style: { WebkitBoxShadow: 'none !important' },
                },
              }}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              error={!!error}
              helperText={error?.message}
              sx={{ mb: 1 }}
              autoComplete="current-password"
              disabled={isLoading}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />

        <Box sx={{ textAlign: 'left' }}>
          <Button
            variant="text"
            size="small"
            onClick={onForgotPasswordClick}
            sx={{
              textTransform: 'none',
              fontSize: '0.875rem',
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
              },
            }}
            disabled={isLoading}
          >
            Forgot password?
          </Button>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={!isValid}
          sx={{
            mt: 1,
            mb: 2,
            height: 48,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>

        <Divider variant="middle" sx={{ mx: 8 }} />
        <Box sx={{ mt: 1, mb: 2, textAlign: 'center', justifyContent: 'center', color: 'text.secondary' }}>
          Don't have an account?{' '}
          <Button
            variant="text"
            color="primary"
            onClick={onRegisterClick}
            sx={{ textTransform: 'none', fontWeight: 600 }}
            disabled={isLoading}
          >
            Sign up here
          </Button>
        </Box>
      </Box>
    </>
  );
};
