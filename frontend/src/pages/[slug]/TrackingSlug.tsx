import { useParams } from 'react-router-dom';

import { useTracking } from '@/hooks/useTracking';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import TimelineComponent from '@/components/Timeline';

function TrackingSlug() {
  const { slug } = useParams();
  const { data, status } = useTracking(slug);

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
    <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
      <Container
        maxWidth={false}
        sx={{
          display: 'flex',
          border: '2px dashed grey',
          height: '100%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <Box maxWidth={'50%'}>
          <Typography sx={{}} variant="subtitle2" color="textSecondary" fontSize={10}>
            PARCEL NUMBER
          </Typography>
          <Typography sx={{ paddingBottom: 1 }}>{data.id}</Typography>
          <Typography sx={{}} variant="subtitle2" color="textSecondary" fontSize={10}>
            SENDER
          </Typography>
          <Typography sx={{ paddingBottom: 1 }}>{data.sender}</Typography>
          <Typography sx={{}} variant="subtitle2" color="textSecondary" fontSize={10}>
            DELIVERY METHOD
          </Typography>
          <Typography sx={{ paddingBottom: 1 }}>{data.method}</Typography>
          <Typography sx={{}} variant="subtitle2" color="textSecondary" fontSize={10}>
            DELIVERY ADDRESS
          </Typography>
          <Typography sx={{ paddingBottom: 1 }}>{data.address}</Typography>
        </Box>
        <TimelineComponent status={data.status} />
      </Container>
    </Box>
  );
}

export default TrackingSlug;
