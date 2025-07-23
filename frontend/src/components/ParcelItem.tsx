import { PARCEL_STATUS } from '@/constants.ts';

import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface ParcelItemProps {
  parcelData?: {
    parcelId?: number;
    address?: string;
    delivery?: string;
    payment?: string;
    status: string;
  };
}

const getParcelChipData = (
  status = 'default'
): { color: 'default' | 'secondary' | 'primary' | 'success' | 'error'; label: string } => {
  if (status === PARCEL_STATUS.SCHEDULED) {
    return { color: 'secondary', label: 'Scheduled' };
  } else if (status === PARCEL_STATUS.SHIPPING) {
    return { color: 'primary', label: 'Shipping' };
  } else if (status === PARCEL_STATUS.DELIVERED) {
    return { color: 'success', label: 'Delivered' };
  } else if (status === PARCEL_STATUS.STUCK) {
    return { color: 'error', label: 'Stuck' };
  } else {
    return { color: 'default', label: 'Default' };
  }
};

export const ParcelItem = ({ parcelData }: ParcelItemProps) => {
  const parcelChipData = getParcelChipData(parcelData?.status);

  return (
    <Paper elevation={3}>
      <Typography variant="h4">Test Parcel {parcelData?.parcelId}</Typography>
      <Typography variant="body1">Address: {parcelData?.address}</Typography>
      <Chip color={parcelChipData.color} label={parcelChipData.label} />
      <Typography variant="body1">Payment type: {parcelData?.payment}</Typography>
      <Chip color={parcelChipData.color} label={parcelChipData.label} />
    </Paper>
  );
};
