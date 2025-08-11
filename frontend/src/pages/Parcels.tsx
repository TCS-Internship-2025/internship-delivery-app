import { useGetAllParcels } from '@/apis/parcelGet';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { ErrorPage } from '@/pages/Error';

import { ParcelGrid } from '@/components/ParcelGrid';
import { QueryStates } from '@/components/QueryStates';

export const ParcelPage = () => {
  const { data: allParcelData, status: allParcelStatus } = useGetAllParcels();

  if (!allParcelData) {
    return <ErrorPage title="Could not fetch parcels data" />;
  }

  return (
    <QueryStates state={allParcelStatus} errorTitle="Could not fetch parcels data">
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
          <Container
            maxWidth={false}
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ParcelGrid parcels={allParcelData} />
          </Container>
        </Box>
      </Box>
    </QueryStates>
  );
};
