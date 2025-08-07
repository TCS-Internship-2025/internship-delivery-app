import type { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useEditAddress } from '@/apis/profileInfo';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { SectionFields } from './FormSectionFields';

import {
  changeAddressFields,
  changeAddressFormSchema,
  type ChangeAddressFormSchema,
} from '@/utils/changeDataComposition';

export function ChangeAddressTab() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ChangeAddressFormSchema>({
    resolver: zodResolver(changeAddressFormSchema),
    mode: 'onChange',
    defaultValues: {},
  });
  const { mutateAsync } = useEditAddress();

  const onSubmit = async (data: ChangeAddressFormSchema) => {
    await mutateAsync(data);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    void handleSubmit(onSubmit)(event);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Edit Address
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <SectionFields fields={changeAddressFields} control={control} />

        <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{ mt: 2, width: '20%' }}>
          {isSubmitting ? 'Updating...' : 'Change Address'}
        </Button>
      </form>
    </Box>
  );
}
