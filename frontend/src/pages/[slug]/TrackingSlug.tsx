import { useParams } from 'react-router-dom';

import { useSmallScreen } from '@/hooks/useSmallScreen';

import { useTracking } from '@/apis/tracking';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import TimelineComponent from '@/components/Timeline';

function TrackingSlug() {
  const { slug } = useParams();
  const { data, status } = useTracking(slug);
  const isSmallScreen = useSmallScreen();

  if (status === 'pending') {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
        <CircularProgress />
      </Box>
    );
  }
  if (status === 'error') {
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
          <Typography>{data.trackingCode}</Typography>
          <Typography variant="subtitle2" color="textSecondary" fontSize={10}>
            SEND DATE
          </Typography>
          <Typography>{new Date(data.parcel.createdAt).toLocaleDateString()}</Typography>
          <Typography variant="subtitle2" color="textSecondary" fontSize={10}>
            DELIVERY METHOD
          </Typography>
          <Typography>{data.parcel.deliveryType}</Typography>
          <Typography variant="subtitle2" color="textSecondary" fontSize={10}>
            PAYMENT TYPE
          </Typography>
          <Typography>{data.parcel.paymentType}</Typography>
        </Box>
        <Box sx={{ width: '33%' }}>
          <TimelineComponent timeline={data.timeline} />
        </Box>
      </Container>
    </Box>
  );
}

export default TrackingSlug;
