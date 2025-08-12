import { useMemo } from 'react';

export interface PasswordStrength {
  score: number;
  label: string;
  color: 'error' | 'warning' | 'info' | 'success';
}

export const usePasswordStrength = (password: string): PasswordStrength | null => {
  return useMemo(() => {
    if (!password) return null;

    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[^a-zA-Z0-9]/.test(password),
      password.length >= 12,
    ];

    const score = checks.filter(Boolean).length;

    if (score <= 3) return { score, label: 'Weak', color: 'error' };
    if (score <= 4) return { score, label: 'Moderate', color: 'warning' };
    if (score === 5) return { score, label: 'Good', color: 'info' };
    return { score, label: 'Strong', color: 'success' };
  }, [password]);
};
