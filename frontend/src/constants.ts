import z from 'zod';

import type { ParcelFormSchema, RecipientFormSchema } from './utils/parcelComposition';

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
  RECIPIENT_FORM: 'recipient-form',
  PARCEL_FORM: 'parcel-form',
  PAGE5: 'page5',
  SUCCESS: 'success',
  ERROR: 'error',
  TRACKINGSLUG: 'tracking/:slug',
  TRACKING: 'tracking',
  PARCELS: 'my-parcels',
  DETAILS: 'details/:parcelId',
};

export const PARCEL_STATUS = {
  CREATED: 'CREATED',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  DELIVERY_ATTEMPTED: 'DELIVERY_ATTEMPTED',
  RETURNED_TO_SENDER: 'RETURNED_TO_SENDER',
};

export const mapboxAccessToken: string = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string;

export const FIELD_PLACEHOLDERS: Record<string, string> = {
  'Mobile phone': '+36 111 111 1111',
  'Email address': 'email@example.com',
};

export const recipientFormDefaultValues: RecipientFormSchema = {
  title: '',
  name: '',
  mobilePhone: '',
  emailAddress: '',
  dateOfBirth: null,
};

export const parcelFormDefaultValues: ParcelFormSchema = {
  addressName: '',
  line1: '',
  line2: '',
  apartment: '',
  city: '',
  postalCode: '',
  country: '',
  building: '',
  paymentType: '',
  deliveryType: 'Home',
};
