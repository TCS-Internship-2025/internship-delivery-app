import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

//Password strength
const passwordStrengthSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

//Registration form validation
const registrationSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must not exceed 50 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    email: z.string().email('Please enter a valid email address'),
    password: passwordStrengthSchema,
    confirmPassword: z.string().min(1, 'Confirm Password must match the Password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

//Password strength
const passwordStrength = (
  password: string
): { score: number; label: string; color: 'error' | 'warning' | 'info' | 'success' } => {
  let score = 0;
  const checks = [
    password.length >= 6,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^a-zA-Z0-9]/.test(password),
    password.length >= 12,
  ];

  score = checks.filter(Boolean).length;

  if (score <= 2) {
    return { score, label: 'Weak', color: 'error' };
  }
  if (score <= 4) {
    return { score, label: 'Moderate', color: 'warning' };
  }
  if (score === 5) {
    return { score, label: 'Good', color: 'info' };
  } else {
    return { score, label: 'Strong', color: 'success' };
  }
};

export const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');
  const passwordStrengthInfo = password ? passwordStrength(password) : null;

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      // TODO: Implement actual registration logic here
      console.log('Registration data:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      void navigate('/');
    } catch {
      setSubmitError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <PersonAddIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Sign up to get started with our application
              </Typography>
            </Box>

            {submitError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {submitError}
              </Alert>
            )}

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

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      {...field}
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      autoComplete="new-password"
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
                    {passwordStrengthInfo && field.value && (
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Password strength:
                          </Typography>
                          <Chip
                            label={passwordStrengthInfo.label}
                            size="small"
                            color={passwordStrengthInfo.color}
                            icon={
                              passwordStrengthInfo.label === 'Strong' ? (
                                <CheckCircleIcon fontSize="small" />
                              ) : (
                                <ErrorIcon fontSize="small" />
                              )
                            }
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(passwordStrengthInfo.score / 6) * 100}
                          color={passwordStrengthInfo.color}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    sx={{ mb: 3 }}
                    autoComplete="new-password"
                    disabled={isLoading}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={toggleConfirmPasswordVisibility}
                              edge="end"
                              disabled={isLoading}
                            >
                              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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

              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    width: '80%',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    mb: 1,
                  }}
                />
                <Box sx={{ mt: 1 }}>
                  Already have an account?{' '}
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      void navigate('/login');
                    }}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                    disabled={isLoading}
                  >
                    Login here
                  </Button>
                </Box>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
