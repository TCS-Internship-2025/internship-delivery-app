import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import z from 'zod/v4';

import { httpService } from '@/services/httpService';

const addressSchema = z.object({
  line1: z.string(),
  line2: z.string(),
  building: z.string(),
  apartment: z.string(),
  city: z.string(),
  postalCode: z.string(),
  country: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export const recipientSchema = z.object({
  name: z.string(),
  email: z.email(),
  phone: z.string(),
  birthDate: z.string(),
  address: addressSchema,
});

export const parcelSchema = z.object({
  id: z.string(),
  trackingCode: z.string(),
  recipient: recipientSchema,
  currentStatus: z.string(),
  deliveryType: z.string(),
  paymentType: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const parcelListSchema = z.array(parcelSchema);

export type ParcelData = z.infer<typeof parcelSchema>;
export type ParcelListData = z.infer<typeof parcelListSchema>;

export async function fetchAllParcelData(JWTtoken: string | null): Promise<ParcelListData> {
  return await httpService.request(`/parcels`, parcelListSchema, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${JWTtoken}`,
    },
  });
}

export function useGetAllParcels(JWTtoken: string | null) {
  return useQuery<ParcelListData>({
    queryKey: ['parcels'],
    queryFn: () => fetchAllParcelData(JWTtoken),
  });
}

export async function fetchParcelData(parcelId: string | undefined, JWTtoken: string | null): Promise<ParcelData> {
  return await httpService.request(`/parcels/${parcelId}`, parcelSchema, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${JWTtoken}`,
    },
  });
}

export function useGetParcelById(id: string | undefined, JWTtoken: string | null) {
  return useQuery<ParcelData>({
    queryKey: ['parcels', id],
    queryFn: () => fetchParcelData(id, JWTtoken),
    enabled: !!id,
  });
}

export async function deleteParcelData(parcelId: string | undefined): Promise<ParcelData> {
  return await httpService.delete(`/api/parcels/${parcelId}`, parcelSchema);
}

export function useDeleteParcelById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (parcelId: string) => deleteParcelData(parcelId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['parcels'] });
    },
  });
}
