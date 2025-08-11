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
          : undefined);

      let errorMessage = '';
      if (error?.response?.data && typeof error.response.data === 'object' && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data && typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error?.response?.data) {
        try {
          errorMessage = JSON.stringify(error.response.data);
        } catch {
          errorMessage = 'An error occurred. Could not parse error details.';
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      const isUnverifiedEmail =
        (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('email is not verified')) ||
        status === 401 ||
        (typeof errorMessage === 'string' && /unauthorized|401/i.test(errorMessage));

      if (isUnverifiedEmail) {
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
        }

        try {
          void navigate('/verify', { state: { email } });
          return;
        } catch (navErr) {
          console.error('navigate to /verify failed, falling back to location.href', navErr);
          const fallbackUrl = `/verify${email ? `?email=${encodeURIComponent(email)}` : ''}`;
          window.location.href = fallbackUrl;
          return;
        }
      }

      form.setError('root', {
        type: 'manual',
        message: 'Login failed. Please check your credentials.',
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
