import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { z } from 'zod';

import { login } from '@/apis/authApi';

import { loginSchema } from '@/utils/authZodSchemas';

type LoginFormData = z.infer<typeof loginSchema>;

export const useLoginForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

      void queryClient.invalidateQueries({ queryKey: ['auth', 'stored'] });

      enqueueSnackbar('Login successful!', { variant: 'success' });

      setTimeout(() => {
        void navigate('/');
      }, 100);
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
