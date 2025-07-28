// import { ParcelList } from '../components/ParcelList';
import { PARCEL_STATUS } from '@/constants.ts';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { ParcelGrid } from '@/components/ParcelGrid';

const DUMMY_DATA = [
  {
    parcelId: 14,
    address: 'Budapest',
    delivery: 'Home',
    payment: 'sender',
    status: PARCEL_STATUS.SCHEDULED,
  },
  {
    parcelId: 21,
    address: 'Budapest',
    delivery: 'Pickup point',
    payment: 'sender',
    status: PARCEL_STATUS.SHIPPING,
  },
  {
    parcelId: 25,
    address: 'Szentendre',
    delivery: 'Home',
    payment: 'receiver',
    status: PARCEL_STATUS.DELIVERED,
  },
  {
    parcelId: 31,
    address: 'Budakeszi',
    delivery: 'Pickup point',
    payment: 'sender',
    status: PARCEL_STATUS.STUCK,
  },
];

export const ParcelPage = () => {
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
          {/* <ParcelList parcelList={DUMMY_DATA} /> */}
          <ParcelGrid parcels={DUMMY_DATA} />
        </Container>
      </Box>
    </Box>
  );
};
