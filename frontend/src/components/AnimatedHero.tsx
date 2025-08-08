import { useEffect, useState } from 'react';

import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

const heroItems = [
  { type: 'image', src: '/image.png' },
  { type: 'icon', icon: <LocalShippingIcon sx={{ fontSize: 120, color: 'primary.main' }} /> },
  { type: 'icon', icon: <Inventory2OutlinedIcon sx={{ fontSize: 120, color: 'primary.main' }} /> },
];

export const AnimatedHero = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % heroItems.length), 2500);
    return () => clearInterval(interval);
  }, []);
  return (
    <Fade in timeout={1000} key={index}>
      <Box
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
        {heroItems[index].type === 'image' ? (
          <img
            src={heroItems[index].src}
            alt="SwiftParcel logo"
            style={{
              width: '80%',
              height: '80%',
              objectFit: 'contain',
              transition: 'opacity 1s',
            }}
          />
        ) : (
          heroItems[index].icon
        )}
      </Box>
    </Fade>
  );
};
