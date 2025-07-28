import { DeliveryEnum, PaymentEnum, TitleEnum } from '@/constants';
import z from 'zod';

import type { FieldConfig } from '@/components/FormSectionFields.tsx';

export const page1FormSchema = z.object({
  // Section 1 fields
  title: z.string().optional(),
  name: z.string().min(1, 'Full name is required'),
  dateOfBirth: z.date('Date of birth is required').min(1),
  mobilePhone: z
    .string()
    .min(1, 'Mobile phone is required')
    .regex(/^(?:(\+36|06)\s?)?([1-9][0-9])\s?[0-9]{3}\s?[0-9]{4}$/, 'Please enter a valid Hungarian phone number'),
  emailAddress: z.email('Please enter a valid email address').min(1),
});

export const page2FormSchema = z.object({
  // Section 2 fields
  name: z.string().min(1, 'Address Name is required'),
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

export type Page1FormSchema = z.infer<typeof page1FormSchema>;
export type Page2FormSchema = z.infer<typeof page2FormSchema>;

export const beneficiaryFields: FieldConfig<Page1FormSchema>[][] = [
  [
    { name: 'title', label: 'Title', type: 'select', options: TitleEnum, sx: { flex: 0.3 }, rowGroup: 'name' },
    { name: 'name', label: 'Full name', required: true, sx: { flex: 1 }, rowGroup: 'name' },
    { name: 'mobilePhone', label: 'Mobile phone', required: true },
    { name: 'emailAddress', label: 'Email address', required: true },
    { name: 'dateOfBirth', label: 'Date of birth', required: true, type: 'date' },
  ],
];

export const parcelFields: FieldConfig<Page2FormSchema>[][] = [
  [
    { name: 'name', label: 'Address Name', required: true },
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

export const descriptionField: FieldConfig<Page2FormSchema>[][] = [
  [{ name: 'deliveryType', label: 'Delivery Type', type: 'select', options: DeliveryEnum, required: true }],
  [{ name: 'paymentType', label: 'Payment Type', type: 'select', options: PaymentEnum, required: true }],
];
