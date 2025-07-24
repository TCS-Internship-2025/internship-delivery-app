import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LoginIcon from '@mui/icons-material/Login';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation for demo purposes
    if (email && password) {
      // Redirect to main application
      void navigate('/');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
                <LoginIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Sign in to your account to continue
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 3 }}
                autoComplete="email"
                autoFocus
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
                autoComplete="current-password"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  mb: 2,
                  height: 48,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Login
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
                  Don't have an account?{' '}
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      void navigate('/register');
                    }}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    Sign up here
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
