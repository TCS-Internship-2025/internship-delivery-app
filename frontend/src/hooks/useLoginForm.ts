import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useLoginMutation } from '@/apis/authApi';

import { loginSchema } from '@/utils/authZodSchemas';

type LoginFormData = z.infer<typeof loginSchema>;

export const useLoginForm = () => {
  const navigate = useNavigate();

  const loginMutation = useLoginMutation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      void navigate('/');
    } catch {
      // Error is now handled by TanStack Query
    }
  };

  return {
    form,
    onSubmit,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    isError: loginMutation.isError,
  };
};
