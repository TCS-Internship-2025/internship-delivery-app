import { type PasswordStrength } from '../hooks/usePasswordStrength';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
}

export const PasswordStrengthIndicator = ({ strength }: PasswordStrengthIndicatorProps) => (
  <Box sx={{ mt: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <Typography variant="caption" color="text.secondary">
        Password strength:
      </Typography>
      <Chip
        label={strength.label}
        size="small"
        color={strength.color}
        icon={strength.label === 'Strong' ? <CheckCircleIcon fontSize="small" /> : <ErrorIcon fontSize="small" />}
      />
    </Box>
    <LinearProgress
      variant="determinate"
      value={(strength.score / 6) * 100}
      color={strength.color}
      sx={{ height: 6, borderRadius: 3 }}
    />
  </Box>
);
