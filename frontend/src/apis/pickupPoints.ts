import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { addressOnlySchema } from '@/apis/parcel';
import { httpService } from '@/services/httpService';

export type DeliveryType = 'PICKUP_POINT' | 'PARCEL_BOX';

interface PickupPointSearchParams {
  deliveryType?: DeliveryType;
}

export const pickupPointSchema = z.object({
  id: z.string(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  deliveryType: z.literal('PICKUP_POINT').or(z.literal('PARCEL_BOX')),
  address: addressOnlySchema,
});

const pickupPointListSchema = z.array(pickupPointSchema);
export type PickupPoint = z.infer<typeof pickupPointSchema>;
export type PickupPointList = z.infer<typeof pickupPointListSchema>;
export async function fetchPickupPoints(
  JWTtoken: string | null,
  searchParams: PickupPointSearchParams = {}
): Promise<PickupPointList> {
  const token = JWTtoken;

  const query = new URLSearchParams(searchParams as Record<string, string>).toString();
  return await httpService.request(`/locations?${query}`, pickupPointListSchema, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function useGetAllPickupPoints(JWTtoken: string | null, searchParams: PickupPointSearchParams = {}) {
  return useQuery<PickupPointList>({
    queryKey: ['pickupPoints', searchParams],
    queryFn: () => fetchPickupPoints(JWTtoken, searchParams),
  });
}
