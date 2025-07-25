import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { queryClient } from '@/queryClient';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod/v4';

import { httpService } from '@/services/httpService';

import { page1FormSchema as parcelFormSchema } from '@/utils/parcelComposition';

// For GET requests
export const ParcelSchema = parcelFormSchema.extend({
  id: z.number(),
});
export const CreateParcelResponseSchema = z.object({
  message: z.string(),
  parcel: parcelFormSchema,
});
export type parcelFromSchema = z.infer<typeof parcelFormSchema>;
export type CreateParcelResponseSchema = z.infer<typeof CreateParcelResponseSchema>;

const createParcel = (data: parcelFromSchema) => {
  return httpService.post('/createParcel', CreateParcelResponseSchema, data);
};

export const useCreateParcel = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createParcel,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Parcels'] });
      void navigate(`/${ROUTES.PAGE2}`);
    },
  });
};
