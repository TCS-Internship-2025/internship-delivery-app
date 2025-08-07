import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { ADDRESS_CHANGE_DEFAULT_VALUES, DeliveryEnum } from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';

import { useFormContext } from '@/contexts/FormContext';

import { useGetParcelById } from '@/apis/parcelGet';
import type { PickupPoint } from '@/apis/pickupPoints';

import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import { SectionFields } from '@/components/FormSectionFields';
import { SectionContainer } from '@/components/SectionContainer';
import { BoxIcon } from './BoxIcon';
import { ParcelLocationMap } from './ParcelLocationMap';

import {
  addressChangeFields,
  addressChangeSchema,
  deliveryOnlyField,
  type AddressChangeSchema,
} from '@/utils/parcelComposition';
import { deliveryConverter } from '@/utils/parcelTypeConverter';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

//TODO: make timer for the modal
//TODO: add the confirm button and make the api call
//TODO: use the modal only when status lets you change
//TODO: try to make it reusable with the parcelForm
//TODO: clear context upon logout

interface AddressChangeModalProps {
  parcelId?: string;
}
export const AddressChangeModal = ({ parcelId }: AddressChangeModalProps) => {
  const [open, setOpen] = useState(false);

  const { updateFormData, resetForm } = useFormContext();

  const { data } = useGetParcelById(parcelId);

  const { control, handleSubmit, watch, reset, getValues } = useForm<AddressChangeSchema>({
    resolver: zodResolver(addressChangeSchema),
    mode: 'onChange',
    defaultValues: ADDRESS_CHANGE_DEFAULT_VALUES,
  });

  const deliveryType = watch('deliveryType');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset();
    resetForm();
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    void handleSubmit(onSubmit)(event);
  };

  const handleAddressSelect = useCallback(
    (point: PickupPoint | null) => {
      const currentDeliveryType = getValues('deliveryType');

      if (point)
        reset({
          ...point.address,
          deliveryType: currentDeliveryType,
        });
    },
    [reset, getValues]
  );

  const onSubmit = () => {
    console.log('form Submitted');
  };

  const handleCurrentAddressData = useCallback(
    (deliveryType?: DeliveryEnum) => {
      if (data) {
        reset({ ...data.recipient.address, deliveryType: deliveryType ?? deliveryConverter(data.deliveryType) });
        updateFormData({ longitude: data.recipient.address.longitude, latitude: data.recipient.address.latitude });
      }
    },
    [reset, data, updateFormData]
  );

  watch((_data, { name }) => {
    if (name === 'deliveryType') {
      if (_data.deliveryType === deliveryConverter(data?.deliveryType)) {
        handleCurrentAddressData(_data.deliveryType as DeliveryEnum);
      } else {
        reset({ ...ADDRESS_CHANGE_DEFAULT_VALUES, deliveryType: _data.deliveryType });
        resetForm();
      }
    }
  });

  useEffect(() => {
    console.log('useEffect triggering ');
    handleCurrentAddressData();
  }, [handleCurrentAddressData]);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 100,
          },
        }}
      >
        <Fade in={open}>
          <Box minWidth={900} sx={style}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <BoxIcon icon={<EditLocationAltIcon />} />
              <Typography variant="h6" fontWeight={600}>
                Address Change
              </Typography>
            </Box>
            <form onSubmit={handleFormSubmit}>
              <SectionContainer title="Preferences">
                <SectionFields fields={deliveryOnlyField} control={control} />
              </SectionContainer>
              {deliveryType === 'Home' && (
                <SectionContainer title="Recipient Address">
                  <SectionFields fields={addressChangeFields} control={control} />
                </SectionContainer>
              )}
              {deliveryType === 'Pickup Point' && (
                <Box display="flex" justifyContent="center">
                  <ParcelLocationMap setSelectedPoint={handleAddressSelect} deliveryType="PICKUP_POINT" />
                </Box>
              )}
              {deliveryType === 'Parcel Box' && (
                <Box display="flex" justifyContent="center">
                  <ParcelLocationMap setSelectedPoint={handleAddressSelect} deliveryType="PARCEL_BOX" />
                </Box>
              )}
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
