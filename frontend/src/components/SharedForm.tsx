import type { FormEvent, ReactNode } from 'react';
import type { Control, FieldValues } from 'react-hook-form';

import type { PickupPoint } from '@/apis/pickupPoints';

import Box from '@mui/material/Box';

import { SectionFields, type FieldConfig } from '@/components/FormSectionFields';
import { ParcelLocationMap } from '@/components/ParcelLocationMap';
import { SectionContainer } from '@/components/SectionContainer';

interface sharedFormProps<T extends FieldValues = FieldValues> {
  handleFormSubmit: (event: FormEvent) => void;
  deliveryType: string;
  control: Control<T>;
  handleAddressSelect: (point: PickupPoint | null) => void;
  height?: string;
  preferenceFields: FieldConfig<T>[][];
  recipientAddressFields: FieldConfig<T>[][];
  children?: ReactNode;
}

export const SharedForm = <T extends FieldValues = FieldValues>({
  handleFormSubmit,
  deliveryType,
  control,
  handleAddressSelect,
  height = '60vh',
  preferenceFields,
  recipientAddressFields,
  children,
}: sharedFormProps<T>) => {
  return (
    <form onSubmit={handleFormSubmit}>
      <SectionContainer title="Preferences">
        <SectionFields fields={preferenceFields} control={control} />
      </SectionContainer>
      {deliveryType === 'Home' && (
        <SectionContainer title="Recipient Address">
          <SectionFields fields={recipientAddressFields} control={control} />
        </SectionContainer>
      )}
      {deliveryType === 'Pickup Point' && (
        <Box display="flex" justifyContent="center">
          <ParcelLocationMap setSelectedPoint={handleAddressSelect} deliveryType="PICKUP_POINT" height={height} />
        </Box>
      )}
      {deliveryType === 'Parcel Box' && (
        <Box display="flex" justifyContent="center">
          <ParcelLocationMap setSelectedPoint={handleAddressSelect} deliveryType="PARCEL_BOX" height={height} />
        </Box>
      )}
      {children}
    </form>
  );
};
