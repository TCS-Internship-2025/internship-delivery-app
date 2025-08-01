import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { User } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { enqueueSnackbar } from 'notistack';
import { z } from 'zod';

import { useAuth } from '@/contexts/AuthContext';

import { login } from '@/apis/authApi';

import { loginSchema } from '@/utils/authZodSchemas';

type LoginFormData = z.infer<typeof loginSchema>;

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    mutate: submitLogin,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log('Login successful:', data);

      // Decode the token to extract user data
      const decodedToken = jwtDecode<{
        sub: string;
        name: string;
        email: string;
        emailVerified: boolean;
      }>(data.token);

      const user: User = {
        id: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        emailVerified: !decodedToken.emailVerified,
      };

      setAuthData(data.token, data.refreshToken, user);

      enqueueSnackbar('Login successful!', { variant: 'success' });

      void navigate('/');
    },
    onError: (error) => {
      console.error('Login failed:', error);
      form.setError('root', {
        type: 'manual',
        message: 'Login failed. Please check your credentials.',
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log('Submitting login data:', { email: data.email, password: '***' });
    form.clearErrors('root');
    submitLogin(data);
  };

  return {
    form,
    onSubmit,
    isLoading: isPending,
    error,
  };
};
