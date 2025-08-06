import z from 'zod';

import type { ParcelFormSchema, RecipientFormSchema } from './utils/parcelComposition';

// Zod enums
export const TitleEnum = z.enum(['Mr', 'Mrs', 'Ms', 'Dr', 'Prof']);
export const DeliveryEnum = z.enum(['Home', 'Pickup Point', 'Parcel Box']);
export const PaymentEnum = z.enum(['Sender', 'Recipient']);
export type TitleEnum = z.infer<typeof TitleEnum>;
export type DeliveryEnum = z.infer<typeof DeliveryEnum>;
export type PaymentEnum = z.infer<typeof PaymentEnum>;
// Constants
export const ROUTES = {
  PAGE0: 'page0',
  LOGIN: 'login',
  REGISTER: 'register',
  VERIFY: 'verify',
  VERIFIED: 'verified/:uid/:token',
  PASSWORDRESET: 'password-reset',
  NEWPASSWORD: 'new-password',
  APP: 'app',
  RECIPIENT_FORM: 'recipient-form',
  PARCEL_FORM: 'parcel-form',
  PAGE5: 'page5',
  SUCCESS: 'success',
  ERROR: 'error',
  TRACKINGSLUG: 'tracking/:slug',
  TRACKING: 'tracking',
  PARCELS: 'my-parcels',
  DETAILS: 'details',
  PROFILE: 'profile',
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

export const RECIPIENT_FORM_DEFAULT_VALUES: RecipientFormSchema = {
  title: '',
  name: '',
  phone: '',
  email: '',
  birthDate: null,
};

export const PARCEL_FORM_DEFAULT_VALUES: ParcelFormSchema = {
  line1: '',
  line2: '',
  apartment: '',
  city: '',
  postalCode: '',
  country: '',
  building: '',
  paymentType: '',
  deliveryType: 'Home',
  longitude: null,
  latitude: null,
  pointId: null,
};

export const PAYMENT_TYPE_NAME_CONVERTER: Record<string, string> = {
  [PaymentEnum.enum.Sender]: 'SENDER_PAYS',
  [PaymentEnum.enum.Recipient]: 'RECIPIENT_PAYS',
};

export const DELIVERY_TYPE_NAME_CONVERTER: Record<string, string> = {
  [DeliveryEnum.enum.Home]: 'HOME',
  [DeliveryEnum.enum['Pickup Point']]: 'PICKUP_POINT',
  [DeliveryEnum.enum['Parcel Box']]: 'PARCEL_BOX',
};

export const QUERY_STATUS = {
  SUCCESS: 'success',
  PENDING: 'pending',
  ERROR: 'error',
};

export const PARCEL_DELIVERY_STATUSES = {
  DELIVERED: 'DELIVERED',
  //add more if necessary
};
