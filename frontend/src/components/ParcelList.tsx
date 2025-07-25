import Grid from '@mui/material/Grid';

import { ParcelItem } from './ParcelItem.tsx';

interface ParcelListProps {
  parcelList?: {
    parcelId?: number;
    address?: string;
    delivery?: string;
    payment?: string;
    status: string;
  }[];
}

export const ParcelList = ({ parcelList }: ParcelListProps) => {
  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ marginY: 4 }}>
      {parcelList?.map((item) => (
        <Grid key={item.parcelId} size={{ xs: 2, sm: 4, md: 4 }}>
          <ParcelItem parcelData={item} />
        </Grid>
      ))}
    </Grid>
  );
};
