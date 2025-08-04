import { useSmallScreen } from '@/hooks/useSmallScreen';
import { useTheme } from '@/providers/ThemeProvider';

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
  const isSmallScreen = useSmallScreen();
  const { mode } = useTheme();
  const bgColor = mode === 'light' ? '#1018280D' : '#2A2F2A';

  return (
    <Box py={isSmallScreen ? 2 : 10} px={5} borderRadius={3} sx={{ height: '100%', bgcolor: bgColor }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
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
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};
