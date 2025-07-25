import { useNavigate } from 'react-router-dom';
import { getParcelChipData } from '../utils/parcelChipData.ts';

import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface ParcelItemProps {
  parcelData?: {
    parcelId?: number;
    address?: string;
    delivery?: string;
    payment?: string;
    status: string;
  };
}

export const ParcelItem = ({ parcelData }: ParcelItemProps) => {
  const navigate = useNavigate();
  const parcelChipData = getParcelChipData(parcelData?.status);

  function handleClick() {
    void navigate('details');
  }

  return (
    <Paper
      elevation={3}
      onClick={handleClick}
      sx={{
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          backgroundColor: 'action.hover',
          cursor: 'pointer',
        },
      }}
    >
      <Typography variant="h5" marginBottom={1}>
        Test Parcel {parcelData?.parcelId}
      </Typography>
      <Typography variant="body1">Address: {parcelData?.address}</Typography>
      <Typography variant="body1">Delivery type: {parcelData?.delivery}</Typography>
      <Typography variant="body1">Payment type: {parcelData?.payment}</Typography>
      <Chip
        color={parcelChipData.color}
        label={parcelChipData.label}
        sx={{ alignSelf: 'flex-end', padding: 1, marginTop: 2 }}
      />
    </Paper>
  );
};
