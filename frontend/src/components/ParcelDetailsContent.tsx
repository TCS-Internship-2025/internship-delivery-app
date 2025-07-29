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
          Parcel {parcelData?.parcelId}
        </Typography>
        <Typography variant="body1" fontSize={{ xs: 24, md: 28 }} ml={{ xs: 3, md: 6 }}>
          Sender:
        </Typography>
        <Typography variant="body1" fontSize={{ xs: 24, md: 28 }} ml={{ xs: 3, md: 6 }}>
          Recipient:
        </Typography>
        <Typography variant="body1" fontSize={{ xs: 24, md: 28 }} ml={{ xs: 3, md: 6 }}>
          Delivery type: {parcelData?.delivery}
        </Typography>
        <Typography variant="body1" fontSize={{ xs: 24, md: 28 }} ml={{ xs: 3, md: 6 }}>
          Payment type: {parcelData?.payment}
        </Typography>
      </Box>
      <Box width={{ xs: '100%', md: '50%' }}>
        <Chip {...parcelChipData} sx={{ float: 'right', fontSize: 20, padding: 3, mr: 10, mt: 3, mb: 3 }} />
        <Typography variant="body1" fontSize={{ xs: 24, md: 28 }} ml={{ xs: 3, md: 6 }} mt={{ xs: 5, md: 15 }}>
          Tracking number:
        </Typography>
        <Typography variant="body1" fontSize={{ xs: 24, md: 28 }} ml={{ xs: 3, md: 6 }}>
          Created at:
        </Typography>
        <Typography variant="body1" fontSize={{ xs: 24, md: 28 }} ml={{ xs: 3, md: 6 }}>
          Updated at:
        </Typography>
      </Box>
      {/* TODO: Map */}
    </Box>
  );
};
