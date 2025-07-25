import z from 'zod';

// Zod enums
export const TitleEnum = z.enum(['Mr', 'Mrs', 'Ms', 'Dr', 'Prof']);
export const RandomEnum = z.enum(['option 1', 'option 2', 'option 3']);
export type TitleEnum = z.infer<typeof TitleEnum>;
export type RandomEnum = z.infer<typeof RandomEnum>;

// Constants
export const ROUTES = {
  PAGE1: 'page1',
  PAGE2: 'page2',
  PAGE3: 'page3',
  PAGE4: 'page4',
  PAGE5: 'page5',
  SUCCESS: 'success',
  ERROR: 'error',
  PARCELS: 'my-parcels',
  DETAILS: 'details',
};

export const PARCEL_STATUS = {
  SCHEDULED: 'SCHEDULED',
  SHIPPING: 'SHIPPING',
  DELIVERED: 'DELIVERED',
  STUCK: 'STUCK',
};
