import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/constants';

import { useGetParcelById } from '@/apis/parcelGet';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ParcelDetailsContent } from '@/components/ParcelDetailsContent';

export const ParcelDetails = () => {
  const [searchParams] = useSearchParams();
  const parcelId = searchParams.get('parcelId') ?? undefined;
  const { data, status } = useGetParcelById(parcelId);
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
    void navigate(`/${ROUTES.PARCELS}`);
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
          {/* TODO: sticky, responsive back arrow button */}
          <Box alignSelf="flex-end" mt={{ xs: 0, md: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleBack}
              sx={{ py: 2, px: 4, mr: 2, fontSize: 20, borderRadius: 3 }}
            >
              Back
            </Button>
          </Box>
          <ParcelDetailsContent parcelData={data} />
        </Container>
      </Box>
    </Box>
  );
};
