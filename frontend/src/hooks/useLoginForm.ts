import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { login } from '@/apis/authApi';

import { loginSchema } from '@/utils/authZodSchemas';

type LoginFormData = z.infer<typeof loginSchema>;

export const useLoginForm = () => {
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: submitLogin, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      void navigate('/');
    },
  });

  const onSubmit = (data: LoginFormData) => {
    submitLogin(data);
  };

  return {
    form,
    onSubmit,
    isLoading: isPending,
  };
};
