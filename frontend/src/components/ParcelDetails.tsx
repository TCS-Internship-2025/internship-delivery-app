import { getParcelChipData } from '../utils/parcelChipData.ts';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
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

export const ParcelDetails = ({ parcelData }: ParcelItemProps) => {
  const parcelChipData = getParcelChipData(parcelData?.status);

  return (
    <Box
      sx={{
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h3" marginBottom={1}>
        Test Parcel {parcelData?.parcelId}
      </Typography>
      <Typography variant="body1" fontSize={20}>
        Address: {parcelData?.address}
      </Typography>
      <Typography variant="h5">Delivery type: {parcelData?.delivery}</Typography>
      <Typography variant="body1">Payment type: {parcelData?.payment}</Typography>
      <Chip
        color={parcelChipData.color}
        label={parcelChipData.label}
        sx={{ alignSelf: 'flex-end', fontSize: 24, padding: 3, margin: 4 }}
      />
    </Box>
  );
};
