import React from 'react';
import { getParcelChipData } from '../utils/parcelChipData.ts';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return 'Not specified';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
};

interface DataDisplayProps {
  label: string;
  children: React.ReactNode;
}

const DataDisplay = ({ label, children, ...props }: DataDisplayProps) => {
  return (
    <Typography variant="body1" fontSize={{ xs: 24, md: 28 }} ml={{ xs: 3, md: 6 }} {...props}>
      {label}: {children}
    </Typography>
  );
};

interface ParcelItemProps {
  parcelData?: {
    parcelId?: number;
    sender?: string;
    recipient?: string;
    delivery?: string;
    payment?: string;
    status?: string;
    tracking_number?: string;
    created_at?: Date;
    updated_at?: Date;
  };
}

export const ParcelDetailsContent = ({ parcelData }: ParcelItemProps) => {
  const parcelChipData = getParcelChipData(parcelData?.status);

  return (
    <Box display={{ xs: 'block', md: 'flex' }}>
      <Box width={{ xs: '100%', md: '50%' }}>
        <Typography
          variant="h3"
          fontSize={{ xs: 36, md: 44 }}
          ml={{ xs: 0, md: 2 }}
          mt={{ xs: 0, md: 1 }}
          mb={{ xs: 1.5, md: 3 }}
        >
          Parcel {parcelData?.parcelId ?? 'Unknown'}
        </Typography>
        <DataDisplay label="Sender">{parcelData?.sender ?? 'Not specified'}</DataDisplay>
        <DataDisplay label="Recipient">{parcelData?.recipient ?? 'Not specified'}</DataDisplay>
        <DataDisplay label="Delivery type">{parcelData?.delivery ?? 'Not specified'}</DataDisplay>
        <DataDisplay label="Payment type">{parcelData?.payment ?? 'Not specified'}</DataDisplay>
      </Box>
      <Box width={{ xs: '100%', md: '50%' }}>
        <Chip {...parcelChipData} sx={{ float: 'right', fontSize: 20, padding: 3, mr: 10, mt: 3, mb: 3 }} />
        <Typography variant="body1" fontSize={{ xs: 24, md: 28 }} ml={{ xs: 3, md: 6 }} mt={{ xs: 5, md: 15 }}>
          Tracking number: {parcelData?.tracking_number ?? 'Not specified'}
        </Typography>
        <DataDisplay label="Created at">{formatDate(parcelData?.created_at)}</DataDisplay>
        <DataDisplay label="Updated at">{formatDate(parcelData?.updated_at)}</DataDisplay>
      </Box>
      {/* TODO: Map */}
    </Box>
  );
};
