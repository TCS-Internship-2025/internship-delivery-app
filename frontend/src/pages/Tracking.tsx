import type { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const TrackingFormSchema = z.object({
  trackNumber: z.string().regex(/^HU\d{10}[A-Z]{2}$/, {
    message: "Tracking number starts with 'HU', followed by 10 digits and 2 uppercase letters",
  }),
});

type FormValues = z.infer<typeof TrackingFormSchema>;

export const Tracking = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(TrackingFormSchema),
  });
  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    void handleSubmit(onSubmit)(event);
  };
  const onSubmit = async (data: FormValues) => {
    await navigate(`/tracking/${data.trackNumber}`);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '90vh',
        }}
      >
        <TextField
          sx={{ width: '70%', marginBottom: 3 }}
          placeholder="HU1234567890AA"
          {...register('trackNumber')}
          error={!!errors.trackNumber}
          helperText={errors.trackNumber?.message}
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
