import { useNavigate } from 'react-router-dom';

import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const SiteNotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        textAlign: 'center',
      }}
    >
      <SentimentDissatisfiedIcon
        sx={{
          fontSize: 80,
          color: theme.palette.text.disabled,
          mb: theme.spacing(2),
        }}
      />
      <Typography variant="h2" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" color="text.secondary" sx={{ mb: theme.spacing(3) }}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => {
          void navigate('/');
        }}
      >
        Go to Homepage
      </Button>
    </Box>
  );
};
