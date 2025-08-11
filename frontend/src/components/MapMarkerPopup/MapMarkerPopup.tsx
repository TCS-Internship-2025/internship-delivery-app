import { Popup } from 'react-map-gl/mapbox';

import type { PickupPoint } from '@/apis/pickupPoints';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import './MapMarkerPopup.css';

import { useFormContext } from '@/contexts/FormContext';

interface MapMarkerPopupProps {
  selectedMarker: PickupPoint;
  setSelectedMarker: (point: PickupPoint | null) => void;
  setSelectedPoint: (point: PickupPoint | null) => void;
}
export const MapMarkerPopup = ({ selectedMarker, setSelectedMarker, setSelectedPoint }: MapMarkerPopupProps) => {
  const { updateFormData, getPointId } = useFormContext();

  const point_ = getPointId();

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
        <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 'bold' }} alignSelf={'center'}>
          {selectedMarker.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.primary' }}>
          {selectedMarker.address.line1}
          <br />
          {selectedMarker.address.line2}
        </Typography>
        {point_.pointId === selectedMarker.id ||
        (point_.latitude === selectedMarker.latitude && point_.longitude === selectedMarker.longitude) ? null : (
          <Button
            onClick={() => {
              setSelectedPoint(selectedMarker);
              updateFormData({
                pointId: selectedMarker.id,
                longitude: selectedMarker.longitude,
                latitude: selectedMarker.latitude,
              });
              setSelectedMarker(null);
            }}
            variant="contained"
            color="primary"
            size="small"
          >
            Select
          </Button>
        )}
      </Box>
    </Popup>
  );
};
