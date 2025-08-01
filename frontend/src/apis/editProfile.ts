import { queryClient } from '@/queryClient';
import { useMutation } from '@tanstack/react-query';

import { httpService } from '@/services/httpService';

import {
  changeAddressFormSchema,
  changeProfileSchema,
  type ChangeAddressFormSchema,
  type ChangeProfileSchema,
} from '@/utils/changeDataComposition';

export const editAddress = (data: ChangeAddressFormSchema) => {
  return httpService.put('/me', changeAddressFormSchema, data);
};

export const editProfile = (data: ChangeProfileSchema) => {
  return httpService.put('/me', changeProfileSchema, data);
};

export const useEditProfile = () => {
  return useMutation({
    mutationFn: editProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};

export const useEditAddress = () => {
  return useMutation({
    mutationFn: editAddress,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};
