import type React from 'react';
import { QUERY_STATUS } from '@/constants';

import { useSmallScreen } from '@/hooks/useSmallScreen';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { ErrorContent } from '@/components/ErrorContent';

interface QueryStatesProps {
  state?: string;
  isPending?: boolean;
  pendingMessage?: string;
  isError?: boolean;
  errorTitle?: string;
  errorMessage?: string;
  children: React.ReactNode;
}

export const QueryStates = ({
  state,
  isPending,
  pendingMessage,
  isError,
  errorTitle,
  errorMessage,
  children,
}: QueryStatesProps) => {
  const isSmallScreen = useSmallScreen();

  return (
    <>
      {state ? (
        state === QUERY_STATUS.SUCCESS || state === QUERY_STATUS.IDLE ? (
          children
        ) : (
          <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            height={'100%'}
          >
            {state === QUERY_STATUS.PENDING && (
              <>
                <CircularProgress size={isSmallScreen ? 40 : 56} />
                <Typography variant="subtitle1" fontSize={isSmallScreen ? 20 : 24} mt={3}>
                  {pendingMessage ?? 'Your content is loading...'}
                </Typography>
              </>
            )}
            {state === QUERY_STATUS.ERROR && <ErrorContent title={errorTitle} message={errorMessage} />}
          </Box>
        )
      ) : isPending ? (
        <>
          <CircularProgress size={isSmallScreen ? 48 : 64} />
          <Typography variant="subtitle1" fontSize={isSmallScreen ? 20 : 24} mt={3}>
            {pendingMessage ?? 'Your content is loading...'}
          </Typography>
        </>
      ) : isError ? (
        <ErrorContent title={errorTitle} message={errorMessage} />
      ) : (
        children
      )}
    </>
  );
};
