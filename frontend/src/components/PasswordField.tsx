import { useState } from 'react';
import { Controller, type Control, type FieldError, type FieldPath, type FieldValues } from 'react-hook-form';
import { usePasswordStrength } from '../hooks/usePasswordStrength';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

interface PasswordFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  control: Control<T>;
  error?: FieldError;
  disabled?: boolean;
  showStrengthIndicator?: boolean;
  autoComplete?: string;
  value?: string;
}

export const PasswordField = <T extends FieldValues>({
  name,
  label,
  control,
  error,
  disabled = false,
  showStrengthIndicator = false,
  autoComplete = 'new-password',
  value = '',
}: PasswordFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordStrength = usePasswordStrength(value);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box sx={{ mb: 3 }}>
          <TextField
            {...field}
            fullWidth
            label={label}
            type={showPassword ? 'text' : 'password'}
            error={!!error}
            helperText={error?.message}
            autoComplete={autoComplete}
            disabled={disabled}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={disabled}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          {showStrengthIndicator && passwordStrength && value && (
            <PasswordStrengthIndicator strength={passwordStrength} />
          )}
        </Box>
      )}
    />
  );
};
