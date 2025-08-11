import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

import { sendForgotPasswordEmail } from '@/apis/authApi';

import { resetPasswordSchema, type ResetPasswordFormData } from '@/utils/authZodSchemas';

export const usePasswordReset = () => {
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const {
    mutate: sendResetEmail,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (email: string) => sendForgotPasswordEmail(email),
    onSuccess: () => {
      enqueueSnackbar('If your email is registered, a reset link will be sent!', {
        variant: 'success',
        autoHideDuration: 5000,
      });
    },
    onError: (error) => {
      console.error('Password reset request failed:', error);
      form.setError('root', {
        type: 'manual',
        message: 'Failed to send reset email. Please try again.',
      });
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    form.clearErrors('root');
    sendResetEmail(data.email);
  };

  return {
    form,
    onSubmit,
    isLoading: isPending,
    isSuccess,
    error,
  };
};
