import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v4';

import { useFormContext } from '@/contexts/FormContext';

import { httpService } from '@/services/httpService';

import { parcelFormSchema, recipientFormSchema } from '@/utils/parcelComposition';

export const fullFormSchema = recipientFormSchema.extend(parcelFormSchema.shape);

// For GET requests
export const getParcelDataSchema = fullFormSchema.extend({
  id: z.number(),
});

export const addressOnlySchema = parcelFormSchema
  .omit({
    deliveryType: true,
    paymentType: true,
  })
  .extend({
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
  });

export const paymentDeliverySchema = parcelFormSchema.pick({
  deliveryType: true,
  paymentType: true,
});

export const createParcelRequestSchema = z.object({
  recipient: z.object({
    ...recipientFormSchema.shape,
    address: addressOnlySchema,
    birthDate: z
      .string()
      .transform((str) => new Date(str))
      .nullable(),
  }),
  ...paymentDeliverySchema.shape,
});

export const createParcelResponseSchema = createParcelRequestSchema.extend({
  id: z.uuid(),
  trackingCode: z.string(),
  currentStatus: z.string(),
  createdAt: z
    .string()
    .transform((str) => new Date(str))
    .nullable(),
  updatedAt: z
    .string()
    .transform((str) => new Date(str))
    .nullable(),
});

export type FullFormSchema = z.infer<typeof fullFormSchema>;
export type GetParcelDataSchema = z.infer<typeof getParcelDataSchema>;
export type CreateParcelRequestSchema = z.infer<typeof createParcelRequestSchema>;
export type CreateParcelResponseSchema = z.infer<typeof createParcelResponseSchema>;

const createParcel = (data: CreateParcelRequestSchema) => {
  return httpService.post('/parcels', createParcelResponseSchema, data);
};

export const useCreateParcel = () => {
  const formContext = useFormContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createParcel,
    onSuccess: async (data) => {
      console.log('Parcel created successfully:', data);
      await queryClient.invalidateQueries({ queryKey: ['parcels'] });
      formContext.resetForm();
    },
  });
};
