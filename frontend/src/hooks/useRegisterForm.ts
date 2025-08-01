import { useForm } from 'react-hook-form';
import type { RegisterResponse } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

import { register } from '@/apis/authApi';

import { registrationSchema, type RegistrationFormData } from '@/utils/authZodSchemas';

interface UseRegisterFormProps {
  onSuccess?: (data: RegisterResponse) => void;
}

export function useRegisterForm({ onSuccess }: UseRegisterFormProps = {}) {
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
  });

  const { mutate: submitRegister, isPending } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      enqueueSnackbar(
        `Account created successfully! ${data.emailVerified ? 'Please check your email for verification.' : 'You can now login.'}`,
        { variant: 'success' }
      );
      form.reset();
      onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });

  const onSubmit = (data: RegistrationFormData) => {
    submitRegister(data);
  };

  return {
    form,
    onSubmit,
    isLoading: isPending,
  };
}
