import { createContext } from 'react';
import { type AuthContextType } from '@/types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
