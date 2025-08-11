import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { ADDRESS_CHANGE_DEFAULT_VALUES, DeliveryEnum } from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';

import { useFormContext } from '@/contexts/FormContext';

import type { ParcelData } from '@/apis/parcelGet';
import type { PickupPoint } from '@/apis/pickupPoints';

import { addressChangeSchema, type AddressChangeSchema } from '@/utils/parcelComposition';
import { deliveryConverter } from '@/utils/parcelTypeConverter';

interface UseAddressChangeFormProps {
  data?: ParcelData;
}

export const useAddressChangeForm = ({ data }: UseAddressChangeFormProps) => {
  const { updateFormData } = useFormContext();
  const { handleSubmit, control, watch, reset, getValues } = useForm<AddressChangeSchema>({
    resolver: zodResolver(addressChangeSchema),
    mode: 'onChange',
    defaultValues: ADDRESS_CHANGE_DEFAULT_VALUES,
  });

  const deliveryType = watch('deliveryType');
  const address = data ? data.recipient.address : ADDRESS_CHANGE_DEFAULT_VALUES;
  const initialDeliveryType = deliveryConverter(data?.deliveryType);

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
    if (!data) return false;

    const [country, postalCode, line1, city, line2, apartment, building, latitude, longitude] = watchedFields;

    const allEmpty =
      !country &&
      !postalCode &&
      !line1 &&
      !city &&
      !line2 &&
      !apartment &&
      !building &&
      (latitude === null || latitude === undefined || !latitude) &&
      (longitude === null || longitude === undefined || !longitude);

    if (deliveryType !== initialDeliveryType && allEmpty) {
      return false;
    }

    const addressFieldsChanged =
      country !== address.country ||
      postalCode !== address.postalCode ||
      line1 !== address.line1 ||
      city !== address.city ||
      (line2 ?? '') !== (address.line2 ?? '') ||
      (apartment ?? '') !== (address.apartment ?? '') ||
      (building ?? '') !== (address.building ?? '') ||
      latitude !== address.latitude ||
      longitude !== address.longitude;

    return addressFieldsChanged;
  }, [data, address, deliveryType, watchedFields, initialDeliveryType]);

  const handleCurrentAddressData = useCallback(
    (deliveryType?: DeliveryEnum, requestReason?: string | null) => {
      if (data) {
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
    [reset, data, updateFormData, address, initialDeliveryType]
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
