import { queryClient } from '@/queryClient';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from '@/types/auth';
import { jwtDecode } from 'jwt-decode';
import { z } from 'zod/v4';

import { httpService } from '@/services/httpService';

import { parseFromStorage } from '@/utils/storageParser';

const AUTH_TOKEN_KEY = 'authToken';
const AUTH_REFRESH_TOKEN_KEY = 'authRefreshToken';
const AUTH_USER_KEY = 'authUser';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerificationRequired: z.boolean(),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
});

export const registerResponseSchema = z.object({
  name: z.string(),
  email: z.email(),
  emailVerificationRequired: z.boolean(),
});

export const refreshTokenResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
});

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

  // Decode token to extract user data
  const decodedToken = jwtDecode<{
    sub: string;
    name: string;
    email: string;
    emailVerified: boolean;
  }>(response.token);

  const user: User = {
    id: decodedToken.sub,
    name: decodedToken.name,
    email: decodedToken.email,
    emailVerificationRequired: !decodedToken.emailVerified,
  };

  saveAuthData(response.token, response.refreshToken, user);

  queryClient.setQueryData(['auth', 'stored'], {
    token: response.token,
    refreshToken: response.refreshToken,
    user,
  });

  return response;
}

export async function register(credentials: RegisterRequest): Promise<RegisterResponse> {
  const response = await httpService.post('/auth/register', registerResponseSchema, credentials);

  return response;
}

export async function logout(): Promise<void> {
  const authData = getStoredAuthData();
  try {
    if (authData?.refreshToken) {
      await httpService.post(`/auth/logout?refreshToken=${authData.refreshToken}`, z.object({}));
    }
  } catch (err) {
    console.warn('Logout failed:', err);
  } finally {
    clearAuthData();
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
  const currentData = queryClient.getQueryData<{ token: string; refreshToken: string; user: User }>(['auth', 'stored']);

  if (currentData?.user) {
    saveAuthData(response.token, response.refreshToken, currentData.user);
  }

  queryClient.setQueryData(['auth', 'stored'], {
    token: response.token,
    refreshToken: response.refreshToken,
    user: currentData?.user ?? null,
  });

  return response;
}
