import { useNavigate } from 'react-router-dom';
import { PARCEL_STATUS } from '@/constants';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { ParcelDetailsContent } from '@/components/ParcelDetailsContent';

const DUMMY_PARCEL_DATA = {
  parcelId: 14,
  address: 'Budapest',
  delivery: 'Home',
  payment: 'sender',
  status: PARCEL_STATUS.SCHEDULED,
};

export const ParcelDetails = () => {
  const navigate = useNavigate();

  function handleBack() {
    void navigate('..');
  }

  function handleDelete() {
    console.log('deleted');
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
          <ParcelDetailsContent parcelData={DUMMY_PARCEL_DATA} />
          <Box sx={{ alignSelf: 'center', mt: 15 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleBack}
              sx={{ py: 2, px: 4, mr: 2, fontSize: 20, borderRadius: 3 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDelete}
              sx={{ py: 2, px: 4, ml: 2, fontSize: 20, borderRadius: 3 }}
            >
              Delete
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
