import React from 'react';

import type { TrackingData } from '@/apis/tracking';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const TrackingDetails = ({ trackingData }: { trackingData: TrackingData }) => {
  return (
    <Box>
      <Typography>Recipient: {trackingData.recipientName}</Typography>
      <Typography>Sender: {trackingData.senderName}</Typography>
    </Box>
  );
};

export default TrackingDetails;
