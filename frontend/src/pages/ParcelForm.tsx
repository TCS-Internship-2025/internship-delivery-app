import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  DELIVERY_TYPE_NAME_CONVERTER,
  DeliveryEnum,
  PARCEL_FORM_DEFAULT_VALUES,
  PAYMENT_TYPE_NAME_CONVERTER,
  PaymentEnum,
  ROUTES,
} from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';

import { useFormContext } from '@/contexts/FormContext';

import { useCreateParcel } from '@/apis/parcel';
import type { PickupPoint } from '@/apis/pickupPoints';

import QuestionMark from '@mui/icons-material/QuestionMark';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { SectionFields } from '@/components/FormSectionFields';
import { NavigationButtons } from '@/components/NavigationButtons.tsx';
import { PageContainer } from '@/components/PageContainer';
import { ParcelLocationMap } from '@/components/ParcelLocationMap';
import { SectionContainer } from '@/components/SectionContainer';

import { parcelFields, parcelFormSchema, shippingOptionsField, type ParcelFormSchema } from '@/utils/parcelComposition';

export const ParcelForm = () => {
  const [selectedParcel, setSelectedParcel] = useState<PickupPoint | null>();
  const { mutate, isPending } = useCreateParcel();
  const { updateFormData, getParcelFormData, getRecipientFormData, resetParcelForm } = useFormContext();
  const navigate = useNavigate();

  const { control, handleSubmit, watch, reset, getValues } = useForm<ParcelFormSchema>({
    resolver: zodResolver(parcelFormSchema),
    mode: 'onChange',
    defaultValues: getParcelFormData(),
  });
  const deliveryType = watch('deliveryType');

  const handleReset = useCallback(
    (deliveryType: DeliveryEnum, paymentType: PaymentEnum | '') => {
      console.log('resetting');

      resetParcelForm({
        deliveryType,
        paymentType,
      });

      reset({
        ...PARCEL_FORM_DEFAULT_VALUES,
        deliveryType,
        paymentType,
      });
    },
    [reset, resetParcelForm]
  );

  watch((data, { name }) => {
    if (name === 'deliveryType') {
      handleReset(data.deliveryType as DeliveryEnum, data.paymentType as PaymentEnum | '');
    }
  });

  const onSubmit = (data: ParcelFormSchema) => {
    const { paymentType, deliveryType, ...addressData } = data;
    const recipientFormData = getRecipientFormData();

    const submittedData = {
      recipient: {
        ...recipientFormData,
        address: {
          ...addressData,
        },
      },
      paymentType: PAYMENT_TYPE_NAME_CONVERTER[paymentType],
      deliveryType: DELIVERY_TYPE_NAME_CONVERTER[deliveryType],
    };

    console.log('Form submitted with data:', submittedData);
    mutate(submittedData, {
      onSuccess: () => {
        reset({ ...PARCEL_FORM_DEFAULT_VALUES });
        void navigate(`/${ROUTES.RECIPIENT_FORM}`);
      },
    });
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    void handleSubmit(onSubmit)(event);
  };

  const handlePrevious = () => {
    updateFormData({ ...getValues() });
    void navigate(`/${ROUTES.RECIPIENT_FORM}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {isPending ? (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <PageContainer icon={<QuestionMark />} title="Parcel Data">
            <form onSubmit={handleFormSubmit}>
              <SectionContainer title="Preferences">
                <SectionFields fields={shippingOptionsField} control={control} />
              </SectionContainer>
              {deliveryType === 'Home' && (
                <SectionContainer title="Recipient Address">
                  <SectionFields fields={parcelFields} control={control} />
                </SectionContainer>
              )}
              {deliveryType === 'Pickup Point' && (
                <Box display="flex" justifyContent="center">
                  <p>{selectedParcel?.name}</p>
                  {/* Testing*/}
                  <ParcelLocationMap setSelectedPoint={setSelectedParcel} />
                </Box>
              )}
            </form>
          </PageContainer>
          <NavigationButtons
            onPrevious={handlePrevious}
            onNext={() => {
              void handleSubmit(onSubmit)();
            }}
          />
        </>
      )}
    </Box>
  );
};
