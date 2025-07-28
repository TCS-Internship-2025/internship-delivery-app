import Map, { Marker } from 'react-map-gl/mapbox';

import 'mapbox-gl/dist/mapbox-gl.css';

import { useState } from 'react';
import { mapboxAccessToken } from '@/constants';
import type { PickupPoint } from '@/types/PickupPoint';

import { useTheme } from '@/providers/ThemeProvider.tsx';

import LocationPinIcon from '@mui/icons-material/LocationPin';
import Box from '@mui/material/Box';

import { MapMarkerPopup } from './MapMarkerPopup/MapMarkerPopup';

// Mock data
// cSpell:disable
const pickupPoints = [
  { id: 'pp1', name: 'Pickup Point 1 - Deák Ferenc tér', latitude: 47.4979, longitude: 19.0402 },
  { id: 'pp2', name: 'Pickup Point 2 - Oktogon', latitude: 47.5056, longitude: 19.0659 },
  { id: 'pp3', name: 'Pickup Point 3 - Kálvin tér', latitude: 47.4893, longitude: 19.0615 },
  { id: 'pp4', name: 'Pickup Point 4 - Nyugati pályaudvar', latitude: 47.5104, longitude: 19.0561 },
  { id: 'pp5', name: 'Pickup Point 5 - Keleti pályaudvar', latitude: 47.5009, longitude: 19.0821 },
  { id: 'pp6', name: 'Pickup Point 6 - Buda Castle', latitude: 47.4962, longitude: 19.0399 },
  { id: 'pp7', name: 'Pickup Point 7 - Móricz Zsigmond körtér', latitude: 47.4772, longitude: 19.0475 },
  { id: 'pp8', name: 'Pickup Point 8 - Corvin-negyed', latitude: 47.4857, longitude: 19.0703 },
  { id: 'pp9', name: 'Pickup Point 9 - Árpád híd', latitude: 47.5313, longitude: 19.0554 },
  { id: 'pp10', name: 'Pickup Point 10 - Gellért tér', latitude: 47.4842, longitude: 19.0534 },
  { id: 'pp11', name: "Pickup Point 11 - Heroes' Square", latitude: 47.5145, longitude: 19.0772 },
  { id: 'pp12', name: 'Pickup Point 12 - Újbuda-központ', latitude: 47.4738, longitude: 19.0496 },
  { id: 'pp13', name: 'Pickup Point 13 - Népliget', latitude: 47.4769, longitude: 19.0984 },
  { id: 'pp14', name: 'Pickup Point 14 - Batthyány tér', latitude: 47.5074, longitude: 19.0381 },
  { id: 'pp15', name: 'Pickup Point 15 - Blaha Lujza tér', latitude: 47.4972, longitude: 19.0704 },
];
/* cSpell:enable */
interface ParcelLocationMapProps {
  setSelectedPoint: (point: PickupPoint | null) => void;
}
/**
 * Interactive map component displaying pickup points across Budapest.
 * Features clickable markers that show detailed popups and allows users to select pickup locations.
 * @param setSelectedPoint - Callback function triggered when a user selects a pickup point from the popup.
 *                          Receives the selected PickupPoint object or null when deselected.
 * @returns Mapbox map component with interactive pickup point markers and selection functionality
 */
export const ParcelLocationMap = ({ setSelectedPoint }: ParcelLocationMapProps) => {
  const { mapboxStyle } = useTheme();
  const [selectedMarker, setSelectedMarker] = useState<PickupPoint | null>(null);
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
              <LocationPinIcon
                color={selectedMarker?.id === point.id ? 'error' : 'primary'}
                sx={{ fontSize: 42, cursor: 'pointer' }}
              />
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
};
