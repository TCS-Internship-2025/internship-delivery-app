import z from 'zod';

// Zod enums
export const TitleEnum = z.enum(['Mr', 'Mrs', 'Ms', 'Dr', 'Prof']);
export const DeliveryEnum = z.enum(['Home', 'Pickup Point']);
export const PaymentEnum = z.enum(['Sender', 'Recipient']);
export type TitleEnum = z.infer<typeof TitleEnum>;
export type DeliveryEnum = z.infer<typeof DeliveryEnum>;
export type PaymentEnum = z.infer<typeof PaymentEnum>;
// Constants
export const ROUTES = {
  PAGE0: 'page0',
  LOGIN: 'login',
  REGISTER: 'register',
  APP: 'app',
  SEND_PARCEL: 'send-parcel',
  PAGE5: 'page5',
  SUCCESS: 'success',
  ERROR: 'error',
  TRACKINGSLUG: 'tracking/:slug',
  TRACKING: 'tracking',
  PARCELS: 'my-parcels',
  DETAILS: 'details',
};

export const PARCEL_STATUS = {
  SCHEDULED: 'SCHEDULED',
  SHIPPING: 'SHIPPING',
  DELIVERED: 'DELIVERED',
  STUCK: 'STUCK',
};
