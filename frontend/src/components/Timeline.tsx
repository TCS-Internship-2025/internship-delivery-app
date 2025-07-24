import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
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
  return (
    <Timeline sx={{ maxWidth: '50%' }}>
      {status.map((value) => {
        return (
          <TimelineItem key={value.changeMessage}>
            <TimelineOppositeContent color="textSecondary">
              {new Date(value.changeDate).toLocaleDateString()}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              {value.changeMessage !== 'Delivered' ? <TimelineConnector /> : ''}
            </TimelineSeparator>
            <TimelineContent>
              {value.changeMessage}
              <Typography variant="subtitle2">{value.changeLocation}</Typography>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
