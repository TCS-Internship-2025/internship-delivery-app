import { type LoginRequest, type LoginResponse, type User } from '@/types/auth';
import { z } from 'zod/v4';

import { httpService as baseHttpService } from './httpService';

import { parseFromStorage } from '@/utils/storageParser';

export const userSchema = z.object({
  id: z.string(),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'),
  name: z.string().optional(),
});

const loginResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});

const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'authUser';

class AuthService {
  private token: string | null = null;

  private addAuthHeader(options: RequestInit = {}): RequestInit {
    return {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        Authorization: `Bearer ${this.token}`,
      },
    };
  }

  private requestWithAuth<Z extends z.ZodTypeAny>(
    method: (url: string, schema: Z, options?: RequestInit) => Promise<z.infer<Z>>,
    url: string,
    schema: Z,
    options?: RequestInit
  ): Promise<z.infer<Z>> {
    const withAuthOptions = this.addAuthHeader(options);
    return method(url, schema, withAuthOptions);
  }

  setAuthToken(token: string) {
    this.token = token;
  }

  clearAuthToken() {
    this.token = null;
  }

  saveAuthData(token: string, user: User): void {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }

  loadAuthData(): { token: string; user: User } | null {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    const user = parseFromStorage(AUTH_USER_KEY, userSchema);

    return token && user ? { token, user } : null;
  }

  clearAuthData(): void {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return baseHttpService.post('/auth/login', loginResponseSchema, credentials);
  }

  async logout(): Promise<void> {
    try {
      await baseHttpService.post('/auth/logout', z.object({}));
    } catch {
      console.log('logout error');
    }
  }

  async getProfile(): Promise<User> {
    return this.requestWithAuth(baseHttpService.get.bind(baseHttpService), '/auth/profile', userSchema);
  }

  async refreshToken(): Promise<LoginResponse> {
    return baseHttpService.post('/auth/refresh', loginResponseSchema);
  }
}

export const authService = new AuthService();
