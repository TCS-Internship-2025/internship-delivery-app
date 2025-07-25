import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

interface FormValues {
  trackNumber: string;
}

export const Tracking = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    await navigate(`/tracking/${data.trackNumber}`);
  };

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100vh',
        }}
      >
        <TextField
          sx={{ width: '66%', marginBottom: 3 }}
          placeholder="SWIFT1875037"
          {...register('trackNumber', { required: true })}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton {...register('trackNumber')} type="submit">
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Typography variant="h5" align="center">
          Track Your Parcel!
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" align="center">
          Enter the parcel tracking number
        </Typography>
      </Box>
    </form>
  );
};
