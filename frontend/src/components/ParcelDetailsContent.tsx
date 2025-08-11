import React, { useEffect, useState } from 'react';
import { getParcelChipData } from '../utils/parcelChipData.ts';

import { useTheme } from '@/providers/ThemeProvider.tsx';

import type { ParcelData } from '@/apis/parcelGet.ts';
import { getLonLat } from '@/services/geoCoder.ts';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import type { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { CoordinatesMap } from '@/components/CoordinatesMap.tsx';
import { QueryStates } from '@/components/QueryStates.tsx';

import { deliveryConverter, paymentConverter } from '@/utils/parcelTypeConverter';

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return 'Not specified';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
};

interface DataDisplayProps {
  label?: string;
  children: React.ReactNode;
}

const DataDisplay = ({ label, children, ...props }: DataDisplayProps) => {
  return (
    <Typography variant="body1" fontSize={{ xs: 20, md: 24 }} ml={{ xs: 1.5, md: 3 }} {...props}>
      {label}
      {label && ': '}
      {children}
    </Typography>
  );
};

interface CardDisplayProps {
  mode: string;
  sx?: SxProps<Theme>;
  children: React.ReactNode;
}

const CardDisplay = ({ mode, sx, children }: CardDisplayProps) => {
  return (
    <Card
      elevation={3}
      sx={{
        width: { xs: '100%', md: '40%' },
        p: { xs: 2, md: 4 },
        bgcolor: mode === 'dark' ? '#222624' : 'whitesmoke',
        ...sx,
      }}
    >
      {children}
    </Card>
  );
};

interface Coordinates {
  latitude: number;
  longitude: number;
}

export const ParcelDetailsContent = ({ parcelData }: { parcelData: ParcelData }) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const { mode } = useTheme();

  const parcelChipData = getParcelChipData(parcelData?.currentStatus);

  useEffect(() => {
    const geocodeAddress = async () => {
      if (!parcelData?.recipient.address) return;

      const address = parcelData.recipient.address;

      setIsLoadingCoordinates(true);
      setGeocodingError(null);

      try {
        const result = await getLonLat(address);

        if (result) {
          setCoordinates({
            latitude: result.lat,
            longitude: result.lon,
          });
        } else {
          setGeocodingError('Could not find coordinates for this address');
        }
      } catch (error) {
        setGeocodingError('Failed to geocode address' + (error as string));
      } finally {
        setIsLoadingCoordinates(false);
      }
    };

    void geocodeAddress();
  }, [parcelData]);

  const mapCoordinates = coordinates ?? {
    latitude: parcelData?.recipient.address.latitude ?? 0,
    longitude: parcelData?.recipient.address.longitude ?? 0,
  };

  return (
    <>
      <Typography
        variant="h3"
        fontSize={{ xs: 28, md: 36 }}
        ml={{ xs: 0, md: 2 }}
        mt={{ xs: 0, md: 1 }}
        mb={{ xs: 1.5, md: 3 }}
        color="primary"
      >
        Parcel Details
      </Typography>
      <Box display={{ xs: 'block', md: 'flex' }} justifyContent={'space-evenly'}>
        <CardDisplay mode={mode}>
          <DataDisplay label="Tracking code">{parcelData?.trackingCode ?? 'Unknown'}</DataDisplay>
          <DataDisplay label="Delivery type">{deliveryConverter(parcelData?.deliveryType)}</DataDisplay>
          <DataDisplay label="Payment type">{paymentConverter(parcelData?.paymentType)}</DataDisplay>
        </CardDisplay>
        <CardDisplay mode={mode} sx={{ mt: { xs: 3, md: 0 } }}>
          <DataDisplay label="Created at">{formatDate(parcelData?.createdAt)}</DataDisplay>
          <DataDisplay label="Updated at">{formatDate(parcelData?.updatedAt)}</DataDisplay>
          <Box sx={{ float: 'right' }} mr={{ xs: 1.5, md: 3 }} mt={{ xs: 2.5, md: 5 }}>
            <Chip {...parcelChipData} sx={{ fontSize: 20, padding: 2.5 }} />
          </Box>
        </CardDisplay>
      </Box>
      <Typography
        variant="h3"
        fontSize={{ xs: 24, md: 32 }}
        ml={{ xs: 0, md: 2 }}
        mt={{ xs: 4, md: 6 }}
        mb={{ xs: 1, md: 2 }}
        color="primary"
      >
        Recipient data
      </Typography>
      <Box display={{ xs: 'block', md: 'flex' }} justifyContent={'space-evenly'} mb={{ xs: 5, md: 10 }}>
        <CardDisplay mode={mode}>
          <DataDisplay label="Name">{parcelData?.recipient.name ?? 'Not specified'}</DataDisplay>
          <DataDisplay label="Email">{parcelData?.recipient.email ?? 'Not specified'}</DataDisplay>
          <DataDisplay label="Phone">{parcelData?.recipient.phone ?? 'Not specified'}</DataDisplay>
          <DataDisplay label="Birth date">{parcelData?.recipient.birthDate ?? 'Not specified'}</DataDisplay>
        </CardDisplay>
        <CardDisplay mode={mode} sx={{ mt: { xs: 3, md: 0 } }}>
          <Typography variant="body1" fontSize={{ xs: 21, md: 25 }} ml={{ xs: 1.5, md: 3 }}>
            Address:
          </Typography>
          <DataDisplay>
            {parcelData?.recipient.address.country}, {parcelData?.recipient.address.postalCode}{' '}
            {parcelData?.recipient.address.city}
          </DataDisplay>
          <DataDisplay>
            {parcelData?.recipient.address.line1}, {parcelData?.recipient.address.line2}
          </DataDisplay>
          <DataDisplay>
            {parcelData?.recipient.address.building ?? undefined}
            {parcelData?.recipient.address.building && parcelData?.recipient.address.apartment && ', '}
            {parcelData?.recipient.address.building && `apartment ${parcelData?.recipient.address.apartment}`}
          </DataDisplay>
        </CardDisplay>
      </Box>
      <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'}>
        <QueryStates
          isPending={isLoadingCoordinates}
          pendingMessage="Loading map coordinates..."
          isError={geocodingError ? true : false}
          errorTitle={geocodingError ?? undefined}
        >
          {coordinates && <CoordinatesMap longitude={mapCoordinates.longitude} latitude={mapCoordinates.latitude} />}
        </QueryStates>
      </Box>
    </>
  );
};
