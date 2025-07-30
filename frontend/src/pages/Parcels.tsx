// import { useGetAllParcels } from '@/apis/parcelGet';

import Box from '@mui/material/Box';
// import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';

// import Typography from '@mui/material/Typography';

import { ParcelGrid } from '@/components/ParcelGrid';

import { sampleData } from '@/utils/parcel_sample_data';

export const ParcelPage = () => {
  // const { data, status } = useGetAllParcels();

  // if (status === 'pending') {
  //   return (
  //     <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'} mt={10}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }
  // if (status === 'error') {
  //   return (
  //     <Box
  //       display={'flex'}
  //       justifyContent={'center'}
  //       alignItems={'center'}
  //       height={'100%'}
  //       flexDirection={'column'}
  //       mt={10}
  //     >
  //       <Typography variant="h4">Something went wrong.</Typography>
  //       <Typography variant="subtitle1">Please try again later!</Typography>
  //     </Box>
  //   );
  // }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <Container
          maxWidth={false}
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ParcelGrid parcels={sampleData} />
        </Container>
      </Box>
    </Box>
  );
};
