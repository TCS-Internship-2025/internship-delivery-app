import { useQuery } from '@tanstack/react-query';
import z from 'zod/v4';

import { httpService } from '@/services/httpService';

export const trackSchema = z.object({
  parcelId: z.string(),
  trackingCode: z.string(),
  senderName: z.string(),
  recipientName: z.string(),
  currentStatus: z.string(),
  estimatedDelivery: z.string(),
});
export const timelineSchema = z.array(
  z.object({
    id: z.string(),
    parcelId: z.string(),
    status: z.string(),
    description: z.string(),
    timestamp: z.string(),
  })
);
export type TrackingData = z.infer<typeof trackSchema>;
export type TimelineData = z.infer<typeof timelineSchema>;

export async function fetchTimelineData(trackingNumber: string | undefined): Promise<TimelineData> {
  return await httpService.get(`tracking/${trackingNumber}/timeline`, timelineSchema);
}
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

export function useTimeline(slug: string | undefined) {
  return useQuery<TimelineData>({
    queryKey: ['timeline', slug],
    queryFn: () => fetchTimelineData(slug),
    enabled: !!slug,
  });
}
