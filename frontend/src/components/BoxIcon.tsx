import Box from '@mui/material/Box';
import { type SxProps, type Theme } from '@mui/material/styles';

interface BoxIconProps {
  icon: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const BoxIcon = ({ icon, sx }: BoxIconProps) => (
  <Box
    sx={{
      width: 32,
      height: 32,
      borderRadius: 1.5,
      backgroundColor: 'primary.light',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mr: 1.5,
      '& svg': {
        fontSize: 18,
        color: 'primary.main',
      },
      ...sx,
    }}
  >
    {icon}
  </Box>
);
