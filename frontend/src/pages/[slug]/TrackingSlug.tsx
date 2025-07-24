import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import z from 'zod';

import { httpService } from '@/services/httpService';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import TimelineComponent from '@/components/Timeline';

function TrackingSlug() {
  const { slug } = useParams();

  //probably wont be the response the backend sends
  const trackSchema = z.object({
    id: z.string(),
    sender: z.string(),
    method: z.string(),
    address: z.string(),
    status: z.array(
      z.object({
        changeDate: z.string(),
        changeMessage: z.string(),
        changeLocation: z.string(),
      })
    ),
  });

  const { status, data, error } = useQuery({ queryKey: ['tracking', slug], queryFn: fetchTrackingData });
  async function fetchTrackingData() {
    return await httpService.get(`tracking/${slug}`, trackSchema);
  }
  if (status === 'pending') {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }
  if (status === 'error') {
    return <Typography>Error:{error.message}</Typography>;
  }
  console.log(data.status);
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
