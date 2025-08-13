import { PARCEL_STATUS } from '@/constants';

import { useSmallScreen } from '@/hooks/useSmallScreen';

import { type TimelineData } from '@/apis/tracking';

import InventoryIcon from '@mui/icons-material/Inventory';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Typography from '@mui/material/Typography';

const TimelineIcon = ({ status }: { status: string }) => {
  if (status === PARCEL_STATUS.CREATED) {
    return <ReceiptIcon />;
  }
  if (status === PARCEL_STATUS.DELIVERED) {
    return <MarkEmailReadIcon />;
  }
  if (status === PARCEL_STATUS.IN_TRANSIT) {
    return <LocalPostOfficeIcon />;
  }
  if (status === PARCEL_STATUS.PICKED_UP) {
    return <InventoryIcon />;
  }
  if (status === PARCEL_STATUS.OUT_FOR_DELIVERY) {
    return <LocalShippingIcon />;
  }
};
export default function TimelineComponent({ timeline }: { timeline: TimelineData }) {
  const isSmallScreen = useSmallScreen();

  return (
    <Timeline
      sx={{
        minHeight: 300,
        [`& .${timelineItemClasses.missingOppositeContent}:before`]: { display: 'none' },
        ...(isSmallScreen && {
          [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 },
        }),
      }}
    >
      {timeline?.map((event) => (
        <TimelineItem key={event.id}>
          <TimelineSeparator>
            <TimelineIcon status={event.status} />
            {event.status !== PARCEL_STATUS.DELIVERED && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent variant="subtitle2" fontSize={12}>
            {event.description}
            <br />
            <Typography variant="subtitle2" color="textSecondary">
              {new Date(event.timestamp).toLocaleDateString()}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
