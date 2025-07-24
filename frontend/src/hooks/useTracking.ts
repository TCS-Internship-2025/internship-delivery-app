import { useQuery } from '@tanstack/react-query';

import { fetchTrackingData, type TrackingData } from '@/apis/tracking';

export function useTracking(slug: string | undefined) {
  return useQuery<TrackingData>({
    queryKey: ['tracking', slug],
    queryFn: () => fetchTrackingData(slug),
    enabled: !!slug,
  });
}
