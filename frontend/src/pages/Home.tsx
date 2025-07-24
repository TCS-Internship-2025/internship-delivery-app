import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

interface FormValues {
  trackNumber: string;
}

export const Home = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    await navigate(`/tracking/${data.trackNumber}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <form
        onSubmit={() => {
          handleSubmit(onSubmit);
        }}
        style={{ flex: 1, overflow: 'auto', minHeight: 0 }}
      >
        <Container
          maxWidth={false}
          sx={{
            display: 'flex',
            border: '2px dashed grey',
            height: '100%',
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TextField
            sx={{ width: '66%', paddingBottom: 5 }}
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
          <Typography variant="h5">Track Your Parcel!</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Enter the parcel tracking number starting with "SWIFT"
          </Typography>
        </Container>
      </form>
    </Box>
  );
};
