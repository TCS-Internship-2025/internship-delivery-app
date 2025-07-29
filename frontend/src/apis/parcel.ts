import { queryClient } from '@/queryClient';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod/v4';

import { useFormContext } from '@/contexts/FormContext';

import { httpService } from '@/services/httpService';

import { parcelFormSchema, recipientFormSchema } from '@/utils/parcelComposition';

export const fullFormSchema = recipientFormSchema.extend(parcelFormSchema.shape);

// For GET requests
export const getParcelDataSchema = fullFormSchema.extend({
  id: z.number(),
});
export const createParcelResponseSchema = z.object({
  message: z.string(),
  parcel: fullFormSchema.extend({
    dateOfBirth: z
      .string()
      .transform((str) => new Date(str))
      .nullable(),
  }),
});

export type FullFormSchema = z.infer<typeof fullFormSchema>;
export type GetParcelDataSchema = z.infer<typeof getParcelDataSchema>;
export type CreateParcelResponseSchema = z.infer<typeof createParcelResponseSchema>;

const createParcel = (data: FullFormSchema) => {
  return httpService.post('/createParcel', createParcelResponseSchema, data);
};

export const useCreateParcel = () => {
  const formContext = useFormContext();
  return useMutation({
    mutationFn: createParcel,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Parcels'] });
      //void navigate(`/${ROUTES.PAGE2}`);
      formContext.resetForm();
    },
  });
};
