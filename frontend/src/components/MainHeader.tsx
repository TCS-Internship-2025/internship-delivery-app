import { useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';

import PersonIcon from '@mui/icons-material/Person';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { BoxIcon } from './BoxIcon.tsx';

export const MainHeader = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const getPageInfo = () => {
    if (location.pathname.includes(ROUTES.PAGE1)) return { title: 'Page1', progress: 25 };
    if (location.pathname.includes(ROUTES.PAGE2)) return { title: 'Page2', progress: 50 };
    if (location.pathname.includes(ROUTES.PAGE3)) return { title: 'Page3', progress: 75 };
    if (location.pathname.includes(ROUTES.PAGE4)) return { title: 'Page4', progress: 95 };
    if (location.pathname.includes(ROUTES.PARCELS)) return { title: 'My Parcels', progress: 100 };
    if (location.pathname.includes(`${ROUTES.PAGE5}/${ROUTES.SUCCESS}`))
      return { title: 'Something was successful', progress: 100 };
    if (location.pathname.includes(`${ROUTES.PAGE5}/${ROUTES.ERROR}`))
      return { title: 'Technical error', progress: 100 };
    return { title: 'Pending ...' };
  };

  if (isHomePage) {
    return;
  }

  const pageInfo = getPageInfo();

  return (
    <Paper
      elevation={1}
      sx={{
        mb: 1,
        borderRadius: 2,
        borderEndEndRadius: 6,
        borderEndStartRadius: 6,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Something
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={400}>
            /
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {pageInfo.title}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <BoxIcon
            icon={<PersonIcon />}
            sx={{
              width: 28,
              height: 28,
              mr: 0,
              backgroundColor: 'action.selected',
              '& svg': {
                color: 'text.secondary',
                fontSize: 20,
              },
            }}
          />
          <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
            {'Your Account'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {'more extra stuff'}
          </Typography>
        </Box>
      </Box>

      <LinearProgress
        variant={typeof pageInfo.progress === 'number' ? 'determinate' : 'indeterminate'}
        value={typeof pageInfo.progress === 'number' ? pageInfo.progress : undefined}
        sx={{
          height: 6,
          borderEndEndRadius: 6,
          borderEndStartRadius: 6,
          bgcolor: 'primary.light',
          '& .MuiLinearProgress-bar': {
            bgcolor: 'primary.main',
          },
        }}
      />
    </Paper>
  );
};
