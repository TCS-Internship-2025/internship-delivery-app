import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

import { useSmallScreen } from '@/hooks/useSmallScreen';
import { useAuth } from '@/contexts/AuthContext';

import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { AnimatedHero } from '@/components/AnimatedHero';
import { FeatureCard, features } from '@/components/FeatureCard';

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
      {/* Animated Hero Image */}
      <AnimatedHero />

      {/* Main Title */}
      <Typography variant={isSmallScreen ? 'h4' : 'h2'} sx={{ mb: 2, fontWeight: 700, letterSpacing: 2 }}>
        SwiftParcel
      </Typography>

      {/* Subtitle */}
      <Typography variant={isSmallScreen ? 'body1' : 'h5'} color="text.secondary" sx={{ mb: 4 }}>
        Welcome to the best parcel service provider!
      </Typography>

      {/* Features */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 3,
          mb: 4,
        }}
      >
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </Box>

      {/* Action Buttons */}
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

      {/* Invite Section */}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        New here?{' '}
        <Button variant="text" onClick={() => void navigate(ROUTES.REGISTER)}>
          Create an account
        </Button>{' '}
        and start sending parcels today!
      </Typography>
    </Box>
  );
};
