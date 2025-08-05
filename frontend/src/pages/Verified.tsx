import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { useEmailVerification } from '@/hooks/useEmailVerification';
import { useAuth } from '@/contexts/AuthContext';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export const Verified = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const { user, isAuthenticated } = useAuth();
  const { verify, isPending, verificationResult } = useEmailVerification();
  const hasVerified = useRef(false);

  useEffect(() => {
    // Don't verify if user is already authenticated and verified
    if (isAuthenticated && user?.emailVerified) {
      return;
    }

    if (uid && token && !hasVerified.current && !verificationResult) {
      hasVerified.current = true;
      verify({ userId: uid, token });
    }
  }, [uid, token, verify, verificationResult, isAuthenticated, user?.emailVerified]);

  // If user is already verified, show success immediately
  if (isAuthenticated && user?.emailVerified) {
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
            <CheckCircleIcon color="primary" sx={{ fontSize: 104, mb: 2 }} />
            <Typography variant="h3" align="center" sx={{ fontWeight: 600 }}>
              Email Already Verified
            </Typography>
            <Typography variant="h6" align="center" sx={{ mt: 1, color: 'text.secondary' }}>
              Welcome back, {user.name}!
            </Typography>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Your email is already verified. You will be redirected to the home page in a few seconds.
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

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
                You will be redirected to the login page in a few seconds
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
