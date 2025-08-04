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
  return await httpService.request(`tracking/${trackingNumber}/timeline`, timelineSchema, {
    method: 'GET',
    headers: {
      'X-API-KEY': 'my-secret-api-key-1234',
    },
  });
}
export async function fetchTrackingData(trackingNumber: string | undefined): Promise<TrackingData> {
  return await httpService.request(`tracking/${trackingNumber}`, trackSchema, {
    method: 'GET',
    headers: {
      'X-API-KEY': 'my-secret-api-key-1234',
    },
  });
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

export const TrackingNumberRegex = /^HU\d{10}[A-Z]{2}$/;

export const TrackingFormSchema = z.object({
  trackNumber: z.string().regex(TrackingNumberRegex, {
    message: "Tracking number starts with 'HU', followed by 10 digits and 2 uppercase letters",
  }),
});

export type TrackingFormValues = z.infer<typeof TrackingFormSchema>;
