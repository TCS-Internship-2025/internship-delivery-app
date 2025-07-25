import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { registrationSchema, type RegistrationFormData } from '../utils/authZodSchemas';
import { zodResolver } from '@hookform/resolvers/zod';

import { useRegisterMutation } from '@/apis/authApi';

export const useRegisterForm = () => {
  const navigate = useNavigate();

  const registerMutation = useRegisterMutation();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      await registerMutation.mutateAsync(data);
      void navigate('/');
    } catch {
      // Error is now handled by TanStack Query
    }
  };

  return {
    form,
    onSubmit,
    isLoading: registerMutation.isPending,
    error: registerMutation.error,
    isError: registerMutation.isError,
  };
};
