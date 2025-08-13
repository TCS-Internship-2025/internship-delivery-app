import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { ADDRESS_CHANGE_DEFAULT_VALUES, DeliveryEnum } from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';

import { useFormContext } from '@/contexts/FormContext';

import type { ParcelData } from '@/apis/parcel';
import type { PickupPoint } from '@/apis/pickupPoints';

import { addressChangeSchema, type AddressChangeSchema } from '@/utils/parcelComposition';
import { deliveryConverter } from '@/utils/parcelTypeConverter';

interface UseAddressChangeFormProps {
  parcelData?: ParcelData;
}

export const useAddressChangeForm = ({ parcelData }: UseAddressChangeFormProps) => {
  const { updateFormData } = useFormContext();
  const { handleSubmit, control, watch, reset, getValues } = useForm<AddressChangeSchema>({
    resolver: zodResolver(addressChangeSchema),
    mode: 'onChange',
    defaultValues: ADDRESS_CHANGE_DEFAULT_VALUES,
  });

  const deliveryType = watch('deliveryType');
  const address = parcelData ? parcelData.address : ADDRESS_CHANGE_DEFAULT_VALUES;
  const initialDeliveryType = deliveryConverter(parcelData?.deliveryType);

  const watchedFields = watch([
    'country',
    'postalCode',
    'line1',
    'city',
    'line2',
    'apartment',
    'building',
    'latitude',
    'longitude',
  ]);

  const hasFormChanged = useMemo(() => {
    if (!parcelData) return false;

    const [country, postalCode, line1, city, line2, apartment, building, latitude, longitude] = watchedFields;

    const isEmptyOrSpaces = (value: string | undefined | null) => {
      return !value || value.trim() === '';
    };

    const allEmpty =
      isEmptyOrSpaces(postalCode) &&
      isEmptyOrSpaces(line1) &&
      isEmptyOrSpaces(city) &&
      isEmptyOrSpaces(line2) &&
      isEmptyOrSpaces(apartment) &&
      isEmptyOrSpaces(building) &&
      (latitude === null || latitude === undefined || !latitude) &&
      (longitude === null || longitude === undefined || !longitude);

    if (deliveryType !== initialDeliveryType && allEmpty) {
      return false;
    }

    const normalizeString = (value: string | undefined | null) => {
      return (value ?? '').trim();
    };

    const addressFieldsChanged =
      country !== address.country ||
      normalizeString(postalCode) !== normalizeString(address.postalCode) ||
      normalizeString(line1) !== normalizeString(address.line1) ||
      normalizeString(city) !== normalizeString(address.city) ||
      normalizeString(line2) !== normalizeString(address.line2) ||
      normalizeString(apartment) !== normalizeString(address.apartment) ||
      normalizeString(building) !== normalizeString(address.building) ||
      latitude !== address.latitude ||
      longitude !== address.longitude;

    return addressFieldsChanged;
  }, [parcelData, address, deliveryType, watchedFields, initialDeliveryType]);

  const handleCurrentAddressData = useCallback(
    (deliveryType?: DeliveryEnum, requestReason?: string | null) => {
      if (parcelData) {
        reset({
          ...address,
          deliveryType: deliveryType ?? initialDeliveryType,
          requestReason: requestReason,
        });
        updateFormData({
          longitude: address.longitude,
          latitude: address.latitude,
          pointId: null,
        });
      }
    },
    [reset, parcelData, updateFormData, address, initialDeliveryType]
  );

  const handleAddressSelect = useCallback(
    (point: PickupPoint | null) => {
      const currentDeliveryType = getValues('deliveryType');
      if (point) {
        reset({
          ...point.address,
          deliveryType: currentDeliveryType,
        });
      }
    },
    [reset, getValues]
  );

  return {
    handleSubmit,
    control,
    watch,
    reset,
    getValues,
    deliveryType,
    hasFormChanged,
    handleCurrentAddressData,
    handleAddressSelect,
    address,
    initialDeliveryType,
  };
};
