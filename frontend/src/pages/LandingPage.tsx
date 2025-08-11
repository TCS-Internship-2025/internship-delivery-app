import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

import { useSmallScreen } from '@/hooks/useSmallScreen';
import { useAuth } from '@/contexts/AuthContext';

import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from '@mui/icons-material/Security';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { AnimatedHero } from '@/components/AnimatedHero';
import { FeatureCard } from '@/components/FeatureCard';

const features = [
  {
    id: 1,
    icon: <LocalShippingIcon color="primary" sx={{ fontSize: 40 }} />,
    title: 'Fast Delivery',
    desc: 'Get your parcels delivered swiftly and securely.',
  },
  {
    id: 2,
    icon: <TrackChangesIcon color="primary" sx={{ fontSize: 40 }} />,
    title: 'Live Tracking',
    desc: 'Track your parcel in real-time from pickup to delivery.',
  },
  {
    id: 3,
    icon: <SecurityIcon color="primary" sx={{ fontSize: 40 }} />,
    title: 'Secure Packaging',
    desc: 'We ensure your parcels are packed safely to avoid any damage.',
  },
];

interface LandingPageButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  color?: 'primary' | 'error';
}

const LandingPageButton = ({ children, onClick, color = 'primary' }: LandingPageButtonProps) => {
  return (
    <Button variant="contained" color={color} size="large" onClick={onClick} sx={{ whiteSpace: 'nowrap', px: 3 }}>
      {children}
    </Button>
  );
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const isSmallScreen = useSmallScreen();

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
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        textAlign: 'center',
        px: 2,
      }}
    >
      <AnimatedHero />

      <Typography variant={isSmallScreen ? 'h4' : 'h2'} sx={{ mb: 2, fontWeight: 700, letterSpacing: 2 }}>
        SwiftParcel
      </Typography>

      <Typography variant={isSmallScreen ? 'body1' : 'h5'} color="text.secondary" sx={{ mb: 4 }}>
        Welcome to the best parcel service provider!
      </Typography>
      {!isSmallScreen && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 3,
            mb: 4,
          }}
        >
          {features.map((f) => (
            <FeatureCard key={f.id} {...f} />
          ))}
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 2,
          maxWidth: 400,
        }}
      >
        <LandingPageButton onClick={handleAuthClick} color={isAuthenticated ? 'error' : 'primary'}>
          {isAuthenticated ? (
            <>
              <LogoutIcon sx={{ mr: 1 }} />
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
      {!isAuthenticated && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          New here?{' '}
          <Button variant="text" onClick={() => void navigate(ROUTES.REGISTER)}>
            Create an account
          </Button>{' '}
          and start sending parcels today!
        </Typography>
      )}
    </Box>
  );
};
