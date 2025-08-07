import { DeliveryEnum, PaymentEnum, TitleEnum } from '@/constants';
import z from 'zod';

import type { FieldConfig } from '@/components/FormSectionFields.tsx';

const REGEX_PATTERNS = {
  HUNGARIAN_NAME: /^[a-zA-ZÁÉÍÓÚÜÖŐŰáéíóúüöőű\s'-]+$/,
  HUNGARIAN_PHONE: /^(\+36|06)\s?([1-9][0-9])\s?[0-9]{3}\s?[0-9]{4}$/,
  HUNGARY_ONLY: /^hungary$/i,
  POSTAL_CODE: /^\d{4}$/,
  HUNGARIAN_TEXT_WITH_SYMBOLS: /^[a-zA-Z0-9ÁÉÍÓÚÜÖŐŰáéíóúüöőű .,-]*$/,
  HUNGARIAN_TEXT_REQUIRED: /^[a-zA-Z0-9ÁÉÍÓÚÜÖŐŰáéíóúüöőű .,-]+$/,
  HUNGARIAN_CITY: /^[a-zA-ZÁÉÍÓÚÜÖŐŰáéíóúüöőű]+$/,
} as const;

export const MIN_BIRTH_DATE = new Date('1900-01-01');
export const MAX_BIRTH_DATE = new Date();
MAX_BIRTH_DATE.setFullYear(MAX_BIRTH_DATE.getFullYear() - 18);

export const recipientFormSchema = z.object({
  // Section 1 fields
  title: z.string().optional(),
  name: z
    .string()
    .min(1, 'Full name is required')
    .regex(REGEX_PATTERNS.HUNGARIAN_NAME, 'Name can only contain letters, spaces, and apostrophes')
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters'),
  birthDate: z
    .date('Date of birth is required')
    .min(MIN_BIRTH_DATE, 'Date of birth cannot be before January 1, 1900')
    .max(MAX_BIRTH_DATE, 'You must be at least 18 years old')
    .nullable(),
  phone: z
    .string()
    .min(1, 'Mobile phone is required')
    .regex(REGEX_PATTERNS.HUNGARIAN_PHONE, 'Please enter a valid Hungarian phone number'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email address is too long'),
});

export const parcelFormSchema = z.object({
  // Section 2 fields
  building: z
    .string()
    .trim()
    .regex(REGEX_PATTERNS.HUNGARIAN_TEXT_WITH_SYMBOLS, 'Invalid building name')
    .optional()
    .nullable(),
  country: z.string().trim().regex(REGEX_PATTERNS.HUNGARY_ONLY, 'We only deliver in Hungary'),
  postalCode: z.string().regex(REGEX_PATTERNS.POSTAL_CODE, 'Invalid zip code'),
  apartment: z
    .string()
    .trim()
    .regex(REGEX_PATTERNS.HUNGARIAN_TEXT_WITH_SYMBOLS, 'Invalid apartment name')
    .optional()
    .nullable(),
  line1: z.string().trim().regex(REGEX_PATTERNS.HUNGARIAN_TEXT_REQUIRED, 'Invalid address line 1'),
  city: z.string().trim().regex(REGEX_PATTERNS.HUNGARIAN_CITY, 'Invalid city name'),
  line2: z.string().trim().regex(REGEX_PATTERNS.HUNGARIAN_TEXT_WITH_SYMBOLS, 'Invalid address line 2').optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),

  // Section 3 fields
  paymentType: z.string().min(1, 'Payment Type is required'),
  deliveryType: z.string().min(1, 'Delivery Type is required'),
  //Using this for map
  pointId: z.string().optional().nullable(),
});

export const pointSchema = parcelFormSchema.pick({
  latitude: true,
  longitude: true,
  pointId: true,
});

export const addressChangeSchema = parcelFormSchema.omit({ paymentType: true }).extend({
  requestReason: z.string().optional().nullable(),
});

export type RecipientFormSchema = z.infer<typeof recipientFormSchema>;
export type ParcelFormSchema = z.infer<typeof parcelFormSchema>;
export type AddressChangeSchema = z.infer<typeof addressChangeSchema>;
export type PointSchema = z.infer<typeof pointSchema>;

export const recipientFields: FieldConfig<RecipientFormSchema>[][] = [
  [
    { name: 'title', label: 'Title', type: 'select', options: TitleEnum, sx: { flex: 0.3 }, rowGroup: 'name' },
    { name: 'name', label: 'Full name', required: true, sx: { flex: 1 }, rowGroup: 'name' },
    { name: 'phone', label: 'Mobile phone', required: true },
    { name: 'email', label: 'Email address', required: true },
    { name: 'birthDate', label: 'Date of birth', type: 'date', minDate: MIN_BIRTH_DATE, maxDate: MAX_BIRTH_DATE },
  ],
];

const addressFields = [
  [
    { name: 'country', label: 'Country', required: true },
    { name: 'line1', label: 'Address Line 1', required: true },
    { name: 'line2', label: 'Address Line 2' },
    { name: 'building', label: 'Building' },
  ],
  [
    { name: 'postalCode', label: 'ZIP/Postal Code', required: true },
    { name: 'city', label: 'City', required: true },
    { name: 'apartment', label: 'Apartment' },
  ],
];

export const parcelFields = addressFields as FieldConfig<ParcelFormSchema>[][];
export const addressChangeFields = addressFields as FieldConfig<AddressChangeSchema>[][];

export const shippingOptionsField: FieldConfig<ParcelFormSchema>[][] = [
  [{ name: 'deliveryType', label: 'Delivery Type', type: 'select', options: DeliveryEnum, required: true }],
  [{ name: 'paymentType', label: 'Payment Type', type: 'select', options: PaymentEnum, required: true }],
];

export const deliveryOnlyField: FieldConfig<AddressChangeSchema>[][] = [
  [{ name: 'deliveryType', label: 'Delivery Type', type: 'select', options: DeliveryEnum, required: true }],
];

export const requestReasonField: FieldConfig<AddressChangeSchema>[][] = [
  [{ name: 'requestReason', label: 'Description', type: 'textarea' }],
];
