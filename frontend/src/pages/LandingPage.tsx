import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface LandingPageButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

const LandingPageButton = ({ children, onClick }: LandingPageButtonProps) => {
  return (
    <Button variant="contained" color="primary" size="large" onClick={onClick}>
      {children}
    </Button>
  );
};

export const LandingPage = () => {
  const navigate = useNavigate();

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
        <LandingPageButton
          onClick={() => {
            void navigate(ROUTES.LOGIN);
          }}
        >
          Login
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
