import { DeliveryEnum, PaymentEnum, TitleEnum } from '@/constants';
import z from 'zod';

import type { FieldConfig } from '@/components/FormSectionFields.tsx';

export const MIN_BIRTH_DATE = new Date('1900-01-01');
export const MAX_BIRTH_DATE = new Date();
MAX_BIRTH_DATE.setFullYear(MAX_BIRTH_DATE.getFullYear() - 18);

export const recipientFormSchema = z.object({
  // Section 1 fields
  title: z
    .string()
    .regex(/^(Mr|Mrs|Ms|Dr|Prof)\.?$/i, 'Please select a valid title')
    .optional(),
  name: z
    .string()
    .min(1, 'Full name is required')
    .regex(/^[a-zA-ZÁÉÍÓÚÜÖŐŰáéíóúüöőű\s'-]+$/, 'Name can only contain letters, spaces, and apostrophes')
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
    .regex(/^(?:(\+36|06)\s?)?([1-9][0-9])\s?[0-9]{3}\s?[0-9]{4}$/, 'Please enter a valid Hungarian phone number'),
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
    .regex(/^[a-zA-Z0-9ÁÉÍÓÚÜÖŐŰáéíóúüöőű .,-]*$/, 'Invalid building name')
    .optional(),
  country: z
    .string()
    .trim()
    .regex(/^hungary$/i, 'We only deliver in Hungary'),
  postalCode: z.string().regex(/^\d{4}$/, 'Invalid zip code'),
  apartment: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9ÁÉÍÓÚÜÖŐŰáéíóúüöőű .,-]*$/, 'Invalid apartment name')
    .optional(),
  line1: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9ÁÉÍÓÚÜÖŐŰáéíóúüöőű .,-]+$/, 'Invalid address line 1'),
  city: z
    .string()
    .trim()
    .regex(/^[a-zA-ZÁÉÍÓÚÜÖŐŰáéíóúüöőű]+$/, 'Invalid city name'),
  line2: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9ÁÉÍÓÚÜÖŐŰáéíóúüöőű .,-]*$/, 'Invalid address line 2')
    .optional(),

  // Section 3 fields
  paymentType: z.string().min(1, 'Payment Type is required'),
  deliveryType: z.string().min(1, 'Delivery Type is required'),
});

export type RecipientFormSchema = z.infer<typeof recipientFormSchema>;
export type ParcelFormSchema = z.infer<typeof parcelFormSchema>;

export const recipientFields: FieldConfig<RecipientFormSchema>[][] = [
  [
    { name: 'title', label: 'Title', type: 'select', options: TitleEnum, sx: { flex: 0.3 }, rowGroup: 'name' },
    { name: 'name', label: 'Full name', required: true, sx: { flex: 1 }, rowGroup: 'name' },
    { name: 'phone', label: 'Mobile phone', required: true },
    { name: 'email', label: 'Email address', required: true },
    { name: 'birthDate', label: 'Date of birth', type: 'date', minDate: MIN_BIRTH_DATE, maxDate: MAX_BIRTH_DATE },
  ],
];

export const parcelFields: FieldConfig<ParcelFormSchema>[][] = [
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

export const shippingOptionsField: FieldConfig<ParcelFormSchema>[][] = [
  [{ name: 'deliveryType', label: 'Delivery Type', type: 'select', options: DeliveryEnum, required: true }],
  [{ name: 'paymentType', label: 'Payment Type', type: 'select', options: PaymentEnum, required: true }],
];
