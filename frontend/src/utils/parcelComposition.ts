import { DeliveryEnum, PaymentEnum, TitleEnum } from '@/constants';
import z from 'zod';

import type { FieldConfig } from '@/components/FormSectionFields.tsx';

export const MIN_BIRTH_DATE = new Date('1900-01-01');
export const MAX_BIRTH_DATE = new Date();
MAX_BIRTH_DATE.setFullYear(MAX_BIRTH_DATE.getFullYear() - 18);

export const recipientFormSchema = z.object({
  // Section 1 fields
  title: z.string().optional(),
  name: z.string().min(1, 'Full name is required'),
  dateOfBirth: z
    .date('Date of birth is required')
    .min(MIN_BIRTH_DATE, 'Date of birth cannot be before January 1, 1900')
    .max(MAX_BIRTH_DATE, 'You must be at least 18 years old')
    .nullable(),
  mobilePhone: z
    .string()
    .min(1, 'Mobile phone is required')
    .regex(/^(?:(\+36|06)\s?)?([1-9][0-9])\s?[0-9]{3}\s?[0-9]{4}$/, 'Please enter a valid Hungarian phone number'),
  emailAddress: z.email('Please enter a valid email address').min(1),
});

export const parcelFormSchema = z.object({
  // Section 2 fields
  addressName: z.string().min(1, 'Address Name is required'),
  line1: z.string().min(1, 'Address Line 1 is required'),
  line2: z.string().optional(),
  building: z.string().min(1, 'Building is required'),
  apartment: z.string().min(1, 'Apartment is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'ZIP/POSTAL Code is required'),
  country: z.string().min(1, 'Country is required'),

  // Section 3 fields
  paymentType: z.string().min(1, 'Payment Type is required'),
  deliveryType: z.string().min(1, 'Payment Type is required'),
});

export type RecipientFormSchema = z.infer<typeof recipientFormSchema>;
export type ParcelFormSchema = z.infer<typeof parcelFormSchema>;

export const recipientFields: FieldConfig<RecipientFormSchema>[][] = [
  [
    { name: 'title', label: 'Title', type: 'select', options: TitleEnum, sx: { flex: 0.3 }, rowGroup: 'name' },
    { name: 'name', label: 'Full name', required: true, sx: { flex: 1 }, rowGroup: 'name' },
    { name: 'mobilePhone', label: 'Mobile phone', required: true },
    { name: 'emailAddress', label: 'Email address', required: true },
    { name: 'dateOfBirth', label: 'Date of birth', type: 'date', minDate: MIN_BIRTH_DATE, maxDate: MAX_BIRTH_DATE },
  ],
];

export const parcelFields: FieldConfig<ParcelFormSchema>[][] = [
  [
    { name: 'addressName', label: 'Address Name', required: true },
    { name: 'building', label: 'Building', required: true },
    { name: 'postalCode', label: 'ZIP/Postal Code', required: true },
    { name: 'line1', label: 'Address Line 1', required: true },
  ],
  [
    { name: 'country', label: 'Country', required: true },
    { name: 'apartment', label: 'Apartment', required: true },
    { name: 'city', label: 'City', required: true },
    { name: 'line2', label: 'Address Line 2' },
  ],
];

export const shippingOptionsField: FieldConfig<ParcelFormSchema>[][] = [
  [{ name: 'deliveryType', label: 'Delivery Type', type: 'select', options: DeliveryEnum, required: true }],
  [{ name: 'paymentType', label: 'Payment Type', type: 'select', options: PaymentEnum, required: true }],
];
