import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import { PasswordField } from './PasswordField';

interface ChangePasswordFormData {
  password: string;
  confirmPassword: string;
}

interface ChangePasswordModalProps {
  open: boolean;
  handleClose: () => void;
}

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

export default function ChangeAddressModal({ open, handleClose }: ChangePasswordModalProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password');

  const onSubmit: SubmitHandler<ChangePasswordFormData> = async (data) => {
    try {
      console.log('Password change submitted:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      handleClose();
    } catch (err) {
      console.error('Failed to change password:', err);
    }
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

        <PasswordField
          name="password"
          label="New Password"
          control={control}
          error={errors.password}
          value={passwordValue}
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
              value={field.value}
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
