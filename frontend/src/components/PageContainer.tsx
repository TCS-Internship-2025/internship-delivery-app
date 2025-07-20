import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { BoxIcon } from './BoxIcon';

interface PageContainerProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
}

export const PageContainer = ({ children, icon, title }: PageContainerProps) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          flexShrink: 0,
        }}
      >
        <BoxIcon icon={icon} />
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ flex: 1, pr: 1, overflow: 'auto', minHeight: 0 }}>
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            display: 'flex',
            flexDirection: 'column',
            border: '2px dashed grey',
            height: 1200, // This simulates large content
          }}
        >
          {children}
        </Container>
      </Box>
    </>
  );
};
