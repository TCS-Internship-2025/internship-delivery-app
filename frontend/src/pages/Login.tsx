import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import { LoginForm } from '@/components/LoginForm';
import { LoginHeader } from '@/components/LoginHeader';

export const Login = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    void navigate('/register');
  };

  const handleForgotPasswordClick = () => {
    void navigate('/password-reset');
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
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            p: 6,
          }}
        >
          <LoginHeader />
          <LoginForm onRegisterClick={handleRegisterClick} onForgotPasswordClick={handleForgotPasswordClick} />
        </Paper>
      </Container>
    </Box>
  );
};
