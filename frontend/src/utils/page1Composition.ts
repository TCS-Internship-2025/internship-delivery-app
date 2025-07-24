import { DeliveryEnum, PaymentEnum, TitleEnum } from '@/constants';
import z from 'zod';

import type { FieldConfig } from '@/components/FormSectionFields.tsx';

export const page1FormSchema = z.object({
  // Section 1 fields
  title: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  mobilePhone: z.string().min(4, 'Mobile phone is required').regex(/^\d+$/, 'Mobile phone must contain only numbers'),
  emailAddress: z.email('Please enter a valid email address').optional().or(z.literal('')),

  // Section 2 fields
  Name: z.string().min(1),
  Line1: z.string().min(1),
  Line2: z.string().optional(),
  Building: z.string().min(1),
  Apartment: z.string().min(1),
  City: z.string().min(1),
  Postal_code: z.string().min(1),
  Country: z.string().min(1),

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
    { name: 'emailAddress', label: 'Email address' },
  ],
];

export const parcelFields: FieldConfig<Page1FormSchema>[][] = [
  [
    { name: 'Name', label: 'Address Name', required: true },
    { name: 'Line1', label: 'Address Line 1', required: true },
    { name: 'Building', label: 'Building', required: true },
    { name: 'Postal_code', label: 'ZIP/Postal Code', required: true },
  ],
  [
    { name: 'Country', label: 'Country', required: true },
    { name: 'Line2', label: 'Address Line 2' },
    { name: 'Apartment', label: 'Apartment', required: true },
    { name: 'City', label: 'City', required: true },
  ],
];

export const descriptionField: FieldConfig<Page1FormSchema>[][] = [
  [{ name: 'deliveryType', label: 'Delivery Type', type: 'select', options: DeliveryEnum, required: true }],
  [{ name: 'paymentType', label: 'Payment Type', type: 'select', options: PaymentEnum, required: true }],
];
