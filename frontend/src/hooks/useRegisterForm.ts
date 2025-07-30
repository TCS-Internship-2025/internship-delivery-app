import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { register } from '@/apis/authApi';

import { registrationSchema, type RegistrationFormData } from '@/utils/authZodSchemas';

export function useRegisterForm() {
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
  });

  const { mutate: submitRegister, isPending } = useMutation({
    mutationFn: register,
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
