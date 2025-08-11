import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// FeatureCard component
export const features = [
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
    icon: <SupportAgentIcon color="secondary" sx={{ fontSize: 40 }} />,
    title: '24/7 Support',
    desc: 'Our team is always here to help you.',
  },
];

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
