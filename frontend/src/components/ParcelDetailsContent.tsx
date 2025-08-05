import React from 'react';
import { getParcelChipData } from '../utils/parcelChipData.ts';

import type { ParcelData } from '@/apis/parcelGet.ts';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { CoordinatesMap } from './CoordinatesMap.tsx';

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
    <Typography variant="body1" fontSize={{ xs: 20, md: 24 }} ml={{ xs: 2, md: 5 }} {...props}>
      {label}
      {label && ': '}
      {children}
    </Typography>
  );
};

export const ParcelDetailsContent = ({ parcelData }: { parcelData?: ParcelData }) => {
  const parcelChipData = getParcelChipData(parcelData?.currentStatus);

  return (
    <>
      <Typography
        variant="h3"
        fontSize={{ xs: 28, md: 36 }}
        ml={{ xs: 0, md: 2 }}
        mt={{ xs: 0, md: 1 }}
        mb={{ xs: 1.5, md: 3 }}
      >
        Parcel Details
      </Typography>
      <Box display={{ xs: 'block', md: 'flex' }}>
        <Box width={{ xs: '100%', md: '50%' }}>
          <DataDisplay label="Tracking code">{parcelData?.trackingCode ?? 'Unknown'}</DataDisplay>
          <DataDisplay label="Delivery type">{deliveryConverter(parcelData?.deliveryType)}</DataDisplay>
          <DataDisplay label="Payment type">{paymentConverter(parcelData?.paymentType)}</DataDisplay>
        </Box>
        <Box width={{ xs: '100%', md: '50%' }} mt={{ xs: 2, md: 0 }}>
          <DataDisplay label="Created at">{formatDate(parcelData?.createdAt)}</DataDisplay>
          <DataDisplay label="Updated at">{formatDate(parcelData?.updatedAt)}</DataDisplay>
          <Box sx={{ float: 'right' }} mr={{ xs: 7, md: 15 }} mt={{ xs: 2.5, md: 5 }}>
            <Chip {...parcelChipData} sx={{ fontSize: 20, padding: 2.5 }} />
          </Box>
        </Box>
      </Box>
      <Typography
        variant="h3"
        fontSize={{ xs: 24, md: 32 }}
        ml={{ xs: 0, md: 2 }}
        mt={{ xs: 4, md: 6 }}
        mb={{ xs: 1, md: 2 }}
      >
        Recipient data
      </Typography>
      <Box display={{ xs: 'block', md: 'flex' }} mb={{ xs: 4, md: 8 }}>
        <Box width={{ xs: '100%', md: '50%' }}>
          <DataDisplay label="Name">{parcelData?.recipient.name ?? 'Not specified'}</DataDisplay>
          <DataDisplay label="Email">{parcelData?.recipient.email ?? 'Not specified'}</DataDisplay>
          <DataDisplay label="Phone">{parcelData?.recipient.phone ?? 'Not specified'}</DataDisplay>
          <DataDisplay label="Birth date">{parcelData?.recipient.birthDate ?? 'Not specified'}</DataDisplay>
        </Box>
        <Box width={{ xs: '100%', md: '50%' }}>
          <Typography variant="body1" fontSize={{ xs: 21, md: 25 }} ml={{ xs: 1.5, md: 3 }} mt={{ xs: 3, md: 0 }}>
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
            {parcelData?.recipient.address.building && `${parcelData?.recipient.address.apartment}. lakás`}
          </DataDisplay>
        </Box>
      </Box>
      <Box display={'flex'} justifyContent={'center'}>
        {parcelData?.deliveryType !== 'HOME' && (
          <CoordinatesMap
            longitude={parcelData?.recipient.address.longitude ?? 0}
            latitude={parcelData?.recipient.address.latitude ?? 0}
          />
        )}
      </Box>
    </>
  );
};
