import { useSmallScreen } from '@/hooks/useSmallScreen';

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Typography from '@mui/material/Typography';

interface TimelineProp {
  status: {
    changeDate: string;
    changeMessage: string;
    changeLocation: string;
  }[];
}

export default function TimelineComponent({ status }: TimelineProp) {
  const isSmallScreen = useSmallScreen();
  return (
    <Timeline
      sx={
        isSmallScreen
          ? {
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: '0',
              },
            }
          : {}
      }
    >
      {status.map((value) => {
        return (
          <TimelineItem key={value.changeMessage}>
            {!isSmallScreen ? (
              <TimelineOppositeContent color="textSecondary">
                {new Date(value.changeDate).toLocaleDateString()}
              </TimelineOppositeContent>
            ) : (
              ''
            )}
            <TimelineSeparator>
              <TimelineDot />
              {value.changeMessage !== 'Delivered' ? <TimelineConnector /> : ''}
            </TimelineSeparator>
            <TimelineContent variant="subtitle2">
              {value.changeMessage}
              <br />
              <Typography variant="caption">{value.changeLocation}</Typography>
              {isSmallScreen ? (
                <Typography variant="subtitle2" color="textSecondary">
                  {new Date(value.changeDate).toLocaleDateString()}
                </Typography>
              ) : (
                ''
              )}
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
