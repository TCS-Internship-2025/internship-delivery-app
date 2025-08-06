import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

import { useEditProfile } from '@/apis/profile';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import type { ChangeProfileSchema } from '@/utils/changeDataComposition';

interface EditProfileFormData {
  name: string;
  emailAddress: string;
  mobilePhone: string;
  title: string;
}
interface EditProfileModalProps {
  open: boolean;
  handleClose: () => void;
  formData: { name?: string; email?: string; phoneNumber?: string };
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

export default function ChangeProfileModal({ open, handleClose, formData }: EditProfileModalProps) {
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
    <Modal open={open} onClose={() => handleClose()}>
      <Box
        component="form"
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
        sx={style}
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
              value: /^\S+@\S+\.\S+$/,
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
              value: /^[0-9]{10,}$/,
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
        <Button variant="outlined" fullWidth onClick={handleClose} sx={{ mt: 1 }}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
}
