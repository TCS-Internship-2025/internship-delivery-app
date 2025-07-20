import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * Compares the screen's dimensions to the MUI breakpoints. Used for responsivity and improved user experience.
 * @returns True, if the screen dimensions are small, false otherwise
 */
export const useSmallScreen = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('lg'));
};
