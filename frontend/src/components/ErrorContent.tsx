import { useSmallScreen } from '@/hooks/useSmallScreen';

import Typography from '@mui/material/Typography';

interface ErrorContentProps {
  title?: string;
  message?: string;
}

export const ErrorContent = ({ title, message }: ErrorContentProps) => {
  const isSmallScreen = useSmallScreen();
  return (
    <>
      <Typography variant="h4" fontSize={isSmallScreen ? 24 : 32} textAlign="center">
        {title ?? 'Something went wrong'}
      </Typography>
      <Typography variant="subtitle1" fontSize={isSmallScreen ? 18 : 24} textAlign="center" color="primary" mt={2}>
        {message ?? 'Please try again later!'}
      </Typography>
    </>
  );
};
