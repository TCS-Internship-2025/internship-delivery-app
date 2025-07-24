import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { queryClient } from '@/queryClient';
import { useMutation } from '@tanstack/react-query';

import type { CreateParcelResponseSchema, parcelFromSchema } from '@/apis/parcel';

export const useCreateParcel = (
  mutationFn: (data: parcelFromSchema) => Promise<CreateParcelResponseSchema>,
  queryKey: string[]
) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: mutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey });
      void navigate(`/${ROUTES.PAGE2}`);
    },
  });
};
