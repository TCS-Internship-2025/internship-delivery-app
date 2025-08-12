import type { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useEditAddress, type Profile } from '@/apis/profileInfo';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { SectionFields } from './FormSectionFields';

import {
  changeAddressFields,
  changeAddressFormSchema,
  type ChangeAddressFormSchema,
} from '@/utils/changeDataComposition';

interface ChangeProfileTabProps {
  profile?: Profile;
}
export function ChangeAddressTab({ profile }: ChangeProfileTabProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ChangeAddressFormSchema>({
    resolver: zodResolver(changeAddressFormSchema),
    mode: 'onChange',
    defaultValues: {
      address: {
        building: profile?.address?.building ?? '',
        postalCode: profile?.address?.postalCode ?? '',
        line1: profile?.address?.line1 ?? '',
        line2: profile?.address?.line2 ?? '',
        apartment: profile?.address?.apartment ?? '',
        city: profile?.address?.city ?? '',
        country: profile?.address?.country ?? '',
      },
    },
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

        <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{ mt: 2, width: 'auto' }}>
          {isSubmitting ? 'Updating...' : 'Change Address'}
        </Button>
      </form>
    </Box>
  );
}
