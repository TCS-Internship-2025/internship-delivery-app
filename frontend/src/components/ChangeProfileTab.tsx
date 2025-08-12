import type { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useEditProfile, type Profile } from '@/apis/profileInfo';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { SectionFields } from './FormSectionFields';

import { changeProfileFields, changeProfileSchema, type ChangeProfileSchema } from '@/utils/changeDataComposition';

interface ChangeProfileTabProps {
  formData?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  };

  profile?: Profile;
}

export function ChangeProfileTab({ formData, profile }: ChangeProfileTabProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ChangeProfileSchema>({
    resolver: zodResolver(changeProfileSchema),
    mode: 'onChange',
    defaultValues: {
      name: formData?.name ?? profile?.name ?? '',
      email: formData?.email ?? profile?.email ?? '',
      phone: formData?.phoneNumber ?? profile?.phone ?? '',
    },
  });

  const { mutateAsync } = useEditProfile();

  const onSubmit = async (data: ChangeProfileSchema) => {
    await mutateAsync(data);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    void handleSubmit(onSubmit)(event);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Edit Profile
      </Typography>

      <form onSubmit={handleFormSubmit}>
        <SectionFields fields={changeProfileFields} control={control} />

        <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{ mt: 2, width: 'auto' }}>
          {isSubmitting ? 'Updating...' : 'Change Profile'}
        </Button>
      </form>
    </Box>
  );
}
