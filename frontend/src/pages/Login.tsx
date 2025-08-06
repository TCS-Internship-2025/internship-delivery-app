import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';

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
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            p: 3,
          }}
        >
          <CardContent>
            <LoginHeader />
            <LoginForm onRegisterClick={handleRegisterClick} onForgotPasswordClick={handleForgotPasswordClick} />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
