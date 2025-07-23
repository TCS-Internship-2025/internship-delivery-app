import type { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';

import QuestionMark from '@mui/icons-material/QuestionMark';
import Box from '@mui/material/Box';

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
} from '@/utils/page1Composition';

export const Page1 = () => {
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<Page1FormSchema>({
    resolver: zodResolver(page1FormSchema),
    mode: 'onChange',
    defaultValues: {},
  });

  const onSubmit = (data: Page1FormSchema) => {
    console.log('Form submitted with data:', data);
    void navigate(`/${ROUTES.PAGE2}`);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    void handleSubmit(onSubmit)(event);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageContainer icon={<QuestionMark />} title="Page1">
        <form onSubmit={handleFormSubmit}>
          <SectionContainer title="Recipient Details">
            <SectionFields fields={beneficiaryFields} control={control} />
          </SectionContainer>
          <SectionContainer title="Recipient Address">
            <SectionFields fields={parcelFields} control={control} />
          </SectionContainer>
          <SectionContainer title="Shipping Options">
            <SectionFields fields={descriptionField} control={control} />
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
