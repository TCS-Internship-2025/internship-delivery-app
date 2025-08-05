import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

import { verifyEmail } from '@/apis/authApi';

interface VerificationResult {
  success: boolean;
  name?: string;
}

const REDIRECT_TIME = 5000;
export const useEmailVerification = () => {
  const navigate = useNavigate();
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const { mutate: verify } = useMutation({
    mutationFn: ({ userId, token }: { userId: string; token: string }) => verifyEmail(userId, token),
    onSuccess: (data) => {
      setVerificationResult({ success: true, name: data.name });
      enqueueSnackbar('Email verified successfully!', { variant: 'success' });

      setTimeout(() => {
        void navigate('/login', { replace: true });
      }, REDIRECT_TIME);
    },
    onError: () => {
      setVerificationResult({ success: false });
      enqueueSnackbar('Email verification failed. The link may be expired or invalid.', { variant: 'error' });
      setTimeout(() => {
        void navigate('/login', { replace: true });
      }, REDIRECT_TIME);
    },
  });

  return {
    verify,
    verificationResult,
  };
};
