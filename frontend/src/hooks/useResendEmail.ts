import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

import { resendVerificationEmail } from '@/apis/authApi';

export const useResendEmail = () => {
  const [cooldown, setCooldown] = useState(true);
  const [countdown, setCountdown] = useState(30);

  const { mutate: resendEmail, isPending } = useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: () => {
      enqueueSnackbar('Verification email sent successfully!', { variant: 'success' });
      setCooldown(true);
      setCountdown(30);
      const expiryTime = Date.now() + 30 * 1000;
      localStorage.setItem('cooldownExpiryTime', expiryTime.toString());
    },
    onError: (error) => {
      console.error('Failed to resend email:', error);
      enqueueSnackbar('Failed to send verification email. Please try again.', { variant: 'error' });
    },
  });

  useEffect(() => {
    // Check localStorage for existing cooldown on mount
    const cooldownExpiryTime = localStorage.getItem('cooldownExpiryTime');
    if (cooldownExpiryTime) {
      const expiryTime = parseInt(cooldownExpiryTime, 10);
      const currentTime = Date.now();

      if (expiryTime > currentTime) {
        const remainingSeconds = Math.ceil((expiryTime - currentTime) / 1000);
        setCooldown(true);
        setCountdown(remainingSeconds);
      } else {
        localStorage.removeItem('cooldownExpiryTime');
      }
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (cooldown && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCooldown(false);
      setCountdown(30);
      localStorage.removeItem('cooldownExpiryTime');
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown, countdown]);

  return {
    resendEmail,
    isPending,
    cooldown,
    countdown,
  };
};
