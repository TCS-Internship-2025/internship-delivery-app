import { useCallback, useEffect /*type FormEvent */ } from 'react';
import { useForm } from 'react-hook-form';
import { ROUTES } from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateParcel } from '@/apis/parcel';

import QuestionMark from '@mui/icons-material/QuestionMark';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { SectionFields } from '@/components/FormSectionFields';
import { NavigationButtons } from '@/components/NavigationButtons.tsx';
import { PageContainer } from '@/components/PageContainer';
import { SectionContainer } from '@/components/SectionContainer';

import { descriptionField, page2FormSchema, parcelFields, type Page2FormSchema } from '@/utils/parcelComposition';

const defaultValues = {
  name: '',
  line1: '',
  line2: '',
  apartment: '',
  city: '',
  postalCode: '',
  country: '',
  building: '',
  paymentType: '',
  deliveryType: 'Home',
};
export const Page2 = () => {
  const { isPending } = useCreateParcel();

  const { control, handleSubmit, watch, reset, getValues } = useForm<Page2FormSchema>({
    resolver: zodResolver(page2FormSchema),
    mode: 'onChange',
    defaultValues: { ...defaultValues },
  });
  const deliveryType = watch('deliveryType');

  const onSubmit = (/*data: Page2FormSchema */) => {
    // console.log('Form submitted with data:', data);
    // mutate(data);
  };

  // const handleFormSubmit = (event: FormEvent) => {
  //   event.preventDefault();
  //   void handleSubmit(onSubmit)(event);
  // };

  const handleReset = useCallback(() => {
    const currentDeliveryType = getValues('deliveryType');
    reset({
      ...defaultValues,
      deliveryType: currentDeliveryType,
    });
  }, [getValues, reset]);

  useEffect(() => {
    handleReset();
  }, [handleReset, deliveryType]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {isPending ? (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <PageContainer icon={<QuestionMark />} title="Parcel Data">
            <form>
              <SectionContainer title="Preferences">
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
            previousPath={`/${ROUTES.PAGE1}`}
            onNext={() => {
              void handleSubmit(onSubmit)();
            }}
          />
        </>
      )}
    </Box>
  );
};
