import { useNavigate } from 'react-router-dom';
import { RegistrationForm } from '../components/RegistrationForm';
import { RegistrationHeader } from '../components/RegistrationHeader';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

export const Register = () => {
  const navigate = useNavigate();

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
        <Paper elevation={3} sx={{ borderRadius: 3, p: 6 }}>
          <RegistrationHeader />
          <RegistrationForm onLoginClick={handleLoginClick} />
        </Paper>
      </Container>
    </Box>
  );
};
