import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';

import { useDeleteParcelById, useGetParcelById } from '@/apis/parcelGet';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ParcelDetailsContent } from '@/components/ParcelDetailsContent';

export const ParcelDetails = () => {
  const { token } = useAuth();
  const { parcelId } = useParams();
  const { data, status } = useGetParcelById(parcelId, token);
  const deleteParcelMutation = useDeleteParcelById();
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
    if (!parcelId) return;

    deleteParcelMutation.mutate(parcelId, {
      onSuccess: () => {
        console.log('Parcel deleted successfully');
        void navigate('..');
      },
      onError: (error) => {
        console.error('Failed to delete parcel:', error);
      },
    });
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
