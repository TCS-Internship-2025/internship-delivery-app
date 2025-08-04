import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

import { verifyEmail } from '@/apis/authApi';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export const Verified = () => {
  const navigate = useNavigate();
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; name?: string } | null>(null);

  const { mutate: verify, isPending } = useMutation({
    mutationFn: ({ userId, token }: { userId: string; token: string }) => verifyEmail(userId, token),
    onSuccess: (data) => {
      setVerificationResult({ success: true, name: data.name });
      enqueueSnackbar('Email verified successfully!', { variant: 'success' });

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        void navigate('/', { replace: true });
      }, 3000);
    },
    onError: (error) => {
      console.error('Verification failed:', error);
      setVerificationResult({ success: false });
      enqueueSnackbar('Email verification failed. The link may be expired or invalid.', { variant: 'error' });

      // Redirect to login after 3 seconds on error
      setTimeout(() => {
        void navigate('/login', { replace: true });
      }, 3000);
    },
  });

  useEffect(() => {
    if (uid && token) {
      verify({ userId: uid, token });
    }
  }, [uid, token, verify]);

  if (isPending) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            justifyContent: 'center',
          }}
        >
          <Paper elevation={3} sx={{ padding: 10, textAlign: 'center' }}>
            <CircularProgress size={64} sx={{ mb: 2 }} />
            <Typography variant="h4" align="center" sx={{ fontWeight: 600 }}>
              Verifying Your Email
            </Typography>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Please wait while we verify your email address...
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 10, textAlign: 'center' }}>
          {verificationResult?.success ? (
            <>
              <CheckCircleIcon color="primary" sx={{ fontSize: 104, mb: 2 }} />
              <Typography variant="h3" align="center" sx={{ fontWeight: 600 }}>
                Email Verified Successfully
              </Typography>
              {verificationResult.name && (
                <Typography variant="h6" align="center" sx={{ mt: 1, color: 'text.secondary' }}>
                  Welcome, {verificationResult.name}!
                </Typography>
              )}
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                You will be redirected to the home page in a few seconds
              </Typography>
            </>
          ) : (
            <>
              <ErrorIcon color="error" sx={{ fontSize: 104, mb: 2 }} />
              <Typography variant="h3" align="center" sx={{ fontWeight: 600, color: 'error.main' }}>
                Verification Failed
              </Typography>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                The verification link is invalid or expired. You will be redirected to login.
              </Typography>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};
