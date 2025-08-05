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

export const profileSchema = z.object({
  name: z.string(),
  email: z.email(),
  phone: z.string().nullable(),
  address: addressSchema.nullable(),
  isVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Profile = z.infer<typeof profileSchema>;

export async function fetchProfileInfo(): Promise<Profile> {
  return await httpService.get(`/users/me`, profileSchema);
}

export function useGetProfileInfo() {
  return useQuery<Profile>({
    queryKey: ['profileInfo'],
    queryFn: () => fetchProfileInfo(),
  });
}
