import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export const Home = () => {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState<string>('');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <Container
          maxWidth={false}
          sx={{
            display: 'flex',
            border: '2px dashed grey',
            height: '100%',
            width: 'screen',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TextField
            onChange={(e) => {
              setTrackingNumber(e.target.value);
            }}
            sx={{ width: '66%', paddingBottom: 5 }}
            placeholder="SWIFT1875037"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        void navigate(`tracking/${trackingNumber}`);
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          ></TextField>
          <Typography variant="h5">Track Your Parcel!</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Enter the parcel tracking number starting with "SWIFT"
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
