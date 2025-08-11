import { type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DELIVERY_TYPE_NAME_CONVERTER,
  DeliveryEnum,
  PARCEL_FORM_DEFAULT_VALUES,
  PAYMENT_TYPE_NAME_CONVERTER,
  PaymentEnum,
  ROUTES,
} from '@/constants';
import { enqueueSnackbar } from 'notistack';

import { useParcelForm } from '@/hooks/useParcelForm';
import { useSmallScreen } from '@/hooks/useSmallScreen';
import { useFormContext } from '@/contexts/FormContext';
import type { CustomSnackbarOptions } from '@/providers/ToastProvider';

import { useCreateParcel } from '@/apis/parcel';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import Box from '@mui/material/Box';

import { NavigationButtons } from '@/components/NavigationButtons.tsx';
import { PageContainer } from '@/components/PageContainer';
import { QueryStates } from '@/components/QueryStates';
import { SharedForm } from '@/components/SharedForm';

import { parcelFields, shippingOptionsField, type ParcelFormSchema } from '@/utils/parcelComposition';

export const ParcelForm = () => {
  const { mutate, status: createParcelStatus } = useCreateParcel();
  const { getRecipientFormData, getPointId } = useFormContext();
  const isSmallScreen = useSmallScreen();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    getValues,
    deliveryType,
    handleReset,
    handleAddressSelect,
    handlePrevious,
  } = useParcelForm();

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
        phone: recipientFormData.phone.replace(/ /g, ''),
      },
      address: addressData,
      paymentType: PAYMENT_TYPE_NAME_CONVERTER[paymentType],
      deliveryType: DELIVERY_TYPE_NAME_CONVERTER[deliveryType],
    };

    console.log('Form submitted with data:', submittedData);
    mutate(submittedData, {
      onSuccess: () => {
        reset({ ...PARCEL_FORM_DEFAULT_VALUES });
        enqueueSnackbar('Parcel created successfully!', { variant: 'success' });
        void navigate(`/${ROUTES.RECIPIENT_FORM}`);
      },
    });
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    void handleSubmit(onSubmit)(event);
  };

  return (
    <QueryStates state={createParcelStatus}>
      <Box px={isSmallScreen ? 0 : 20} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <PageContainer icon={<LocationOnIcon />} title="Parcel Data">
          <SharedForm
            handleFormSubmit={handleFormSubmit}
            deliveryType={deliveryType}
            control={control}
            handleAddressSelect={handleAddressSelect}
            height="50vh"
            preferenceFields={shippingOptionsField}
            recipientAddressFields={parcelFields}
          />
        </PageContainer>
        <NavigationButtons
          onPrevious={handlePrevious}
          onNext={() => {
            if (getValues('deliveryType') !== 'Home' && !getPointId().pointId)
              enqueueSnackbar('Please choose an address from the map', {
                variant: 'error',
                headerMessage: 'No address was provided',
              } as CustomSnackbarOptions);
            void handleSubmit(onSubmit)();
          }}
        />
      </Box>
    </QueryStates>
  );
};
