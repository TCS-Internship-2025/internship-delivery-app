import { error, pending } from '@/constants';

import { useSmallScreen } from '@/hooks/useSmallScreen';

import { useTimeline } from '@/apis/tracking';

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

const notSmallScreenStyle = { top: '50%', left: '50%', transform: 'translate(50%, 0)' };

const delivered = 'DELIVERED';
export default function TimelineComponent({ trackingNumber }: { trackingNumber: string }) {
  const isSmallScreen = useSmallScreen();
  const { data: timelineData, status: timelineStatus } = useTimeline(trackingNumber);
  if (timelineStatus === pending) {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
        <CircularProgress />
      </Box>
    );
  }
  if (timelineStatus === error) {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'} flexDirection={'column'}>
        <Typography variant="h4">Something went wrong.</Typography>
        <Typography variant="subtitle1">Please try again later!</Typography>
      </Box>
    );
  }
  return (
    <Timeline
      sx={{
        paddingTop: isSmallScreen ? 0 : 7,
        ...(!isSmallScreen && notSmallScreenStyle),
        [`& .${timelineItemClasses.missingOppositeContent}:before`]: { display: 'none' },
        ...(isSmallScreen && {
          [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 },
        }),
      }}
    >
      {timelineData?.map((event) => (
        <TimelineItem key={event.id}>
          <TimelineSeparator>
            <TimelineDot />
            {event.status !== delivered && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent variant="subtitle2" fontSize={12}>
            {event.description}
            <br />
            <Typography variant="caption" noWrap>
              {event.status.replace('_', ' ')}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {new Date(event.timestamp).toLocaleDateString()}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
