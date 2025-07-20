import { ROUTES } from '@/constants';

import QuestionMark from '@mui/icons-material/QuestionMark';
import Box from '@mui/material/Box';

import { NavigationButtons } from '@/components/NavigationButtons.tsx';
import { PageContainer } from '@/components/PageContainer';

export const Page2 = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageContainer icon={<QuestionMark />} title="Page2">
        Your content will go here
      </PageContainer>
      <NavigationButtons previousPath={`/${ROUTES.PAGE1}`} nextPath={`/${ROUTES.PAGE3}`} />
    </Box>
  );
};
