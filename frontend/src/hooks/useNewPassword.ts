import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

import { resetPasswordWithToken } from '@/apis/authApi';

import { newPasswordSchema, type NewPasswordFormData } from '@/utils/authZodSchemas';

export const useNewPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const form = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const {
    mutate: resetPassword,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (newPassword: string) => {
      if (!token) {
        throw new Error('Reset token is missing or invalid');
      }
      return resetPasswordWithToken(token, newPassword);
    },
    onSuccess: () => {
      enqueueSnackbar('Password reset successfully!', {
        variant: 'success',
        autoHideDuration: 5000,
      });
    },
    onError: (error) => {
      console.error('Password reset failed:', error);
      enqueueSnackbar('Failed to reset password. Please try again.', {
        variant: 'error',
        autoHideDuration: 5000,
      });
      form.setError('root', {
        type: 'manual',
        message: 'Failed to reset password. Please try again.',
      });
    },
  });

  const onSubmit = (data: NewPasswordFormData) => {
    form.clearErrors('root');
    resetPassword(data.newPassword);
  };

  return {
    form,
    onSubmit,
    isLoading: isPending,
    isSuccess,
    error,
    hasValidToken: !!token,
  };
};
