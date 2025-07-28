import { type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';

import QuestionMark from '@mui/icons-material/QuestionMark';
import Box from '@mui/material/Box';

import { SectionFields } from '@/components/FormSectionFields.tsx';
import { NavigationButtons } from '@/components/NavigationButtons.tsx';
import { PageContainer } from '@/components/PageContainer';
import { SectionContainer } from '@/components/SectionContainer';

import { beneficiaryFields, page1FormSchema, type Page1FormSchema } from '@/utils/parcelComposition';

const defaultValues = {
  title: '',
  name: '',
  mobilePhone: '',
  emailAddress: '',
};
export const Page1 = () => {
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<Page1FormSchema>({
    resolver: zodResolver(page1FormSchema),
    mode: 'onChange',
    defaultValues: { ...defaultValues },
  });

  const onSubmit = (/*data: Page1FormSchema*/) => {
    // console.log('Form submitted with data:', data);
    void navigate(`/${ROUTES.PAGE2}`);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    void handleSubmit(onSubmit)(event);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageContainer icon={<QuestionMark />} title="Recipient Details">
        <form onSubmit={handleFormSubmit}>
          <SectionContainer title="Information">
            <SectionFields fields={beneficiaryFields} control={control} />
          </SectionContainer>
        </form>
      </PageContainer>
      <NavigationButtons
        previousPath="/"
        onNext={() => {
          void handleSubmit(onSubmit)();
        }}
      />
    </Box>
  );
};
