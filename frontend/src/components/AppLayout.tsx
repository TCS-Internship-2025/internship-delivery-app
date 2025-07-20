import { Outlet } from 'react-router-dom';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { MainHeader } from './MainHeader.tsx';
import { Sidebar } from './Sidebar.tsx';

export const AppLayout = () => {
  return (
    <Box display="flex" height="100vh" p={1} gap={2} bgcolor={'background.default'}>
      <Sidebar />
      <Box component="main" flexGrow={1} display="flex" flexDirection="column" gap={1}>
        <MainHeader />
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
    </Box>
  );
};
