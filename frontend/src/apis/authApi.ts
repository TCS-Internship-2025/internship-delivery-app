import { useNavigate } from 'react-router-dom';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from '@/types/auth';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v4';

import { httpService } from '@/services/httpService';

import { parseFromStorage } from '@/utils/storageParser';

const AUTH_TOKEN_KEY = 'authToken';
const AUTH_REFRESH_TOKEN_KEY = 'authRefreshToken';
const AUTH_USER_KEY = 'authUser';
const queryClient = new QueryClient();
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
});

export const registerResponseSchema = z.object({
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean().default(false),
});

export const refreshTokenResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
});

export const verifyEmailResponseSchema = z.object({
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
});

export const resendVerificationEmailResponseSchema = z
  .object({
    message: z.string().optional(),
  })
  .or(z.object({}));

export function saveAuthData(token: string, refreshToken: string, user: User) {
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  sessionStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken);
  sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function loadAuthData(): { token: string; refreshToken: string; user: User } | null {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
  const refreshToken = sessionStorage.getItem(AUTH_REFRESH_TOKEN_KEY);
  const user = parseFromStorage(AUTH_USER_KEY, userSchema);
  return token && refreshToken && user ? { token, refreshToken, user } : null;
}

export function clearAuthData() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
  queryClient.removeQueries({ queryKey: ['auth'] });
}

export function getStoredAuthData(): { token: string; refreshToken: string; user: User } | null {
  const data = loadAuthData();
  if (data) {
    return data;
  }
  clearAuthData();
  return null;
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await httpService.post('/auth/login', loginResponseSchema, credentials);
  return response;
}

export async function register(credentials: RegisterRequest): Promise<RegisterResponse> {
  const response = await httpService.post('/auth/register', registerResponseSchema, credentials);

  return response;
}
export async function logout(): Promise<void> {
  const authData = getStoredAuthData();

  clearAuthData();

  if (authData?.refreshToken) {
    try {
      // Use direct fetch for logout since we know it returns empty response
      const response = await fetch(`/logout?refreshToken=${authData.refreshToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Logout API call successful');
      } else {
        console.warn(`Logout API returned status: ${response.status}`);
      }
    } catch (error) {
      console.warn('Logout API call failed, but local logout completed:', error);
    }
  }
}
export async function refreshToken(): Promise<RefreshTokenResponse> {
  const authData = getStoredAuthData();
  if (!authData?.refreshToken) {
    throw new Error('No refresh token available');
  }
  const response = await httpService.post(
    `/auth/refresh-token?refreshToken=${authData.refreshToken}`,
    refreshTokenResponseSchema
  );

  saveAuthData(response.token, response.refreshToken, authData.user);

  queryClient.setQueryData(['auth'], {
    token: response.token,
    refreshToken: response.refreshToken,
    user: authData.user,
  });

  return response;
}
export async function resendVerificationEmail(email: string): Promise<void> {
  await httpService.post(`/auth/email/resend-verification?email=${email}`, resendVerificationEmailResponseSchema);
}

export async function verifyEmail(
  userId: string,
  token: string
): Promise<{ name: string; email: string; emailVerified: boolean }> {
  const response = await httpService.get(`/auth/email/verify?uid=${userId}&t=${token}`, verifyEmailResponseSchema);

  return {
    name: response.name,
    email: response.email,
    emailVerified: response.emailVerified,
  };
}

export async function sendForgotPasswordEmail(email: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/auth/password/forgot`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Password reset request failed: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`
    );
  }
}

export async function deleteUser(): Promise<void> {
  const authData = getStoredAuthData();

  // Use direct fetch for delete since we know it returns empty response (204 No Content)
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/users/me`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(authData?.token && { Authorization: `Bearer ${authData.token}` }),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Delete user failed: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`
    );
  }

  clearAuthData();
}

export function useDeleteUser() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.clear();
      void navigate('/login', { replace: true });
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
    },
  });
}
