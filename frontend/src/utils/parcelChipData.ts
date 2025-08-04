import { PARCEL_STATUS } from '@/constants.ts';

interface ChipData {
  color: 'default' | 'secondary' | 'info' | 'success' | 'error' | 'warning';
  label: string;
}

export const getParcelChipData = (status?: string): ChipData => {
  switch (status) {
    case PARCEL_STATUS.CREATED:
      return { color: 'default', label: 'Created' };
    case PARCEL_STATUS.PICKED_UP:
      return { color: 'info', label: 'Picked up' };
    case PARCEL_STATUS.IN_TRANSIT:
      return { color: 'info', label: 'In transit' };
    case PARCEL_STATUS.OUT_FOR_DELIVERY:
      return { color: 'info', label: 'Out for delivery' };
    case PARCEL_STATUS.DELIVERED:
      return { color: 'success', label: 'Delivered' };
    case PARCEL_STATUS.CANCELLED:
      return { color: 'error', label: 'Cancelled' };
    case PARCEL_STATUS.DELIVERY_ATTEMPTED:
      return { color: 'warning', label: 'Delivery attempted' };
    case PARCEL_STATUS.RETURNED_TO_SENDER:
      return { color: 'warning', label: 'Returned to sender' };
    default:
      return { color: 'secondary', label: 'Unknown' };
  }
};
