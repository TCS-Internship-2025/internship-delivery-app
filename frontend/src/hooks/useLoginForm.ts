import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { User } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { enqueueSnackbar } from 'notistack';
import { z } from 'zod';

import { useAuth } from '@/contexts/AuthContext';

import { login, resendVerificationEmail } from '@/apis/authApi';

import { loginSchema } from '@/utils/authZodSchemas';

type LoginFormData = z.infer<typeof loginSchema>;

interface ApiError {
  response?: {
    status?: number;
    data?:
      | {
          message?: string;
        }
      | string;
  };
  status?: number;
  message?: string;
}

interface DecodedToken {
  sub: string;
  name: string;
  email: string;
  emailVerified: boolean;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
}

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

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
    mutationFn: (payload: LoginFormData | undefined) => {
      if (!payload) {
        throw new Error('Login data is required');
      }
      return login(payload);
    },
    onSuccess: (data: LoginResponse) => {
      const decodedToken = jwtDecode<DecodedToken>(data.token);

      const user: User = {
        id: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        emailVerified: decodedToken.emailVerified,
      };

      setAuthData(data.token, data.refreshToken, user);

      if (!decodedToken.emailVerified) {
        enqueueSnackbar('Please verify your email to continue.', { variant: 'info' });
        void navigate('/verify', { state: { email: user.email } });
      } else {
        enqueueSnackbar('Login successful!', { variant: 'success' });
        void navigate('/');
      }
    },

    onError: async (error: ApiError, variables?: LoginFormData) => {
      console.error('Login failed (useLoginForm):', error);
      console.dir(error);

      const status =
        error?.response?.status ??
        error?.status ??
        (error?.message && typeof error.message === 'string' && /401|unauthorized/i.test(error.message)
          ? 401
          : error?.message && typeof error.message === 'string' && /403|forbidden/i.test(error.message)
            ? 403
            : undefined);

      let errorMessage = '';

      if (error?.response?.data && typeof error.response.data === 'object') {
        const maybeMsg = (error.response.data as { message?: unknown }).message;
        if (typeof maybeMsg === 'string') {
          errorMessage = maybeMsg;
        } else {
          try {
            errorMessage = JSON.stringify(error.response.data);
          } catch {
            errorMessage = 'An error occurred';
          }
        }
      } else if (error?.response?.data && typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (typeof error?.message === 'string') {
        errorMessage = error.message;
      }

      if (status === 403 || /email.*not.*verified/i.test(errorMessage)) {
        const email = variables?.email ?? form.getValues('email');

        if (email) {
          try {
            await resendVerificationEmail(email);
            enqueueSnackbar('Your email is not verified. A verification link has been sent.', { variant: 'info' });
          } catch (resendErr) {
            console.warn('Failed to resend verification email:', resendErr);
            enqueueSnackbar(
              'Could not send verification email automatically. Please visit the verification page to resend.',
              { variant: 'warning' }
            );
          }
        } else {
          console.warn('No email available to resend verification to.');
          enqueueSnackbar('Please enter your email to resend the verification link.', { variant: 'warning' });
        }

        try {
          void navigate('/verify', { state: { email } });
        } catch (navErr) {
          console.error('navigate to /verify failed, falling back to location.href', navErr);
          const fallbackUrl = `/verify${email ? `?email=${encodeURIComponent(email)}` : ''}`;
          window.location.href = fallbackUrl;
        }
        return;
      }

      if (status === 401) {
        form.setError('root', {
          type: 'manual',
          message: 'Invalid email or password. Please check your credentials.',
        });
        return;
      }

      form.setError('root', {
        type: 'manual',
        message: errorMessage || 'Login failed. Please try again.',
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
