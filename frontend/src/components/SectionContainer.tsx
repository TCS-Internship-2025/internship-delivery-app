import React from 'react';

import { useSmallScreen } from '@/hooks/useSmallScreen';
import { useTheme } from '@/providers/ThemeProvider.tsx';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface SectionContainerProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  disableBorder?: boolean;
}

export const SectionContainer = ({ title, subtitle, disableBorder = false, children }: SectionContainerProps) => {
  const { mode } = useTheme();
  const isSmallScreen = useSmallScreen();

  const borderColor = mode === 'light' ? '#1018280D' : '#e5e7eb0D';

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          py: 3,
          gap: 2,
          borderRadius: 2,
          boxShadow: !disableBorder ? `0px 1px 0px ${borderColor}` : 'none',
        }}
      >
        <Box sx={{ flexShrink: 0, width: 250 }}>
          <Typography variant="h6" fontWeight={600} fontSize={16}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" fontSize={14} fontWeight={400} color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</Box>
      </Box>
    </>
  );
};
