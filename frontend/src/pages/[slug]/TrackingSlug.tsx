import { useParams } from 'react-router-dom';
import { QUERY_STATUS } from '@/constants';

import { useSmallScreen } from '@/hooks/useSmallScreen';

import { useTracking } from '@/apis/tracking';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { AddressChangeModal } from '@/components/AddressChangeModal';
import TimelineComponent from '@/components/Timeline';

function TrackingSlug() {
  const { slug } = useParams();
  const { data: trackingData, status: trackingStatus } = useTracking(slug);

  const isSmallScreen = useSmallScreen();
  if (trackingStatus === QUERY_STATUS.PENDING) {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
        <CircularProgress />
      </Box>
    );
  }
  if (trackingStatus === QUERY_STATUS.ERROR) {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'} flexDirection={'column'}>
        <Typography variant="h4">Something went wrong.</Typography>
        <Typography variant="subtitle1">Please try again later!</Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ height: '100vh' }}>
      <Container
        sx={{
          display: 'flex',
          height: '100%',
          width: '100%',
          flexDirection: isSmallScreen ? 'column' : 'row',
          justifyContent: 'center',
          alignItems: isSmallScreen ? 'start' : 'center',
        }}
      >
        <Box
          sx={{
            width: '33%',
            ...(isSmallScreen && { paddingLeft: 2 }),
            '& > :not(:last-child)': {
              marginBottom: (theme) => theme.spacing(0.5),
            },
          }}
        >
          <Typography variant="subtitle2" color="textSecondary" fontSize={10}>
            PARCEL NUMBER
          </Typography>
          <Typography>{trackingData?.trackingCode}</Typography>
          <Typography variant="subtitle2" color="textSecondary" fontSize={10}>
            ESTIMATED TIME OF ARRIVAL
          </Typography>
          <Typography>{trackingData && new Date(trackingData.estimatedDelivery).toLocaleDateString()}</Typography>
          <Typography variant="subtitle2" color="textSecondary" fontSize={10}>
            RECIPIENT
          </Typography>
          <Typography>{trackingData?.recipientName}</Typography>
          <Typography variant="subtitle2" color="textSecondary" fontSize={10}>
            SENDER
          </Typography>
          <Typography>{trackingData?.senderName}</Typography>
          <Typography variant="subtitle2" color="textSecondary" fontSize={10}>
            CURRENT STATUS
          </Typography>
          <Typography>{trackingData?.currentStatus}</Typography>
        </Box>
        <AddressChangeModal parcelId={trackingData?.parcelId} />
        <Box sx={{ width: '33%' }}>
          <TimelineComponent trackingNumber={slug ?? ''} />
        </Box>
      </Container>
    </Box>
  );
}

export default TrackingSlug;
