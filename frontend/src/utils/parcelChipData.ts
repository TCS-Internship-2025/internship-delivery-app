import { PARCEL_STATUS } from '@/constants.ts';

interface ChipData {
  color: 'default' | 'secondary' | 'info' | 'success' | 'error';
  label: string;
}

export const getParcelChipData = (status?: string): ChipData => {
  switch (status) {
    case PARCEL_STATUS.SCHEDULED:
      return { color: 'secondary', label: 'Scheduled' };
    case PARCEL_STATUS.SHIPPING:
      return { color: 'info', label: 'Shipping' };
    case PARCEL_STATUS.DELIVERED:
      return { color: 'success', label: 'Delivered' };
    case PARCEL_STATUS.STUCK:
      return { color: 'error', label: 'Stuck' };
    default:
      return { color: 'default', label: 'Default' };
  }
};
