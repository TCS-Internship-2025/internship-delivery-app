import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/constants';

import { useSmallScreen } from '@/hooks/useSmallScreen';

import { useGetParcelById } from '@/apis/parcelGet';

import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { ErrorPage } from '@/pages/Error';

import { ParcelDetailsContent } from '@/components/ParcelDetailsContent';
import { QueryStates } from '@/components/QueryStates';

export const ParcelDetails = () => {
  const [searchParams] = useSearchParams();
  const parcelId = searchParams.get('parcelId') ?? undefined;
  const { data: thisParcelData, status: thisParcelStatus } = useGetParcelById(parcelId);
  const isSmallScreen = useSmallScreen();
  const navigate = useNavigate();

  function handleBack() {
    void navigate(`/${ROUTES.PARCELS}`);
  }

  if (!thisParcelData) {
    return <ErrorPage title="Could not fetch parcel details" />;
  }

  return (
    <QueryStates state={thisParcelStatus} errorTitle="Could not fetch parcel details">
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
            <ParcelDetailsContent parcelData={thisParcelData} />
          </Container>
        </Box>
      </Box>
    </QueryStates>
  );
};
