import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { BoxIcon } from './BoxIcon.tsx';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const NavItem = ({ icon, label, isActive, onClick, disabled = false }: NavItemProps) => (
  <Button
    fullWidth
    onClick={onClick}
    disabled={disabled}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      textAlign: 'left',
      textTransform: 'none',
      px: 2,
      py: 1.5,
      mb: 0.5,
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
  </Button>
);
