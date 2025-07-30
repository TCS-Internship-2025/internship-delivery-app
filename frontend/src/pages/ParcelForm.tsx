import { useCallback, useEffect, type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { parcelFormDefaultValues, ROUTES } from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';

import { useFormContext } from '@/contexts/FormContext';

import { useCreateParcel } from '@/apis/parcel';

import QuestionMark from '@mui/icons-material/QuestionMark';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { SectionFields } from '@/components/FormSectionFields';
import { NavigationButtons } from '@/components/NavigationButtons.tsx';
import { PageContainer } from '@/components/PageContainer';
import { SectionContainer } from '@/components/SectionContainer';

import { parcelFields, parcelFormSchema, shippingOptionsField, type ParcelFormSchema } from '@/utils/parcelComposition';

export const ParcelForm = () => {
  const { mutate, isPending } = useCreateParcel();
  const formContext = useFormContext();

  const { control, handleSubmit, watch, reset, getValues } = useForm<ParcelFormSchema>({
    resolver: zodResolver(parcelFormSchema),
    mode: 'onChange',
    defaultValues: formContext.getParcelFormData(),
  });
  const deliveryType = watch('deliveryType');

  const handleReset = useCallback(() => {
    const currentDeliveryType = getValues('deliveryType');
    reset({
      ...parcelFormDefaultValues,
      deliveryType: currentDeliveryType,
    });
  }, [getValues, reset]);

  useEffect(() => {
    handleReset();
  }, [handleReset, deliveryType]);

  const onSubmit = (data: ParcelFormSchema) => {
    const submittedData = { ...formContext.getRecipientFormData(), ...data };
    console.log('Form submitted with data:', submittedData);
    mutate(submittedData);
    handleReset();
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    void handleSubmit(onSubmit)(event);
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
                // Map generation will Happen here
                <p> Map here </p>
              )}
            </form>
          </PageContainer>
          <NavigationButtons
            previousPath={`/${ROUTES.RECIPIENT_FORM}`}
            onNext={() => {
              void handleSubmit(onSubmit)();
            }}
          />
        </>
      )}
    </Box>
  );
};
