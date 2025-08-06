import React, { useState } from 'react';
import {
  closeSnackbar,
  SnackbarContent,
  SnackbarProvider,
  type CustomContentProps,
  type OptionsObject,
  type SnackbarProviderProps,
} from 'notistack';

import { useSmallScreen } from '@/hooks/useSmallScreen.ts';

import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/InfoOutline';
import WarningIcon from '@mui/icons-material/WarningAmberOutlined';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

const variantIcons = {
  default: InfoIcon,
  success: CheckCircleIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
} as const;

type VariantType = keyof typeof variantIcons;

const VariantIcon = ({ variant }: { variant?: VariantType }) => {
  const Icon = variantIcons[variant ?? 'default'];
  return <Icon />;
};

interface CustomExpandableProps extends CustomContentProps {
  headerMessage?: string;
}

export interface CustomSnackbarOptions extends OptionsObject {
  headerMessage?: string;
}

const ExpandableSnackbar = React.forwardRef<HTMLDivElement, CustomExpandableProps>((props, ref) => {
  const { id, message, headerMessage, variant } = props;

  const isSmallScreen = useSmallScreen();
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded((prev) => !prev);

  const text = typeof message === 'string' ? message : '';
  // Warnings and errors should have a newline to enable expanding snackbar
  const processedText = variant === 'warning' || variant === 'error' ? '\n' + text : text;
  const [first, ...rest] = processedText.split('\n');
  const hasDetails = rest.length > 0;

  return (
    <SnackbarContent ref={ref} role="alert">
      <Box
        display="flex"
        flexDirection="column"
        borderRadius={2}
        boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
        sx={{
          bgcolor: `${variant}.main`,
          color: `${variant}.contrastText`,
          maxWidth: 320,
          minWidth: isSmallScreen ? 200 : 240,
          ml: 'auto',
        }}
      >
        <Box display="flex" alignItems="center" px={2} py={1.5}>
          <VariantIcon variant={variant} />
          <Typography
            variant="subtitle2"
            px={1.5}
            style={{
              flex: 1,
              whiteSpace: 'pre-line',
              color: 'inherit',
            }}
          >
            {headerMessage ?? first}
          </Typography>
          {hasDetails && (
            <IconButton size="small" onClick={toggle} sx={{ color: `${variant}.contrastText` }}>
              {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>
          )}
          <IconButton size="small" onClick={() => closeSnackbar(id)} sx={{ color: `${variant}.contrastText` }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        {hasDetails && (
          <Collapse in={expanded}>
            <Box px={3} pb={2}>
              <Typography
                variant="body2"
                style={{
                  whiteSpace: 'pre-line',
                  color: 'inherit',
                }}
              >
                {rest.join('\n')}
              </Typography>
            </Box>
          </Collapse>
        )}
      </Box>
    </SnackbarContent>
  );
});

export const ToastProvider = (props: SnackbarProviderProps) => {
  return (
    <SnackbarProvider
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={3000}
      Components={{
        default: ExpandableSnackbar,
        success: ExpandableSnackbar,
        error: ExpandableSnackbar,
        warning: ExpandableSnackbar,
        info: ExpandableSnackbar,
      }}
      action={(snackbarId) => (
        <IconButton onClick={() => closeSnackbar(snackbarId)} size="small">
          <CloseIcon />
        </IconButton>
      )}
      maxSnack={3}
      {...props}
    />
  );
};
