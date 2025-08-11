import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 1.5,
        px: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        borderTop: 1,
        borderColor: 'divider',
        flexShrink: 0,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3,
            flexWrap: 'wrap',
          }}
        >
          <MuiLink
            component={Link}
            // TODO:  TO BE ADDED
            to="/gdpr"
            variant="body2"
            color="text.secondary"
            sx={{
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                color: 'primary.main',
              },
              transition: 'color 0.2s ease-in-out',
            }}
          >
            GDPR
          </MuiLink>

          <Divider orientation="vertical" flexItem sx={{ height: '16px' }} />

          <MuiLink
            component={Link}
            // TODO:  TO BE ADDED
            to="/faqs"
            variant="body2"
            color="text.secondary"
            sx={{
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                color: 'primary.main',
              },
              transition: 'color 0.2s ease-in-out',
            }}
          >
            FAQs
          </MuiLink>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} TCS. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
