import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/constants';

import { useSmallScreen } from '@/hooks/useSmallScreen';

import { useGetParcelById } from '@/apis/parcelGet';

import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { ParcelDetailsContent } from '@/components/ParcelDetailsContent';

export const ParcelDetails = () => {
  const [searchParams] = useSearchParams();
  const parcelId = searchParams.get('parcelId') ?? undefined;
  const { data, status } = useGetParcelById(parcelId);
  const isSmallScreen = useSmallScreen();
  const navigate = useNavigate();

  if (status === 'pending') {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'} mt={10}>
        <CircularProgress />
      </Box>
    );
  }
  if (status === 'error') {
    return (
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        height={'100%'}
        flexDirection={'column'}
        mt={10}
      >
        <Typography variant="h4">Something went wrong.</Typography>
        <Typography variant="subtitle1">Please try again later!</Typography>
      </Box>
    );
  }

  function handleBack() {
    void navigate(`/${ROUTES.PARCELS}`);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Container
          maxWidth={false}
          sx={{
            width: '100%',
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            alignSelf="flex-end"
            mt={{ xs: 0, md: 1 }}
            sx={
              isSmallScreen
                ? { position: 'fixed', top: 100, zIndex: 1000, right: 10 }
                : { position: 'fixed', top: 100, zIndex: 1000, right: 30 }
            }
          >
            <Tooltip title="Back to 'My Parcels' page">
              <IconButton onClick={handleBack}>
                <ArrowBackIosRoundedIcon color="primary" />
                {!isSmallScreen && (
                  <Typography variant="caption" fontWeight={600} color="secondary" ml={1} fontSize={18}>
                    Back
                  </Typography>
                )}
              </IconButton>
            </Tooltip>
          </Box>
          <ParcelDetailsContent parcelData={data} />
        </Container>
      </Box>
    </Box>
  );
};
