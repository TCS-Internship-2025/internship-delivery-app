import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

import { useEditPassword } from '@/apis/profileInfo';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import { PasswordField } from './PasswordField';

import type { ChangePasswordFormData, ModalProps } from '@/utils/changeDataComposition';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function ChangePasswordModal({ open, handleClose }: ModalProps) {
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

    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        component="form"
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
        sx={style}
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

        <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{ mt: 2 }}>
          {isSubmitting ? 'Updating...' : 'Change Password'}
        </Button>
        <Button variant="outlined" fullWidth onClick={handleClose} sx={{ mt: 1 }}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
}
