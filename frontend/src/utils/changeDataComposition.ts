import z from 'zod';

import type { FieldConfig } from '@/components/FormSectionFields.tsx';

export const MIN_BIRTH_DATE = new Date('1900-01-01');
export const MAX_BIRTH_DATE = new Date();
MAX_BIRTH_DATE.setFullYear(MAX_BIRTH_DATE.getFullYear() - 18);
export const changePasswordSchema = z.object({ current: z.string(), new: z.string(), confirm: z.string() });
export const changeProfileSchema = z.object({
  title: z.string().optional(),
  name: z.string().min(1, 'Full name is required'),
  mobilePhone: z
    .string()
    .min(1, 'Mobile phone is required')
    .regex(/^(?:(\+36|06)\s?)?([1-9][0-9])\s?[0-9]{3}\s?[0-9]{4}$/, 'Please enter a valid Hungarian phone number'),
  emailAddress: z.email('Please enter a valid email address').min(1),
});

export const changeAddressFormSchema = z.object({
  address: z.object({
    addressName: z.string().min(1, 'Address Name is required'),
    line1: z.string().min(1, 'Address Line 1 is required'),
    line2: z.string().optional(),
    building: z.string().min(1, 'Building is required'),
    apartment: z.string().min(1, 'Apartment is required'),
    city: z.string().min(1, 'City is required'),
    postalCode: z.string().min(1, 'ZIP/POSTAL Code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
});

export interface ChangePasswordFormData {
  confirmPassword: string;
  newPassword: string;
  currentPassword: string;
}
export type ChangeProfileSchema = z.infer<typeof changeProfileSchema>;
export type ChangeAddressFormSchema = z.infer<typeof changeAddressFormSchema>;
export interface EditProfileFormData {
  name: string;
  emailAddress: string;
  mobilePhone: string;
  title: string;
}
export interface ModalProps {
  open: boolean;
  handleClose: () => void;
  formData?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    addressName?: string;
    building?: string;
    postalCode?: string;
    line1?: string;
    country?: string;
    apartment?: string;
    city?: string;
    line2?: string;
  };
}

export const changeProfileFields: FieldConfig<ChangeProfileSchema>[][] = [
  [
    { name: 'name', label: 'Full name', required: true, sx: { flex: 1 }, rowGroup: 'name' },
    { name: 'mobilePhone', label: 'Mobile phone', required: true },
    { name: 'emailAddress', label: 'Email address', required: true },
  ],
];
export const changeAddressFields: FieldConfig<ChangeAddressFormSchema>[][] = [
  [
    { name: 'address.addressName', label: 'Address Name', required: true },
    { name: 'address.building', label: 'Building', required: true },
    { name: 'address.postalCode', label: 'ZIP/Postal Code', required: true },
    { name: 'address.line1', label: 'Address Line 1', required: true },
    { name: 'address.country', label: 'Country', required: true },
    { name: 'address.apartment', label: 'Apartment', required: true },
    { name: 'address.city', label: 'City', required: true },
    { name: 'address.line2', label: 'Address Line 2' },
  ],
];
