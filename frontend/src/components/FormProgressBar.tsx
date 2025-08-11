import { Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';

import { useSmallScreen } from '@/hooks/useSmallScreen';
import { FormProvider } from '@/providers/FormProvider';

import LinearProgress from '@mui/material/LinearProgress';

export const FormProgressBar = () => {
  const location = useLocation();

  const isSmallScreen = useSmallScreen();

  const getPageInfo = () => {
    if (location.pathname.includes(ROUTES.RECIPIENT_FORM)) return { progress: 0 };
    if (location.pathname.includes(ROUTES.PARCEL_FORM)) return { progress: 50 };
  };

  const pageInfo = getPageInfo();
  return (
    <FormProvider>
      <LinearProgress
        variant={typeof pageInfo?.progress === 'number' ? 'determinate' : 'indeterminate'}
        value={typeof pageInfo?.progress === 'number' ? pageInfo.progress : undefined}
        sx={{
          height: 6,
          borderStartEndRadius: 6,
          borderStartStartRadius: 6,
          mx: isSmallScreen ? 0 : 20,
        }}
      />
      <Outlet />
    </FormProvider>
  );
};
