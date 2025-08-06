import { QueryClient, useMutation } from '@tanstack/react-query';
import z from 'zod';

import { httpService } from '@/services/httpService';

import { type ChangeAddressFormSchema, type ChangeProfileSchema } from '@/utils/changeDataComposition';

const queryClient = new QueryClient();
const response = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  address: z
    .object({
      line1: z.string(),
      line2: z.string(),
      building: z.string(),
      apartment: z.string(),
      city: z.string(),
      postalCode: z.string(),
      country: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    })
    .nullable(),
  isVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const changePasswordSchema = z.object({ currentPassword: z.string(), newPassword: z.string() });
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
export const editAddress = (data: ChangeAddressFormSchema) => {
  return httpService.request('/users/me', response, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

export const editProfile = (data: ChangeProfileSchema) => {
  return httpService.request('/users/me', response, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
export const editPassword = (data: ChangePasswordData) => {
  console.log(data);
  return httpService.request('/users/me', response, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
export const useEditProfile = () => {
  return useMutation({
    mutationFn: (data: ChangeProfileSchema) => editProfile(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profileInfo'] });
    },
  });
};

export const useEditAddress = () => {
  return useMutation({
    mutationFn: (data: ChangeAddressFormSchema) => editAddress(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profileInfo'] });
    },
  });
};
export const useEditPassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => editPassword(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profileInfo'] });
    },
  });
};
