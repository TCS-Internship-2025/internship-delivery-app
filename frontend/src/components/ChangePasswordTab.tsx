import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

import { useEditPassword } from '@/apis/profileInfo';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { PasswordField } from './PasswordField';

import type { ChangePasswordFormData } from '@/utils/changeDataComposition';

export function ChangePasswordTab() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>();

  const passwordValue = watch('newPassword');
  const { mutateAsync } = useEditPassword();
  const onSubmit: SubmitHandler<ChangePasswordFormData> = async (data) => {
    const { currentPassword, newPassword } = data;
    console.log(currentPassword, newPassword);
    await mutateAsync({ currentPassword, newPassword });
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Change Password
      </Typography>
      <PasswordField name="currentPassword" label="Old Password" control={control} error={errors.currentPassword} />
      <PasswordField
        name="newPassword"
        label="New Password"
        control={control}
        error={errors.newPassword}
        showStrengthIndicator
      />

      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: 'Confirm password is required',
          validate: (value) => value === passwordValue || 'Passwords do not match',
        }}
        render={({ field }) => (
          <PasswordField
            {...field}
            name="confirmPassword"
            label="Confirm Password"
            control={control}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isSubmitting}
        sx={{ width: '20%', alignSelf: 'left' }}
      >
        {isSubmitting ? 'Updating...' : 'Change Password'}
      </Button>
    </Box>
  );
}
