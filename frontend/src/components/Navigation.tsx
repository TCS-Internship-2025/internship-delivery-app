import type { ReactNode } from 'react';

import Box from '@mui/material/Box';

import DrawerComponent from './DrawerComponent';

export const Navigation = ({
  children,
  isSmallScreen,
  handleDrawerClick,
  open,
}: {
  children: ReactNode;
  open: boolean;
  isSmallScreen: boolean;
  handleDrawerClick: () => void;
}) => {
  if (!isSmallScreen) return <>{children}</>;
  if (isSmallScreen)
    return (
      <DrawerComponent
        handleDrawerClick={() => {
          handleDrawerClick();
        }}
        open={open}
      >
        <Box>{children}</Box>
      </DrawerComponent>
    );
};
