import { useNavigate } from 'react-router-dom';
import { RegistrationForm } from '../components/RegistrationForm';
import { RegistrationHeader } from '../components/RegistrationHeader';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';

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
        <Card elevation={3} sx={{ borderRadius: 3, p: 3 }}>
          <CardContent>
            <RegistrationHeader />
            <RegistrationForm onLoginClick={handleLoginClick} />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
