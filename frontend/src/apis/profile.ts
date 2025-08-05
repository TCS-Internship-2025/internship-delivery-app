import { queryClient } from '@/queryClient';
import { useMutation } from '@tanstack/react-query';
import z from 'zod';

import { httpService } from '@/services/httpService';

import {
  changeAddressFormSchema,
  changeProfileSchema,
  type ChangeAddressFormSchema,
  type ChangeProfileSchema,
} from '@/utils/changeDataComposition';

export const changePasswordSchema = z.object({ currentPassword: z.string(), newPassword: z.string() });
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
export const editAddress = (data: ChangeAddressFormSchema) => {
  return httpService.request('/me', changeAddressFormSchema, { method: 'PUT', body: JSON.stringify(data) });
};

export const editProfile = (data: ChangeProfileSchema) => {
  return httpService.request('/me', changeProfileSchema, { method: 'PUT', body: JSON.stringify(data) });
};
export const editPassword = (data: ChangePasswordData) => {
  return httpService.request('/me', changePasswordSchema, { method: 'PUT', body: JSON.stringify(data) });
};
export const useEditProfile = () => {
  return useMutation({
    mutationFn: editProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me-profile'] });
    },
  });
};

export const useEditAddress = () => {
  return useMutation({
    mutationFn: editAddress,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me-address'] });
    },
  });
};
export const useEditPassword = () => {
  return useMutation({
    mutationFn: editPassword,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me-password'] });
    },
  });
};
