import z from 'zod/v4';

import { httpService } from '@/services/httpService';

//probably wont be the response the backend sends
export const trackSchema = z.object({
  id: z.string(),
  sender: z.string(),
  method: z.string(),
  address: z.string(),
  status: z.array(
    z.object({
      changeDate: z.string(),
      changeMessage: z.string(),
      changeLocation: z.string(),
    })
  ),
});
export type TrackingData = z.infer<typeof trackSchema>;
export async function fetchTrackingData(trackingNumber: string | undefined): Promise<TrackingData> {
  return await httpService.get(`tracking/${trackingNumber}`, trackSchema);
}
