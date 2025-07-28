import { useCallback, useEffect, type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateParcel } from '@/apis/parcel';

import QuestionMark from '@mui/icons-material/QuestionMark';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { SectionFields } from '@/components/FormSectionFields.tsx';
import { NavigationButtons } from '@/components/NavigationButtons.tsx';
import { PageContainer } from '@/components/PageContainer';
import { SectionContainer } from '@/components/SectionContainer.tsx';

import {
  beneficiaryFields,
  descriptionField,
  page1FormSchema,
  parcelFields,
  type Page1FormSchema,
} from '@/utils/parcelComposition';

export const Page1 = () => {
  const { mutate, isPending } = useCreateParcel();

  const { control, handleSubmit, watch, resetField, getValues } = useForm<Page1FormSchema>({
    resolver: zodResolver(page1FormSchema),
    mode: 'onChange',
    defaultValues: {
      mobilePhone: '',
    },
  });

  const deliveryType = watch('deliveryType');

  const onSubmit = (data: Page1FormSchema) => {
    console.log('Form submitted with data:', data);
    mutate(data);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    void handleSubmit(onSubmit)(event);
  };

  const clearAllParcelFields = useCallback(() => {
    const fieldNames = parcelFields.flat().map((field) => field.name);

    let hasNonEmptyFields = false;

    fieldNames.forEach((fieldName) => {
      const currentValue = getValues(fieldName);
      if (currentValue && currentValue !== '') {
        hasNonEmptyFields = true;
        resetField(fieldName);
      }
    });

    if (hasNonEmptyFields) {
      console.log('changing');
    }
  }, [resetField, getValues]);

  useEffect(() => {
    clearAllParcelFields();
  }, [deliveryType, clearAllParcelFields]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {isPending ? (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <PageContainer icon={<QuestionMark />} title="Page1">
            <form onSubmit={handleFormSubmit}>
              <SectionContainer title="Recipient Details">
                <SectionFields fields={beneficiaryFields} control={control} />
              </SectionContainer>
              <SectionContainer title="Shipping Options">
                <SectionFields fields={descriptionField} control={control} />
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
            previousPath="/"
            onNext={() => {
              void handleSubmit(onSubmit)();
            }}
          />
        </>
      )}
    </Box>
  );
};
