import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { registrationSchema, type RegistrationFormData } from '../utils/registrationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setIsLoading(true);
    setSubmitError(null);

    try {
      // TODO: Implement actual registration logic here
      console.log('Registration data:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      void navigate('/');
    } catch {
      setSubmitError('Registration failed. Please try again.');
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
