import z from 'zod';

import type { Page1FormSchema, Page2FormSchema } from './utils/parcelComposition';

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
  PAGE1: 'page1',
  PAGE2: 'page2',
  PAGE3: 'page3',
  PAGE4: 'page4',
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

export const FIELD_PLACEHOLDERS: Record<string, string> = {
  'Mobile phone': '+36 111 111 1111',
  'Email address': 'email@example.com',
};

export const recipientFormDefaultValues: Page1FormSchema = {
  title: '',
  name: '',
  mobilePhone: '',
  emailAddress: '',
  dateOfBirth: null,
};

export const parcelFormDefaultValues: Page2FormSchema = {
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
