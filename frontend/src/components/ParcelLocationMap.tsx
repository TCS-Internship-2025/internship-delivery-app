import Map from 'react-map-gl/mapbox';

import 'mapbox-gl/dist/mapbox-gl.css';

import { mapboxAccessToken } from '@/constants';

import { useTheme } from '@/providers/ThemeProvider.tsx';

import Box from '@mui/material/Box';

export const ParcelLocationMap = () => {
  const { mapboxStyle } = useTheme();

  return (
    <Box display="flex" justifyContent="center" width="100%" mt={2}>
      <Box width="80%">
        <Map
          mapboxAccessToken={mapboxAccessToken}
          initialViewState={{
            longitude: 19.0402,
            latitude: 47.4979,
            zoom: 12,
          }}
          style={{ width: '100%', height: 500 }}
          mapStyle={mapboxStyle}
        />
      </Box>
    </Box>
  );
};
