import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { loginSchema } from '@/utils/authZodSchemas';

type LoginFormData = z.infer<typeof loginSchema>;

export const useLoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      // TODO: Implement actual login logic here
      console.log('Login data:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      void navigate('/');
    } catch {
      setSubmitError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
    submitError,
  };
};
