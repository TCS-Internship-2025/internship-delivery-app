import type { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useEditAddress } from '@/apis/editProfile';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { SectionFields } from './FormSectionFields';

import {
  changeAddressFields,
  changeAddressFormSchema,
  type ChangeAddressFormSchema,
} from '@/utils/changeDataComposition';

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

interface ChangePasswordModalProps {
  open: boolean;
  handleClose: () => void;
}
export default function ChangeAddressModal({ open, handleClose }: ChangePasswordModalProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ChangeAddressFormSchema>({
    resolver: zodResolver(changeAddressFormSchema),
    mode: 'onChange',
  });
  const { mutate } = useEditAddress();

  const onSubmit = (data: ChangeAddressFormSchema) => {
    mutate(data);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    void handleSubmit(onSubmit)(event);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <form onSubmit={handleFormSubmit}>
          <SectionFields fields={changeAddressFields} control={control} />

          <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{ mt: 2 }}>
            {isSubmitting ? 'Updating...' : 'Change Password'}
          </Button>
          <Button variant="outlined" fullWidth onClick={handleClose} sx={{ mt: 1 }}>
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
