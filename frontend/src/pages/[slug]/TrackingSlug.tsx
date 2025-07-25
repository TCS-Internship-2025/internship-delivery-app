import { useParams } from 'react-router-dom';

import { useSmallScreen } from '@/hooks/useSmallScreen';
import { useTracking } from '@/hooks/useTracking';

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
          flexDirection: isSmallScreen ? 'column' : 'row',
          justifyContent: 'center',
          alignItems: isSmallScreen ? 'start' : 'center',
        }}
      >
        <Box
          paddingLeft={isSmallScreen ? 2 : ''}
          sx={{
            '& > :not(:last-child)': {
              marginBottom: (theme) => theme.spacing(0.5),
            },
          }}
        >
          <Typography variant="subtitle2" color="textSecondary" fontSize={10}>
            PARCEL NUMBER
          </Typography>
          <Typography>{data.id}</Typography>
          <Typography variant="subtitle2" color="textSecondary" fontSize={10}>
            SENDER
          </Typography>
          <Typography>{data.sender}</Typography>
          <Typography variant="subtitle2" color="textSecondary" fontSize={10}>
            DELIVERY METHOD
          </Typography>
          <Typography>{data.method}</Typography>
          <Typography variant="subtitle2" color="textSecondary" fontSize={10}>
            DELIVERY ADDRESS
          </Typography>
          <Typography>{data.address}</Typography>
        </Box>
        <Box marginLeft={0}>
          <TimelineComponent status={data.status} />
        </Box>
      </Container>
    </Box>
  );
}

export default TrackingSlug;
