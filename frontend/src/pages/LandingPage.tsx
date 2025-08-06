import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

import { useAuth } from '@/contexts/AuthContext';

import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface LandingPageButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  color?: 'primary' | 'error';
}

const LandingPageButton = ({ children, onClick, color = 'primary' }: LandingPageButtonProps) => {
  return (
    <Button variant="contained" color={color} size="large" onClick={onClick}>
      {children}
    </Button>
  );
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      void logout().then(() => {
        void navigate(ROUTES.LOGIN);
      });
    } else {
      void navigate(ROUTES.LOGIN);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '90vh',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: '100%',
        }}
      >
        <img
          src="/image.png"
          alt="Logo"
          style={{
            width: '100%',
            height: '80%',
            display: 'block',
            margin: '0 auto',
            objectFit: 'contain',
            borderRadius: 0.5,
          }}
        />
      </Box>
      <Typography variant="h1" color="text.primary" sx={{ mb: 4 }}>
        SwiftParcel
      </Typography>
      <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
        Welcome to the best parcel service provider!
      </Typography>
      <Box display="flex" justifyContent="space-between" gap={2}>
        <LandingPageButton onClick={handleAuthClick} color={isAuthenticated ? 'error' : 'primary'}>
          {isAuthenticated ? (
            <>
              <LogoutIcon />
              Logout
            </>
          ) : (
            'Login'
          )}
        </LandingPageButton>
        <LandingPageButton
          onClick={() => {
            void navigate(ROUTES.TRACKING);
          }}
        >
          Track parcel
        </LandingPageButton>
      </Box>
    </Box>
  );
};
