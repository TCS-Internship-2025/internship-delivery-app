import { queryClient } from '@/queryClient';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod/v4';

import { httpService } from '@/services/httpService';

import { page1FormSchema, page2FormSchema } from '@/utils/parcelComposition';

export const FullParcelFormSchema = page1FormSchema.extend(page2FormSchema.shape);

// For GET requests
export const ParcelSchema = FullParcelFormSchema.extend({
  id: z.number(),
});
export const CreateParcelResponseSchema = z.object({
  message: z.string(),
  parcel: FullParcelFormSchema.extend({
    dateOfBirth: z
      .string()
      .transform((str) => new Date(str))
      .nullable(),
  }),
});

export type ParcelFormSchema = z.infer<typeof FullParcelFormSchema>;
export type CreateParcelResponseSchema = z.infer<typeof CreateParcelResponseSchema>;

const createParcel = (data: ParcelFormSchema) => {
  return httpService.post('/createParcel', CreateParcelResponseSchema, data);
};

export const useCreateParcel = () => {
  return useMutation({
    mutationFn: createParcel,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Parcels'] });
      //void navigate(`/${ROUTES.PAGE2}`);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
