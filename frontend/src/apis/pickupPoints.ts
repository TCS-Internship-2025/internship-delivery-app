import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { httpService } from '@/services/httpService';

export const addressSchema = z.object({
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
export const pickupPointSchema = z.object({
  id: z.string(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  deliveryType: z.literal('PICKUP_POINT'),
  address: addressSchema,
});

const pickupPointListSchema = z.array(pickupPointSchema);

export type PickupPoint = z.infer<typeof pickupPointSchema>;
export type PickupPointList = z.infer<typeof pickupPointListSchema>;

export async function fetchAllPickupPoints(): Promise<PickupPointList> {
  //Get token when its ready until get from postman
  const token = '';

  return await httpService.request('/api/locations?deliveryType=PICKUP_POINT', pickupPointListSchema, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function useGetAllPickupPoints() {
  return useQuery<PickupPointList>({
    queryKey: ['pickupPoints'],
    queryFn: fetchAllPickupPoints,
  });
}
