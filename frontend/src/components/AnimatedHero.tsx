import { useEffect, useState } from 'react';

import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

const heroItems = [
  { type: 'icon', icon: <LocalShippingIcon sx={{ fontSize: 120, color: 'primary.main' }} /> },
  { type: 'icon', icon: <TrackChangesIcon sx={{ fontSize: 120, color: 'primary.main' }} /> },
  { type: 'icon', icon: <InventoryIcon sx={{ fontSize: 120, color: 'primary.main' }} /> },
];

export const AnimatedHero = () => {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % heroItems.length);
        setShow(true);
      }, 500);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Fade in={show} timeout={500}>
      <Box
        key={index}
        sx={{
          width: '100%',
          maxWidth: 300,
          height: { xs: 120, sm: 200 },
          mb: 3,
          mx: 'auto',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
        }}
      >
        {heroItems[index].icon}
      </Box>
    </Fade>
  );
};
