import { PARCEL_STATUS } from '@/constants.ts';

export const getParcelChipData = (
  status = 'default'
): {
  color: 'default' | 'secondary' | 'info' | 'success' | 'error';
  label: string;
} => {
  if (status === PARCEL_STATUS.SCHEDULED) {
    return { color: 'secondary', label: 'Scheduled' };
  } else if (status === PARCEL_STATUS.SHIPPING) {
    return { color: 'info', label: 'Shipping' };
  } else if (status === PARCEL_STATUS.DELIVERED) {
    return { color: 'success', label: 'Delivered' };
  } else if (status === PARCEL_STATUS.STUCK) {
    return { color: 'error', label: 'Stuck' };
  } else {
    return { color: 'default', label: 'Default' };
  }
};
