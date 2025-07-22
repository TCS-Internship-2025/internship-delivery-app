import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

interface NavigationButtonsProps {
  previousPath?: string;
  nextPath?: string;
  onPrevious?: () => void;
  onNext?: () => void;
}

export const NavigationButtons = ({ previousPath, nextPath, onPrevious, onNext }: NavigationButtonsProps) => {
  const navigate = useNavigate();

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else if (previousPath) {
      void navigate(previousPath);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (nextPath) {
      void navigate(nextPath);
    }
  };

  return (
    <Box sx={{ flexShrink: 0 }}>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={!previousPath && !onPrevious}
          fullWidth
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 2,
            borderColor: 'action.disabled',
            color: 'text.primary',
          }}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!nextPath && !onNext}
          fullWidth
          color="primary"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            borderColor: 'action.disabled',
          }}
        >
          {'Continue'}
        </Button>
      </Box>
    </Box>
  );
};
