import { useForm, type SubmitHandler } from 'react-hook-form';

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
    reset,
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const { mutateAsync } = useEditPassword(reset);

  const onSubmit: SubmitHandler<ChangePasswordFormData> = async (data) => {
    const { currentPassword, newPassword } = data;
    await mutateAsync({ currentPassword, newPassword });
  };

  const newPasswordValue = watch('newPassword');
  const confirmPasswordValue = watch('confirmPassword');

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)(e);
      }}
      noValidate
      sx={{ mt: 2 }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Change Password
      </Typography>

      <PasswordField<ChangePasswordFormData>
        name="currentPassword"
        label="Old Password"
        control={control}
        error={errors.currentPassword}
        disabled={isSubmitting}
        value={watch('currentPassword')}
      />

      <PasswordField<ChangePasswordFormData>
        name="newPassword"
        label="New Password"
        control={control}
        error={errors.newPassword}
        disabled={isSubmitting}
        showStrengthIndicator
        value={newPasswordValue}
      />

      <PasswordField<ChangePasswordFormData>
        name="confirmPassword"
        label="Confirm Password"
        control={control}
        error={errors.confirmPassword}
        disabled={isSubmitting}
        value={confirmPasswordValue}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isSubmitting}
        sx={{ width: 'auto', alignSelf: 'left' }}
      >
        {' '}
        {isSubmitting ? 'Updating...' : 'Change Password'}{' '}
      </Button>
    </Box>
  );
}
