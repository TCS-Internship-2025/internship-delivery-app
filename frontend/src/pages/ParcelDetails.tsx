import { useNavigate, useParams } from 'react-router-dom';

import { useGetParcelById } from '@/apis/parcelGet';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ParcelDetailsContent } from '@/components/ParcelDetailsContent';

// const DUMMY_PARCEL = {
//   id: 'cc09a4ad-d7ba-422b-88ed-122b160cc265',
//   trackingCode: 'HU5901999790HL',
//   recipient: {
//     name: 'János Kovács',
//     email: 'janos.kovacs@example.com',
//     phone: '+36301234567',
//     birthDate: '1985-03-15',
//     address: {
//       line1: 'Deák Ferenc tér',
//       line2: '1. emelet',
//       building: 'A épület',
//       apartment: '12',
//       city: 'Budapest',
//       postalCode: '1034',
//       country: 'Hungary',
//       latitude: 47.5316,
//       longitude: 19.0579,
//     },
//   },
//   currentStatus: 'CREATED',
//   deliveryType: 'HOME',
//   paymentType: 'SENDER_PAYS',
//   createdAt: '2025-07-29T17:36:38.278011',
//   updatedAt: '2025-07-29T17:48:22.69395',
// };

export const ParcelDetails = () => {
  const { id } = useParams();
  const { data, status } = useGetParcelById(id);
  const navigate = useNavigate();

  if (status === 'pending') {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'} mt={10}>
        <CircularProgress />
      </Box>
    );
  }
  if (status === 'error') {
    return (
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        height={'100%'}
        flexDirection={'column'}
        mt={10}
      >
        <Typography variant="h4">Something went wrong.</Typography>
        <Typography variant="subtitle1">Please try again later!</Typography>
      </Box>
    );
  }

  function handleBack() {
    void navigate('..');
  }

  function handleDelete() {
    // TODO: delete request
    console.log('deleted');
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Container
          maxWidth={false}
          sx={{
            width: '100%',
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ParcelDetailsContent parcelData={data} />
          <Box alignSelf="center" mt={{ xs: 5, md: 10 }}>
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
