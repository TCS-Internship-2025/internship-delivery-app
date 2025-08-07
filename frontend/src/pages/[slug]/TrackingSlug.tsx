import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PARCEL_STATUS, QUERY_STATUS } from '@/constants';

import { useSmallScreen } from '@/hooks/useSmallScreen';

import { useTimeline, useTracking } from '@/apis/tracking';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

import TimelineComponent from '@/components/Timeline';
import TrackingDetails from '@/components/TrackingDetails';

function TrackingSlug() {
  const { slug } = useParams();
  const { data: trackingData, status: trackingStatus } = useTracking(slug);
  const { data: timelineData, status: timelineStatus } = useTimeline(slug);
  const capitalizeFirstLetter = (input: string) => {
    return input.charAt(0).toUpperCase() + input.toLowerCase().slice(1);
  };
  const [index, setIndex] = useState<number>(0);
  const handleOnClick = (index: number) => {
    setIndex(index);
  };
  const findNextStatus = () => {
    if (timelineData?.length === 0) return PARCEL_STATUS.CREATED;
    if (timelineData?.length === 1) return PARCEL_STATUS.PICKED_UP;
    if (timelineData?.length === 2) return PARCEL_STATUS.IN_TRANSIT;
    if (timelineData?.length === 3) return PARCEL_STATUS.OUT_FOR_DELIVERY;
    if (timelineData?.length === 4) return 'ON THE WAY!';
    return null;
  };
  const isSmallScreen = useSmallScreen();
  if (timelineStatus === QUERY_STATUS.PENDING || trackingStatus === QUERY_STATUS.PENDING) {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
        <CircularProgress />
      </Box>
    );
  }
  if (timelineStatus === QUERY_STATUS.ERROR || trackingStatus === QUERY_STATUS.ERROR) {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'} flexDirection={'column'}>
        <Typography variant="h4">Something went wrong.</Typography>
        <Typography variant="subtitle1">Please try again later!</Typography>
      </Box>
    );
  }
  return (
    <Box display={'flex'} alignItems={'center'} flexDirection={'column'} marginTop={5}>
      <Box
        width={!isSmallScreen ? '50%' : '75%'}
        display={'flex'}
        justifyContent={'space-between'}
        flexDirection={'row'}
        sx={{ borderRadius: 2, boxShadow: '0px 1px 0px black' }}
      >
        <Box display={'flex'} gap={3}>
          <img
            src="/image.png"
            style={{
              height: 50,
              width: 'auto',
              objectFit: 'contain',
              borderRadius: 0.5,
            }}
            alt="Logo"
          />
          <Box display={'flex'} flexDirection={'column'}>
            <Typography>Track Order</Typography>
            <Typography>{slug}</Typography>
          </Box>
        </Box>
        <Box display={'flex'} flexDirection={'row'} gap={1} alignItems={'center'}>
          <Typography>some text</Typography>
          <Typography>some text</Typography>
        </Box>
      </Box>
      <Divider orientation="vertical" variant="middle" flexItem />
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'flex-start'}
        width={!isSmallScreen ? '50%' : '75%'}
        gap={6}
      >
        <Box>
          <Typography fontSize={25}>
            Current Status: {trackingData && capitalizeFirstLetter(trackingData?.currentStatus)}
          </Typography>
          <Typography fontSize={19}>EstimatedDelivery: 2025/08/10</Typography>
          <Typography fontSize={19}>Updated: Today - 2025/08/06</Typography>
        </Box>
        <Box>
          <LinearProgress
            variant="determinate"
            value={timelineData ? (timelineData.length !== 5 ? 2 + 20 * timelineData.length : 100) : 100}
            sx={{ borderRadius: 2, height: 8 }}
          />
          <Box paddingTop={1} alignItems={'center'} display={'flex'} gap={2}>
            {timelineData?.map((event) => {
              return (
                <Box display={'flex'} alignItems={'center'} width={'20%'} key={event.id}>
                  <CheckCircleIcon sx={{ height: 12 }} />
                  <Typography fontSize={12}>{event.status.replace(/_/g, ' ')}</Typography>
                </Box>
              );
            })}
            {findNextStatus() !== null && (
              <Box display={'flex'} alignItems={'center'} width={'20%'} gap={1}>
                <CircularProgress size={12} />
                <Typography fontSize={12}>{findNextStatus()}</Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Box display={'flex'} flexDirection={'row'} gap={2}>
          <Button variant={index === 0 ? 'contained' : 'outlined'} onClick={() => handleOnClick(0)}>
            Progress
          </Button>
          <Button variant={index === 1 ? 'contained' : 'outlined'} onClick={() => handleOnClick(1)}>
            Details
          </Button>
          <Button variant={index === 2 ? 'contained' : 'outlined'} onClick={() => handleOnClick(2)}>
            asd
          </Button>
        </Box>
        {index === 0 && timelineData && <TimelineComponent timeline={timelineData} />}
        {index === 1 && trackingData && <TrackingDetails trackingData={trackingData} />}
      </Box>
    </Box>
  );
}

export default TrackingSlug;
