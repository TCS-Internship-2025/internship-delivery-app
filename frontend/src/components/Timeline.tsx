import { useSmallScreen } from '@/hooks/useSmallScreen';

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Typography from '@mui/material/Typography';

interface TimelineEvent {
  id: string;
  parcelId: string;
  status: string;
  description: string;
  timestamp: string;
}

interface TimelineProps {
  timeline: TimelineEvent[];
}
const notSmallScreenStyle = { top: '50%', left: '50%', transform: 'translate(50%, 0)' };
export default function TimelineComponent({ timeline }: TimelineProps) {
  const isSmallScreen = useSmallScreen();

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
      {timeline.map((event) => (
        <TimelineItem key={event.id}>
          <TimelineSeparator>
            <TimelineDot />
            {event.status !== 'DELIVERED' && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent variant="subtitle2" fontSize={12}>
            {event.description.toUpperCase()}
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
