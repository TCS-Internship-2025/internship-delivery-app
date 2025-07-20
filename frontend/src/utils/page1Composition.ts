import { RandomEnum, TitleEnum } from '@/constants';
import z from 'zod';

import type { FieldConfig } from '@/components/FormSectionFields.tsx';

export const page1FormSchema = z.object({
  // Section 1 fields
  title: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.date().min(1),
  moreData: z.string().optional(),
  mobilePhone: z.string().min(1),
  emailAddress: z.string().optional(),

  // Section 2 fields
  parcelData1: z.string().min(1),
  parcelData2: z.string().min(3),
  parcelData3: z.string().optional(),
  parcelData4: z.date().optional(),
  parcelData5: z.date().optional(),
  weight: z.string().optional(),
  amount: z.string().optional(),

  // Section 3 fields
  description: z.string().optional(),
});

export type Page1FormSchema = z.infer<typeof page1FormSchema>;

export const beneficiaryFields: FieldConfig<Page1FormSchema>[][] = [
  [
    { name: 'title', label: 'Title', type: 'select', options: TitleEnum, sx: { flex: 0.3 }, rowGroup: 'name' },
    { name: 'firstName', label: 'First name', required: true, sx: { flex: 1 }, rowGroup: 'name' },
    { name: 'dateOfBirth', label: 'Date of birth', required: true, type: 'date' },
    { name: 'mobilePhone', label: 'Mobile phone', required: true },
  ],
  [
    { name: 'lastName', label: 'Last name', required: true },
    { name: 'moreData', label: 'More random stuff', type: 'select', options: RandomEnum },
    { name: 'emailAddress', label: 'Email address' },
  ],
];

export const parcelFields: FieldConfig<Page1FormSchema>[][] = [
  [
    { name: 'parcelData1', label: 'Parcel data 1' },
    { name: 'parcelData3', label: 'Parcel data 3', type: 'select', options: RandomEnum },
    { name: 'weight', label: 'Weight' },
    { name: 'parcelData5', label: 'Parcel data 5', type: 'radio', options: RandomEnum, orientation: 'horizontal' },
  ],
  [
    { name: 'parcelData2', label: 'Parcel data 2' },
    { name: 'parcelData4', label: 'Parcel data 4', type: 'date' },
    { name: 'amount', label: 'Amount' },
  ],
];

export const descriptionField: FieldConfig<Page1FormSchema>[][] = [
  [{ name: 'description', label: 'Other information', type: 'textarea' }],
];
