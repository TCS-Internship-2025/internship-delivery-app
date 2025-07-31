import { Popup } from 'react-map-gl/mapbox';
import type { PickupPoint } from '@/types/PickupPoint';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import './MapMarkerPopup.css';

interface MapMarkerPopupProps {
  selectedMarker: PickupPoint;
  setSelectedMarker: (point: PickupPoint | null) => void;
  setSelectedPoint: (point: PickupPoint | null) => void;
}
export const MapMarkerPopup = ({ selectedMarker, setSelectedMarker, setSelectedPoint }: MapMarkerPopupProps) => {
  return (
    <Popup
      key={selectedMarker.id}
      longitude={selectedMarker.longitude}
      latitude={selectedMarker.latitude}
      anchor="top"
      closeOnClick={false}
      onClose={() => setSelectedMarker(null)}
      offset={10}
      className="themed-popup"
    >
      <Box
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'primary.main',
          borderRadius: 1,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
          {selectedMarker.name}
        </Typography>
        <Button
          onClick={() => {
            setSelectedPoint(selectedMarker);
            setSelectedMarker(null);
          }}
          variant="contained"
          color="primary"
          size="small"
        >
          Select
        </Button>
      </Box>
    </Popup>
  );
};
