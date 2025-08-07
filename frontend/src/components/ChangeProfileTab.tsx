import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

import { useEditProfile } from '@/apis/profileInfo';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import type { ChangeProfileSchema, EditProfileFormData } from '@/utils/changeDataComposition';
import { REGEX_PATTERNS } from '@/utils/parcelComposition';

interface ChangeProfileTabProps {
  formData?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    addressName?: string;
    building?: string;
    postalCode?: string;
    line1?: string;
    country?: string;
    apartment?: string;
    city?: string;
    line2?: string;
  };
}

export function ChangeProfileTab({ formData }: ChangeProfileTabProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormData>({
    defaultValues: {
      name: formData?.name,
      emailAddress: formData?.email,
      mobilePhone: formData?.phoneNumber,
    },
  });

  const { mutateAsync } = useEditProfile();
  const onSubmit: SubmitHandler<EditProfileFormData> = async (data: ChangeProfileSchema) => {
    await mutateAsync(data);
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Edit Profile
      </Typography>

      <Controller
        name="name"
        control={control}
        rules={{ required: 'Username is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Username"
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{ mb: 2 }}
          />
        )}
      />

      <Controller
        name="emailAddress"
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {
            value: REGEX_PATTERNS.EMAIL,
            message: 'Invalid email address',
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Email"
            error={!!errors.emailAddress}
            helperText={errors.emailAddress?.message}
            sx={{ mb: 2 }}
          />
        )}
      />

      <Controller
        name="mobilePhone"
        control={control}
        rules={{
          pattern: {
            value: REGEX_PATTERNS.HUNGARIAN_PHONE,
            message: 'Invalid phone number',
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Phone Number"
            error={!!errors.mobilePhone}
            helperText={errors.mobilePhone?.message}
            sx={{ mb: 2 }}
          />
        )}
      />

      <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{ mt: 2 }}>
        {isSubmitting ? 'Updating...' : 'Save Changes'}
      </Button>
    </Box>
  );
}
