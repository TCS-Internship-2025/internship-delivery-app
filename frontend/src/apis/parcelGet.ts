import { useQuery } from '@tanstack/react-query';
import z from 'zod/v4';

import { httpService } from '@/services/httpService';

export const parcelSchema = z.object({
  id: z.string(),
  sender: z.string(),
  recipient: z.string(),
  delivery: z.string(),
  tracking: z.string(),
  status: z.string(),
  created: z.date(),
  updated: z.date(),
});

export const parcelListSchema = z.array(parcelSchema);

export type ParcelData = z.infer<typeof parcelSchema>;
export type ParcelListData = z.infer<typeof parcelListSchema>;

export async function fetchAllParcelData(): Promise<ParcelListData> {
  return await httpService.get('api/parcels', parcelListSchema);
}

export function useGetAllParcels() {
  return useQuery<ParcelListData>({
    queryKey: ['parcels'],
    queryFn: () => fetchAllParcelData(),
  });
}

export async function fetchParcelData(parcelId: string | undefined): Promise<ParcelData> {
  return await httpService.get(`api/parcels/${parcelId}`, parcelSchema);
}

export function useGetParcelById(id: string | undefined) {
  return useQuery<ParcelData>({
    queryKey: ['parcels', id],
    queryFn: () => fetchParcelData(id),
    enabled: !!id,
  });
}

export async function deleteParcelData(parcelId: string | undefined): Promise<ParcelData> {
  return await httpService.delete(`api/parcels/${parcelId}`, parcelSchema);
}

export function useDeleteParcelById(id: string | undefined) {
  return useQuery<ParcelData>({
    queryKey: ['parcels', id],
    queryFn: () => deleteParcelData(id),
    enabled: !!id,
  });
}
