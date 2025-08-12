import { Outlet } from 'react-router-dom';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { Footer } from './Footer.tsx';
import { Navbar } from './Navbar.tsx';

export const AppLayout = () => {
  return (
    <Box display="flex" height={'100vh'} flexDirection="column">
      <Navbar />
      <Box component="main" flexGrow={1} display="flex" mt={9} mb={2} mx={2}>
        <Paper
          elevation={1}
          sx={{
            flex: 1,
            bgcolor: 'background.paper',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 2,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              minHeight: 0,
            }}
          >
            <Outlet />
          </Box>
        </Paper>
      </Box>
      <Footer />
    </Box>
  );
};
