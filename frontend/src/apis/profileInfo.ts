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

export async function fetchProfileInfo(JWTtoken: string | null): Promise<Profile> {
  const token = JWTtoken;
  return await httpService.request(`/users/me`, profileSchema, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function useGetProfileInfo(JWTtoken: string | null) {
  return useQuery<Profile>({
    queryKey: ['profileInfo'],
    queryFn: () => fetchProfileInfo(JWTtoken),
  });
}
