import { useQuery } from '@tanstack/react-query';
import z from 'zod/v4';

import { httpService } from '@/services/httpService';

const addressSchema = z.object({
  line1: z.string(),
  line2: z.string(),
  building: z.string().nullable(),
  apartment: z.string().nullable(),
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
  birthDate: z.string().nullable(),
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
