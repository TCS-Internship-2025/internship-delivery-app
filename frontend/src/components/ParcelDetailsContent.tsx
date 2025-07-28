import { getParcelChipData } from '../utils/parcelChipData.ts';

import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
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

export const ParcelDetailsContent = ({ parcelData }: ParcelItemProps) => {
  const parcelChipData = getParcelChipData(parcelData?.status);

  return (
    <Grid spacing={{ xs: 2, md: 3 }} size={{ xs: 12, md: 6 }}>
      <Typography variant="h3" ml={2} mt={1} mb={3}>
        Parcel {parcelData?.parcelId}
      </Typography>
      <Typography variant="body1" fontSize={28} ml={6}>
        Sender:
      </Typography>
      <Typography variant="body1" fontSize={28} ml={6}>
        Recipient:
      </Typography>
      <Typography variant="body1" fontSize={28} ml={6}>
        Delivery type: {parcelData?.delivery}
      </Typography>
      <Typography variant="body1" fontSize={28} ml={6}>
        Payment type: {parcelData?.payment}
      </Typography>
      <Chip {...parcelChipData} sx={{ alignSelf: 'flex-start', fontSize: 24, padding: 3, mt: 6, ml: 10 }} />
    </Grid>
  );
};
