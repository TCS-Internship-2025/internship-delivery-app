import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <Paper
    elevation={4}
    sx={{
      p: 2,
      minWidth: 180,
      maxWidth: 220,
      textAlign: 'center',
      borderRadius: 3,
      transition: 'transform 0.3s',
      '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
      bgcolor: 'background.paper',
    }}
  >
    <Box sx={{ mb: 1 }}>{icon}</Box>
    <Typography variant="h6" sx={{ mb: 0.5 }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {desc}
    </Typography>
  </Paper>
);
