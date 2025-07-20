import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export const MissionErrorPage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <Container
          maxWidth={false}
          sx={{
            display: 'flex',
            border: '2px dashed grey',
            height: 1200, // This simulates large content
            flexDirection: 'column',
          }}
        >
          Your content will go here
        </Container>
      </Box>
    </Box>
  );
};
