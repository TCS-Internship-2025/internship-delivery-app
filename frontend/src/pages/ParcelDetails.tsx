import { useNavigate } from 'react-router-dom';
import { getParcelChipData } from '../utils/parcelChipData.ts';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
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
  const navigate = useNavigate();
  const parcelChipData = getParcelChipData(parcelData?.status);

  function handleBack() {
    void navigate('..');
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <Container
          maxWidth={false}
          sx={{
            width: '100%',
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h3" ml={2} mt={1} mb={3}>
            Test Parcel {parcelData?.parcelId}
          </Typography>
          <Typography variant="body1" fontSize={28} ml={6}>
            Address: {parcelData?.address}
          </Typography>
          <Typography variant="body1" fontSize={28} ml={6}>
            Delivery type: {parcelData?.delivery}
          </Typography>
          <Typography variant="body1" fontSize={28} ml={6}>
            Payment type: {parcelData?.payment}
          </Typography>
          <Chip
            color={parcelChipData.color}
            label={parcelChipData.label}
            sx={{ alignSelf: 'flex-start', fontSize: 24, padding: 3, mt: 6, ml: 10 }}
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={handleBack}
            sx={{ alignSelf: 'center', py: 2, px: 4, mt: 15, fontSize: 20, borderRadius: 3 }}
          >
            Back
          </Button>
        </Container>
      </Box>
    </Box>
  );
};
