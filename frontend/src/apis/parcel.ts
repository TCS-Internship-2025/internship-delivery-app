import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v4';

import { useAuth } from '@/contexts/AuthContext';
import { useFormContext } from '@/contexts/FormContext';

import { httpService } from '@/services/httpService';

import { parcelFormSchema, recipientFormSchema } from '@/utils/parcelComposition';

export const fullFormSchema = recipientFormSchema.extend(parcelFormSchema.shape);

// For GET requests
export const getParcelDataSchema = fullFormSchema.extend({
  id: z.number(),
});

export const addressOnlySchema = parcelFormSchema.omit({
  deliveryType: true,
  paymentType: true,
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
export type AddressOnlySchema = z.infer<typeof addressOnlySchema>;

const createParcel = (data: CreateParcelRequestSchema, JWTtoken: string | null) => {
  return httpService.request('/parcels', createParcelResponseSchema, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JWTtoken}`,
    },
  });
};

export const useCreateParcel = () => {
  const formContext = useFormContext();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (data: CreateParcelRequestSchema) => createParcel(data, token),
    onSuccess: async (data) => {
      console.log('Parcel created successfully:', data);
      await queryClient.invalidateQueries({ queryKey: ['parcels'] });
      formContext.resetForm();
    },
  });
};
