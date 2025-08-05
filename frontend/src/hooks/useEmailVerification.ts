import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

import { verifyEmail } from '@/apis/authApi';

interface VerificationResult {
  success: boolean;
  name?: string;
}

export const useEmailVerification = () => {
  const navigate = useNavigate();
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const { mutate: verify, isPending } = useMutation({
    mutationFn: ({ userId, token }: { userId: string; token: string }) => verifyEmail(userId, token),
    onSuccess: (data) => {
      setVerificationResult({ success: true, name: data.name });
      enqueueSnackbar('Email verified successfully!', { variant: 'success' });

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        void navigate('/login', { replace: true });
      }, 3000);
    },
    onError: (error) => {
      setVerificationResult({ success: false });
      console.error('Email verification failed:', error);

      // Redirect to login after 3 seconds on error
      setTimeout(() => {
        void navigate('/login', { replace: true });
      }, 3000);
    },
  });

  return {
    verify,
    isPending,
    verificationResult,
  };
};
