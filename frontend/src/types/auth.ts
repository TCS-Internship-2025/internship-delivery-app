export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
}

export interface RegisterResponse {
  name: string;
  email: string;
  emailVerified: boolean;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  timestamp: string;
  errors: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthData: (token: string, refreshToken: string, user: User) => void;
  logout: () => Promise<void>;
}
