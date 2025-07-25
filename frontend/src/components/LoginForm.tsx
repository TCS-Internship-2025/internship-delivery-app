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
}

export const LoginForm = ({ onRegisterClick }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { form, onSubmit, isLoading, error } = useLoginForm();
  const { control, handleSubmit } = form;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSubmit(onSubmit)(e);
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
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
              sx={{ mb: 3 }}
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
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{
            mt: 2,
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
