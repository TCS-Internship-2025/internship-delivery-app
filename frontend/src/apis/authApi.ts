import { type LoginRequest, type LoginResponse, type RegisterRequest, type User } from '@/types/auth';
import { useMutation, useQuery } from '@tanstack/react-query';

import { authService } from '@/services/authService';

export const useRegisterMutation = () =>
  useMutation<LoginResponse, Error, RegisterRequest>({
    mutationFn: (data) => authService.register(data),
  });
export const useLoginMutation = () =>
  useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (data) => authService.login(data),
  });

export const useLogoutMutation = () =>
  useMutation<void, Error>({
    mutationFn: () => authService.logout(),
  });

export const useProfileQuery = () =>
  useQuery<User>({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
    enabled: false,
  });

export const useRefreshToken = () =>
  useMutation<LoginResponse, Error>({
    mutationFn: () => authService.refreshToken(),
  });
