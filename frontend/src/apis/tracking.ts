import { useQuery } from '@tanstack/react-query';
import z from 'zod/v4';

import { httpService } from '@/services/httpService';

export const trackSchema = z.object({
  trackingCode: z.string(),
  status: z.string(),
  parcel: z.object({
    id: z.string(),
    senderId: z.string(),
    recipientId: z.string(),
    deliveryType: z.string(),
    paymentType: z.string(),
    currentStatus: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  timeline: z.array(
    z.object({
      id: z.string(),
      parcelId: z.string(),
      status: z.string(),
      description: z.string(),
      timestamp: z.string(),
    })
  ),
});
export type TrackingData = z.infer<typeof trackSchema>;
export async function fetchTrackingData(trackingNumber: string | undefined): Promise<TrackingData> {
  return await httpService.get(`tracking/${trackingNumber}`, trackSchema);
}

export function useTracking(slug: string | undefined) {
  return useQuery<TrackingData>({
    queryKey: ['tracking', slug],
    queryFn: () => fetchTrackingData(slug),
    enabled: !!slug,
  });
}
