import type { TrackingData } from '@/apis/tracking';

import CakeIcon from '@mui/icons-material/Cake';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const TrackingDetails = ({ trackingData }: { trackingData: TrackingData }) => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography>
          <strong>Recipient Name:</strong> {trackingData.recipient.name}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography>
          <strong>Recipient Email:</strong> {trackingData.recipient.email}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography>
          <strong>Recipient Phone:</strong> {trackingData.recipient.phone}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CakeIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography>
          <strong>Recipient Birth Date:</strong> {trackingData.recipient.birthDate}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <SendIcon sx={{ mr: 1, color: 'secondary.main' }} />
        <Typography>
          <strong>Sender Email:</strong> {trackingData.senderEmail}
        </Typography>
      </Box>

      {trackingData.senderPhone && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PhoneIcon sx={{ mr: 1, color: 'secondary.main' }} />
          <Typography>
            <strong>Sender Phone:</strong> {trackingData.senderPhone}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
export default TrackingDetails;
