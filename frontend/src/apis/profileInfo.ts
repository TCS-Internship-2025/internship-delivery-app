import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { z } from 'zod';

import { httpService } from '@/services/httpService';

import type { ChangeAddressFormSchema, ChangeProfileSchema } from '@/utils/changeDataComposition';

export const addressSchema = z.object({
  line1: z.string(),
  line2: z.string(),
  building: z.string().nullable(),
  apartment: z.string().nullable(),
  city: z.string(),
  postalCode: z.string(),
  country: z.string(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

export const profileSchema = z.object({
  name: z.string(),
  email: z.email(),
  phone: z.string().nullable(),
  address: addressSchema.nullable(),
  isVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Profile = z.infer<typeof profileSchema>;

export async function fetchProfileInfo(): Promise<Profile> {
  return await httpService.get(`/users/me`, profileSchema);
}

export function useGetProfileInfo() {
  return useQuery<Profile>({
    queryKey: ['profileInfo'],
    queryFn: () => fetchProfileInfo(),
  });
}
const response = z.object({
  name: z.string(),
  email: z.email(),
  phone: z.string().nullable(),
  address: addressSchema.nullable(),
  isVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
const changeReq = async (data: ChangeAddressFormSchema | ChangePasswordData | ChangeProfileSchema) => {
  await httpService.request('/users/me', response, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
export const changePasswordSchema = z.object({ currentPassword: z.string(), newPassword: z.string() });
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
export const editAddress = (data: ChangeAddressFormSchema) => {
  return changeReq(data);
};

export const editProfile = (data: ChangeProfileSchema) => {
  return changeReq(data);
};
export const editPassword = (data: ChangePasswordData) => {
  return changeReq(data);
};
export const useEditProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChangeProfileSchema) => editProfile(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profileInfo'] });
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
    },
  });
};

export const useEditAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChangeAddressFormSchema) => editAddress(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profileInfo'] });
      enqueueSnackbar('Address updated successfully', { variant: 'success' });
    },
  });
};
export const useEditPassword = (clearFields: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChangePasswordData) => editPassword(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profileInfo'] });
      enqueueSnackbar('Password updated successfully', { variant: 'success' });
      clearFields();
    },
  });
};
