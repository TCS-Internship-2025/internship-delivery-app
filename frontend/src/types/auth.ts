export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  logout: () => void;
  isAuthenticated: boolean;
  setAuthData?: (token: string, user: User) => void;
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
  user: User;
}
