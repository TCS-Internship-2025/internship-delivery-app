import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface LandingPageButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

const LandingPageButton = ({ children, onClick }: LandingPageButtonProps) => {
  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={onClick}
      sx={{
        px: 4,
        transition: 'box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out',
        boxShadow: 2,
        '&:hover': {
          boxShadow: 4,
          backgroundColor: 'primary.dark',
        },
      }}
    >
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
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
        SwiftSend
      </Typography>
      <Typography variant="h6" color="text.secondary" maxWidth={500} sx={{ mb: 4 }}>
        Fast. Reliable. Secure. Your parcels delivered anywhere, anytime.
      </Typography>
      <Stack direction="row" spacing={3}>
        <LandingPageButton onClick={() => void navigate(ROUTES.PAGE1)}>Login</LandingPageButton>
        <LandingPageButton onClick={() => void navigate(ROUTES.PAGE1)}>Track Parcel</LandingPageButton>
      </Stack>
    </Box>
  );
};
