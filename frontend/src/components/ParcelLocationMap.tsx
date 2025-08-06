import Map, { Marker } from 'react-map-gl/mapbox';

import 'mapbox-gl/dist/mapbox-gl.css';

import { useState } from 'react';
import { mapboxAccessToken } from '@/constants';

import { useFormContext } from '@/contexts/FormContext';
import { useTheme as useMuiTheme } from '@/providers/ThemeProvider.tsx';

import { useGetAllPickupPoints, type DeliveryType, type PickupPoint } from '@/apis/pickupPoints';

import LocationPinIcon from '@mui/icons-material/LocationPin';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';

import { MapMarkerPopup } from './MapMarkerPopup/MapMarkerPopup';

interface ParcelLocationMapProps {
  setSelectedPoint: (point: PickupPoint | null) => void;
  deliveryType: DeliveryType;
}
/**
 * Interactive map component displaying pickup points across Budapest.
 * Features clickable markers that show detailed popups and allows users to select pickup locations.
 * @param setSelectedPoint - Callback function triggered when a user selects a pickup point from the popup.
 * @param deliveryType - the type of delivery selected.
 * Usage: in the parent component put: const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);
 * @returns Mapbox map component with interactive pickup point markers and selection functionality
 */
export const ParcelLocationMap = ({ setSelectedPoint, deliveryType }: ParcelLocationMapProps) => {
  const { mapboxStyle } = useMuiTheme();
  const theme = useTheme();

  const { getPointId } = useFormContext();

  const [selectedMarker, setSelectedMarker] = useState<PickupPoint | null>(null);
  const {
    data: pickupPoints,
    isLoading: isPickupPointsLoading,
    isError,
  } = useGetAllPickupPoints({ deliveryType: deliveryType });
  if (isPickupPointsLoading) {
    return <CircularProgress />;
  } else if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Box maxWidth={400} textAlign="center">
          <Alert severity="error" variant="filled">
            Failed to load pickup points. Please check your connection or try again later.
          </Alert>
        </Box>
      </Box>
    );
  } else if (pickupPoints) {
    return (
      <Box display="flex" justifyContent="center" width="90%" mt={2} height="60vh">
        <Box width="80%" flexGrow={1}>
          <Map
            mapboxAccessToken={mapboxAccessToken}
            initialViewState={{
              longitude: 19.0402,
              latitude: 47.4979,
              zoom: 12,
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle={mapboxStyle}
          >
            {pickupPoints.map((point) => (
              <Marker
                key={point.id}
                longitude={point.longitude}
                latitude={point.latitude}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedMarker(point);
                }}
              >
                {getPointId() === point.id ? (
                  <WhereToVoteIcon
                    color="inherit"
                    sx={{
                      fontSize: 42,
                      cursor: 'pointer',
                      color: theme.palette.primary.markerSelected,
                    }}
                  />
                ) : (
                  <LocationPinIcon
                    color="inherit"
                    sx={{
                      fontSize: 42,
                      cursor: 'pointer',
                      color:
                        selectedMarker?.id === point.id
                          ? theme.palette.primary.markerSelected
                          : theme.palette.primary.marker,
                    }}
                  />
                )}
              </Marker>
            ))}
            {selectedMarker && (
              <MapMarkerPopup
                selectedMarker={selectedMarker}
                setSelectedMarker={setSelectedMarker}
                setSelectedPoint={setSelectedPoint}
              />
            )}
          </Map>
        </Box>
      </Box>
    );
  }
};
