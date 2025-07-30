import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export const Verified = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 10, textAlign: 'center' }}>
          <CheckCircleIcon color="primary" sx={{ fontSize: 104, mb: 2 }} />
          <Typography variant="h3" align="center" sx={{ fontWeight: 600 }}>
            Email Verified Successfully
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            You will be shortly redirected to the home page
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};
