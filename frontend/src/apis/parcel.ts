import { z } from 'zod/v4';

import { httpService } from '@/services/httpService';

import { page1FormSchema as parcelFormSchema } from '@/utils/page1Composition';

// For GET requests
export const ParcelSchema = parcelFormSchema.extend({
  id: z.number(),
});
export const CreateParcelResponseSchema = z.object({
  message: z.string(),
  parcel: parcelFormSchema,
});
export type parcelFromSchema = z.infer<typeof parcelFormSchema>;
export type CreateParcelResponseSchema = z.infer<typeof CreateParcelResponseSchema>;

export const createParcel = (data: parcelFromSchema) => {
  return httpService.post('/createParcel', CreateParcelResponseSchema, data);
};
