import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PARCEL_STATUS } from '@/constants';

import { useSmallScreen } from '@/hooks/useSmallScreen';
import { useAuth } from '@/contexts/AuthContext';

import { useTimeline, useTracking } from '@/apis/tracking';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventIcon from '@mui/icons-material/Event';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import UpdateIcon from '@mui/icons-material/Update';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import Faq from '@/components/Faq';
import { QueryStates } from '@/components/QueryStates';
import TimelineComponent from '@/components/Timeline';
import TrackingDetails from '@/components/TrackingDetails';

function TrackingSlug() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { data: trackingData, status: trackingStatus } = useTracking(slug);
  const { data: timelineData, status: timelineStatus } = useTimeline(slug);
  const capitalizeFirstLetter = (input: string) => {
    return input.charAt(0).toUpperCase() + input.toLowerCase().slice(1);
  };
  const [index, setIndex] = useState<number>(0);
  const handleOnClick = (index: number) => {
    setIndex(index);
  };
  const getTimeLineValues = () => {
    if (trackingData?.currentStatus === null) return 1.5;
    if (trackingData?.currentStatus === PARCEL_STATUS.CREATED) return 26.5;
    if (trackingData?.currentStatus === PARCEL_STATUS.PICKED_UP) return 52;
    if (
      trackingData?.currentStatus === PARCEL_STATUS.OUT_FOR_DELIVERY ||
      trackingData?.currentStatus === PARCEL_STATUS.DELIVERY_ATTEMPTED
    )
      return 77.5;

    if (trackingData?.currentStatus === PARCEL_STATUS.DELIVERED) return 100;
    return 0;
  };

  const findNextStatus = () => {
    if (trackingData?.currentStatus === null) return 'CREATING';
    if (trackingData?.currentStatus === PARCEL_STATUS.CREATED) return 'WAITING FOR PICKUP';
    if (trackingData?.currentStatus === PARCEL_STATUS.PICKED_UP) return PARCEL_STATUS.IN_TRANSIT.replace('_', ' ');
    if (trackingData?.currentStatus === PARCEL_STATUS.IN_TRANSIT)
      return PARCEL_STATUS.OUT_FOR_DELIVERY.replace(/_/g, ' ');
    return null;
  };
  const uniqueTimelineEvents = timelineData?.filter(
    (event, index, self) => index === self.findIndex((e) => e.status === event.status) // keep first occurrence
  );
  const isSmallScreen = useSmallScreen();

  return (
    <QueryStates state={trackingStatus}>
      <QueryStates state={timelineStatus}>
        <Box display={'flex'} alignItems={'center'} flexDirection={'column'} marginTop={5}>
          <Box
            width={!isSmallScreen ? '50%' : '75%'}
            display={'flex'}
            justifyContent={'space-between'}
            flexDirection={'row'}
            paddingBottom={2}
          >
            <Box display={'flex'} gap={isSmallScreen ? 1 : 3}>
              <img
                src="/image.png"
                style={{
                  height: isSmallScreen ? 35 : 50,
                  width: 'auto',
                  objectFit: 'contain',
                  borderRadius: 0.5,
                }}
                alt="Logo"
              />
              <Box display={'flex'} flexDirection={'column'}>
                <Typography fontSize={isSmallScreen ? 10 : 15}>Track Order</Typography>
                <Typography fontWeight={'bold'} fontSize={isSmallScreen ? 15 : isSmallScreen ? 15 : 20}>
                  {slug}
                </Typography>
              </Box>
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={1} alignItems={'center'}>
              <Button variant="outlined" href="#faq">
                F.A.Q.
              </Button>
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
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocalShippingIcon color="primary" />
                  <Typography fontSize={isSmallScreen ? 15 : 20}>Current Status:</Typography>
                  <Typography fontSize={isSmallScreen ? 15 : 20} fontWeight={'bold'}>
                    {trackingData?.currentStatus
                      ? capitalizeFirstLetter(trackingData.currentStatus).replace(/_/g, ' ')
                      : 'Unknown'}
                  </Typography>
                </Stack>
                {trackingData?.estimatedDelivery && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <EventIcon color="success" />
                    <Typography fontSize={18}>
                      Estimated Delivery: <strong>{trackingData?.estimatedDelivery}</strong>
                    </Typography>
                  </Stack>
                )}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <UpdateIcon color="warning" />
                  <Typography fontSize={isSmallScreen ? 15 : 20}>
                    Updated:{' '}
                    <strong>
                      {timelineData && timelineData.length > 0
                        ? new Date(timelineData[timelineData.length - 1].timestamp).toLocaleDateString()
                        : 'No data available'}
                    </strong>
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Box>
              <LinearProgress
                variant={
                  trackingData?.currentStatus === PARCEL_STATUS.CANCELLED ||
                  trackingData?.currentStatus === PARCEL_STATUS.RETURNED_TO_SENDER
                    ? 'indeterminate'
                    : 'determinate'
                }
                color={
                  trackingData?.currentStatus === PARCEL_STATUS.CANCELLED ||
                  trackingData?.currentStatus === PARCEL_STATUS.RETURNED_TO_SENDER
                    ? 'error'
                    : 'primary'
                }
                value={getTimeLineValues()}
              />
              {!isSmallScreen ? (
                <Box paddingTop={1} alignItems={'center'} display={'flex'} gap={2}>
                  {uniqueTimelineEvents?.map((event) => {
                    if (
                      event.status === PARCEL_STATUS.OUT_FOR_DELIVERY ||
                      event.status === PARCEL_STATUS.DELIVERY_ATTEMPTED
                    ) {
                      return (
                        <Box display="flex" alignItems="center" width="25%" key={event.id} gap={1}>
                          <CircularProgress size={12} />
                          <Typography fontSize={12}>{event.status.replace(/_/g, ' ')}</Typography>
                        </Box>
                      );
                    }
                    if (event.status === PARCEL_STATUS.CANCELLED || event.status === PARCEL_STATUS.RETURNED_TO_SENDER) {
                      return (
                        <Box display="flex" alignItems="center" width="25%" key={event.id}>
                          <RemoveCircleIcon sx={{ height: 12 }} />
                          <Typography fontSize={12}>{event.status.replace(/_/g, ' ')}</Typography>
                        </Box>
                      );
                    }
                    if (
                      event.status !== PARCEL_STATUS.OUT_FOR_DELIVERY ||
                      event.status !== PARCEL_STATUS.DELIVERY_ATTEMPTED
                    ) {
                      return (
                        <Box display="flex" alignItems="center" width="25%" key={event.id}>
                          <CheckCircleIcon sx={{ height: 12 }} />
                          <Typography fontSize={12}>{event.status.replace(/_/g, ' ')}</Typography>
                        </Box>
                      );
                    }

                    return null;
                  })}

                  {trackingData?.currentStatus !== PARCEL_STATUS.DELIVERY_ATTEMPTED &&
                    findNextStatus() !== null &&
                    trackingData?.currentStatus !== PARCEL_STATUS.RETURNED_TO_SENDER &&
                    trackingData?.currentStatus !== PARCEL_STATUS.CANCELLED && (
                      <Box display="flex" alignItems="center" width="25%" gap={1}>
                        <CircularProgress size={12} />
                        <Typography fontSize={12}>{findNextStatus()}</Typography>
                      </Box>
                    )}
                </Box>
              ) : (
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} paddingTop={1}>
                  <CheckCircleIcon sx={{ height: 15 }} />
                  <Typography fontSize={isSmallScreen && 13}>{trackingData?.currentStatus}</Typography>
                </Box>
              )}
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={2}>
              <Button
                size={isSmallScreen ? 'medium' : 'large'}
                sx={isSmallScreen ? { fontSize: 10 } : {}}
                variant={index === 0 ? 'contained' : 'outlined'}
                onClick={() => handleOnClick(0)}
              >
                Progress
              </Button>
              <Tooltip title={!isAuthenticated ? 'Login to use this feature' : undefined} arrow>
                <span style={{ display: 'inline-flex' }}>
                  <Button
                    size={isSmallScreen ? 'small' : 'medium'}
                    sx={{
                      fontSize: isSmallScreen ? 12 : undefined,
                      paddingY: isSmallScreen ? 0.5 : undefined,
                    }}
                    disabled={trackingData?.recipient.email === null}
                    variant={index === 1 ? 'contained' : 'outlined'}
                    onClick={() => handleOnClick(1)}
                  >
                    Details
                  </Button>
                </span>
              </Tooltip>
            </Box>
            {index === 0 && timelineData && <TimelineComponent timeline={timelineData} />}
            {index === 1 && trackingData && <TrackingDetails trackingData={trackingData} />}
            <Faq categories={['tracking']} id={'faq'} />
          </Box>
        </Box>
      </QueryStates>
    </QueryStates>
  );
}

export default TrackingSlug;
