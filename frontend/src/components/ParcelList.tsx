import { PARCEL_STATUS } from '@/constants.ts';

import Grid from '@mui/material/Grid';

import { ParcelItem } from './ParcelItem.tsx';

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
    delivery: 'Home',
    payment: 'sender',
    status: PARCEL_STATUS.SHIPPING,
  },
];

export const UserParcels = () => {
  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      {DUMMY_DATA.map((item) => (
        <Grid key={item.parcelId} size={{ xs: 2, sm: 4, md: 4 }}>
          <ParcelItem parcelData={item} />
        </Grid>
      ))}
    </Grid>
  );
};
