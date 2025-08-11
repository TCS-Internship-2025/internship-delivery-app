import Box from '@mui/material/Box';

import { ErrorContent } from '@/components/ErrorContent';

interface ErrorPageProps {
  title?: string;
  message?: string;
}

export const ErrorPage = ({ title, message }: ErrorPageProps) => {
  return (
    <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
      <ErrorContent title={title} message={message} />
    </Box>
  );
};
