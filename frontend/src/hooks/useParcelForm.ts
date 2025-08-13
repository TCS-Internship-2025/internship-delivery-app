import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { PARCEL_FORM_DEFAULT_VALUES, ROUTES, type DeliveryEnum, type PaymentEnum } from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';

import { useFormContext } from '@/contexts/FormContext';

import type { PickupPoint } from '@/apis/pickupPoints';

import { parcelFormSchema, type ParcelFormSchema } from '@/utils/parcelComposition';

export const useParcelForm = () => {
  const { updateFormData, getParcelFormData, resetParcelForm } = useFormContext();
  const navigate = useNavigate();

  const { control, handleSubmit, watch, reset, getValues } = useForm<ParcelFormSchema>({
    resolver: zodResolver(parcelFormSchema),
    mode: 'onChange',
    defaultValues: getParcelFormData(),
  });

  const deliveryType = watch('deliveryType');

  const handleReset = useCallback(
    (deliveryType: DeliveryEnum, paymentType: PaymentEnum | '') => {
      resetParcelForm({ deliveryType, paymentType });
      reset({
        ...PARCEL_FORM_DEFAULT_VALUES,
        deliveryType,
        paymentType,
      });
    },
    [reset, resetParcelForm]
  );

  const handleAddressSelect = useCallback(
    (point: PickupPoint | null) => {
      const currentDeliveryType = getValues('deliveryType');
      const currentPaymentType = getValues('paymentType');

      if (point)
        reset({
          ...point.address,
          deliveryType: currentDeliveryType,
          paymentType: currentPaymentType,
        });
    },
    [reset, getValues]
  );

  const handlePrevious = () => {
    updateFormData({ ...getValues() });
    void navigate(`/${ROUTES.RECIPIENT_FORM}`);
  };

  return {
    control,
    handleSubmit,
    watch,
    reset,
    getValues,
    deliveryType,
    handleReset,
    handleAddressSelect,
    handlePrevious,
  };
};
