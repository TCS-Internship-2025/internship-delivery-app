import { useSmallScreen } from '@/hooks/useSmallScreen.ts';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { BoxIcon } from './BoxIcon.tsx';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const NavItem = ({ icon, label, isActive, onClick, disabled = false }: NavItemProps) => {
  const isSmallScreen = useSmallScreen();
  return (
    <Tooltip title={disabled ? 'Login to use this feature' : ''} arrow>
      <Box>
        <Button
          onClick={onClick}
          disabled={disabled}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'center',
            textTransform: 'none',
            mb: 0.5,
            px: 5,
            backgroundColor: 'transparent',
            color: 'text.primary',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            ...(isActive && {
              color: 'primary.main',
            }),
          }}
        >
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
            <BoxIcon
              icon={icon}
              sx={{
                backgroundColor: isActive ? 'primary.light' : 'action.selected',
                opacity: disabled ? 0.5 : 1,
                height: 28,
                width: 28,
                '& svg': {
                  fontSize: 18,
                  color: isActive ? 'primary.main' : disabled ? 'text.disabled' : 'text.secondary',
                },
              }}
            />
            <Typography variant="body2" fontWeight="medium">
              {label}
            </Typography>
          </Box>
          {isSmallScreen && <ArrowForwardIosIcon />}
        </Button>
      </Box>
    </Tooltip>
  );
};
