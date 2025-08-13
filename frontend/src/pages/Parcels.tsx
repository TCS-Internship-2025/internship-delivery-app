import { useSmallScreen } from '@/hooks/useSmallScreen';

import { useGetAllParcels } from '@/apis/parcelGet';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { ParcelGrid } from '@/components/ParcelGrid';
import { QueryStates } from '@/components/QueryStates';

export const ParcelPage = () => {
  const { data: allParcelData, status: allParcelStatus } = useGetAllParcels();
  const isSmallScreen = useSmallScreen();

  return (
    <QueryStates state={allParcelStatus} errorTitle="Could not fetch parcels data">
      <Box px={isSmallScreen ? 0 : 20} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          <ParcelGrid parcels={allParcelData} />
        </Container>
      </Box>
    </QueryStates>
  );
};
