import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 0,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
