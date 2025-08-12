import Map, { Marker } from 'react-map-gl/mapbox';

import 'mapbox-gl/dist/mapbox-gl.css';

import { mapboxAccessToken } from '@/constants';

import { useTheme as useMuiTheme } from '@/providers/ThemeProvider.tsx';

import LocationPinIcon from '@mui/icons-material/LocationPin';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

interface CoordinatesMapProps {
  longitude: number;
  latitude: number;
}

export const CoordinatesMap = ({ longitude, latitude }: CoordinatesMapProps) => {
  const { mapboxStyle } = useMuiTheme();
  const theme = useTheme();

  return (
    <Box display="flex" justifyContent="center" width="90%" mt={2} height="60vh">
      <Box width="80%" flexGrow={1}>
        <Map
          mapboxAccessToken={mapboxAccessToken}
          initialViewState={{
            longitude: longitude,
            latitude: latitude,
            zoom: 12,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle={mapboxStyle}
        >
          <Marker longitude={longitude} latitude={latitude} anchor="bottom">
            <LocationPinIcon
              color="inherit"
              sx={{
                fontSize: 42,
                cursor: 'default',
                color: theme.palette.primary.marker,
              }}
            />
          </Marker>
        </Map>
      </Box>
    </Box>
  );
};
