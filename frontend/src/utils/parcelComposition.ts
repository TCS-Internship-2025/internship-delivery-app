import { DeliveryEnum, PaymentEnum, TitleEnum } from '@/constants';
import z from 'zod';

import type { FieldConfig } from '@/components/FormSectionFields.tsx';

export const page1FormSchema = z.object({
  // Section 1 fields
  title: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  mobilePhone: z
    .string()
    .min(4, 'Mobile phone is required')
    .regex(/^(?:(\+36|06)\s?)?([1-9][0-9])\s?[0-9]{3}\s?[0-9]{4}$/, 'Please enter a valid Hungarian phone number'),
  emailAddress: z.string().email('Please enter a valid email address').min(1),

  // Section 2 fields
  name: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  building: z.string().min(1),
  apartment: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),

  // Section 3 fields
  paymentType: z.string().min(1),
  deliveryType: z.string().min(1),
});

export type Page1FormSchema = z.infer<typeof page1FormSchema>;

export const beneficiaryFields: FieldConfig<Page1FormSchema>[][] = [
  [
    { name: 'title', label: 'Title', type: 'select', options: TitleEnum, sx: { flex: 0.3 }, rowGroup: 'name' },
    { name: 'firstName', label: 'First name', required: true, sx: { flex: 1 }, rowGroup: 'name' },
    { name: 'mobilePhone', label: 'Mobile phone', required: true },
  ],
  [
    { name: 'lastName', label: 'Last name', required: true },
    { name: 'emailAddress', label: 'Email address', required: true },
  ],
];

export const parcelFields: FieldConfig<Page1FormSchema>[][] = [
  [
    { name: 'name', label: 'Address Name', required: true },
    { name: 'line1', label: 'Address Line 1', required: true },
    { name: 'building', label: 'Building', required: true },
    { name: 'postalCode', label: 'ZIP/Postal Code', required: true },
  ],
  [
    { name: 'country', label: 'Country', required: true },
    { name: 'line2', label: 'Address Line 2' },
    { name: 'apartment', label: 'Apartment', required: true },
    { name: 'city', label: 'City', required: true },
  ],
];

export const descriptionField: FieldConfig<Page1FormSchema>[][] = [
  [{ name: 'deliveryType', label: 'Delivery Type', type: 'select', options: DeliveryEnum, required: true }],
  [{ name: 'paymentType', label: 'Payment Type', type: 'select', options: PaymentEnum, required: true }],
];
