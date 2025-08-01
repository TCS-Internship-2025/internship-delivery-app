import { type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';

import { useSmallScreen } from '@/hooks/useSmallScreen';
import { useFormContext } from '@/contexts/FormContext';

import BadgeIcon from '@mui/icons-material/Badge';
import Box from '@mui/material/Box';

import { SectionFields } from '@/components/FormSectionFields.tsx';
import { NavigationButtons } from '@/components/NavigationButtons.tsx';
import { PageContainer } from '@/components/PageContainer';
import { SectionContainer } from '@/components/SectionContainer';

import { recipientFields, recipientFormSchema, type RecipientFormSchema } from '@/utils/parcelComposition';

export const RecipientForm = () => {
  const navigate = useNavigate();
  const formContext = useFormContext();
  const isSmallScreen = useSmallScreen();

  const { control, handleSubmit } = useForm<RecipientFormSchema>({
    resolver: zodResolver(recipientFormSchema),
    mode: 'onChange',
    defaultValues: formContext.getRecipientFormData(),
  });

  const onSubmit = (data: RecipientFormSchema) => {
    formContext.updateFormData({ ...data });

    void navigate(`/${ROUTES.PARCEL_FORM}`);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    void handleSubmit(onSubmit)(event);
  };

  return (
    <Box px={isSmallScreen ? 0 : 20} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageContainer icon={<BadgeIcon />} title="Recipient Details">
        <form onSubmit={handleFormSubmit}>
          <SectionContainer title="Information">
            <SectionFields fields={recipientFields} control={control} />
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
