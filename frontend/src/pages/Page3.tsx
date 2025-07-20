import { ROUTES } from '@/constants';

import QuestionMark from '@mui/icons-material/QuestionMark';
import Box from '@mui/material/Box';

import { NavigationButtons } from '@/components/NavigationButtons.tsx';
import { PageContainer } from '@/components/PageContainer';

export const Page3 = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageContainer icon={<QuestionMark />} title="Page3">
        Your content will go here
      </PageContainer>
      <NavigationButtons previousPath={`/${ROUTES.PAGE2}`} nextPath={`/${ROUTES.PAGE4}`} />
    </Box>
  );
};
