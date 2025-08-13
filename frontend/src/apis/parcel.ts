import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v4';

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
  pointId: true,
});

export const paymentDeliverySchema = parcelFormSchema.pick({
  deliveryType: true,
  paymentType: true,
});

export const createParcelRequestSchema = z.object({
  recipient: z.object({
    ...recipientFormSchema.shape,
    birthDate: z
      .string()
      .transform((str) => new Date(str))
      .nullable(),
  }),
  address: addressOnlySchema,
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

export const updateParcelAddressRequestSchema = z.object({
  newAddress: addressOnlySchema,
  deliveryType: z.string(),
  requestReason: z.string().optional().nullable(),
});

export const updateParcelAddressResponseSchema = addressOnlySchema;

export type FullFormSchema = z.infer<typeof fullFormSchema>;
export type GetParcelDataSchema = z.infer<typeof getParcelDataSchema>;
export type CreateParcelRequestSchema = z.infer<typeof createParcelRequestSchema>;
export type CreateParcelResponseSchema = z.infer<typeof createParcelResponseSchema>;
export type AddressOnlySchema = z.infer<typeof addressOnlySchema>;
export type UpdateParcelAddressRequestSchema = z.infer<typeof updateParcelAddressRequestSchema>;
export type UpdateParcelAddressResponseSchema = z.infer<typeof updateParcelAddressResponseSchema>;

const createParcel = (data: CreateParcelRequestSchema) => {
  return httpService.request('/parcels', createParcelResponseSchema, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const useCreateParcel = () => {
  const formContext = useFormContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateParcelRequestSchema) => createParcel(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['parcels'], type: 'all' });
      formContext.resetForm();
    },
  });
};

export const updateParcelAddress = (data: UpdateParcelAddressRequestSchema, id?: string) => {
  return httpService.request(`/parcels/${id}/address`, updateParcelAddressResponseSchema, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
export const useUpdateParcelAddress = () => {
  const queryClient = useQueryClient();

  interface mutationProps {
    data: UpdateParcelAddressRequestSchema;
    id?: string;
    slug?: string;
  }

  return useMutation({
    mutationFn: ({ data, id }: mutationProps) => updateParcelAddress(data, id),
    onSuccess: async (_data, variables) => {
      let queryKey = ['parcels', variables.id];
      if (variables.slug) {
        queryKey = ['parcels', variables.id, 'tracking', variables.slug];
      }
      await queryClient.invalidateQueries({
        queryKey: queryKey,
        type: 'all',
      });
    },
  });
};

export const addressNullSchema = addressOnlySchema.extend({
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
});

export const parcelSchema = createParcelRequestSchema.extend({
  id: z.string(),
  recipient: z.object({
    ...recipientFormSchema.shape,
    birthDate: z.string().nullable(),
  }),
  address: addressNullSchema,
  trackingCode: z.string(),
  currentStatus: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const parcelListSchema = z.array(parcelSchema);
export type AddressNullData = z.infer<typeof addressNullSchema>;
export type ParcelData = z.infer<typeof parcelSchema>;
export type ParcelListData = z.infer<typeof parcelListSchema>;

export async function fetchAllParcelData(): Promise<ParcelListData> {
  return await httpService.get('/parcels', parcelListSchema);
}

export function useGetAllParcels() {
  return useQuery<ParcelListData>({
    queryKey: ['parcels'],
    queryFn: fetchAllParcelData,
  });
}

export async function fetchParcelData(parcelId: string | undefined): Promise<ParcelData> {
  return await httpService.get(`/parcels/${parcelId}`, parcelSchema);
}

export function useGetParcelById(id: string | undefined) {
  return useQuery<ParcelData>({
    queryKey: ['parcels', id],
    queryFn: () => fetchParcelData(id),
    enabled: !!id,
  });
}
