import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { ADDRESS_CHANGE_DEFAULT_VALUES, DeliveryEnum } from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { enqueueSnackbar } from 'notistack';

import { useFormContext } from '@/contexts/FormContext';
import type { CustomSnackbarOptions } from '@/providers/ToastProvider';

import { useGetParcelById } from '@/apis/parcelGet';
import type { PickupPoint } from '@/apis/pickupPoints';

import CloseIcon from '@mui/icons-material/Close';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
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
  requestReasonField,
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
  minWidth: {
    xs: 340,
    sm: 500,
    lg: 900,
  },
  maxHeight: {
    xs: 600,
    sm: 800,
    lg: 'none',
  },
  overflowY: {
    xs: 'scroll',
    lg: 'hidden',
  },
};

//TODO: use the modal only when status lets you change
//TODO: change the address change response schema in the parcel file

interface AddressChangeModalProps {
  parcelId?: string;
}
export const AddressChangeModal = ({ parcelId }: AddressChangeModalProps) => {
  const [open, setOpen] = useState(false);

  const { updateFormData, resetForm, getPointId } = useFormContext();

  const { data } = useGetParcelById(parcelId);

  const { control, handleSubmit, watch, reset, getValues } = useForm<AddressChangeSchema>({
    resolver: zodResolver(addressChangeSchema),
    mode: 'onChange',
    defaultValues: ADDRESS_CHANGE_DEFAULT_VALUES,
  });

  const deliveryType = watch('deliveryType');

  const address = data ? data.recipient.address : ADDRESS_CHANGE_DEFAULT_VALUES;

  const handleCurrentAddressData = useCallback(
    (deliveryType?: DeliveryEnum, requestReason?: string | null) => {
      if (data) {
        reset({
          ...address,
          deliveryType: deliveryType ?? deliveryConverter(data.deliveryType),
          requestReason: requestReason,
        });
        updateFormData({
          longitude: address.longitude,
          latitude: address.latitude,
          pointId: null,
        });
      }
    },
    [reset, data, updateFormData, address]
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    console.log('closing  ');
    handleCurrentAddressData();
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

  const onSubmit = (data: AddressChangeSchema) => {
    console.log('form Submitted with this data: ', data);
  };

  const normalize = (obj: AddressChangeSchema) => JSON.stringify(obj, Object.keys(obj).sort());

  watch((_data, { name }) => {
    if (name === 'deliveryType') {
      if (_data.deliveryType === deliveryConverter(data?.deliveryType)) {
        handleCurrentAddressData(_data.deliveryType as DeliveryEnum, _data.requestReason);
      } else {
        reset({
          ...ADDRESS_CHANGE_DEFAULT_VALUES,
          deliveryType: _data.deliveryType,
          requestReason: _data.requestReason,
        });
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
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 100,
          },
        }}
      >
        <Box sx={style}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: {
                md: 2,
              },
            }}
          >
            <BoxIcon icon={<EditLocationAltIcon />} />
            <Typography variant="h6" fontWeight={600}>
              Address Change
            </Typography>
            <IconButton onClick={handleClose} sx={{ ml: 'auto' }}>
              <CloseIcon />
            </IconButton>
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
                <ParcelLocationMap setSelectedPoint={handleAddressSelect} deliveryType="PICKUP_POINT" height="50vh" />
              </Box>
            )}
            {deliveryType === 'Parcel Box' && (
              <Box display="flex" justifyContent="center">
                <ParcelLocationMap setSelectedPoint={handleAddressSelect} deliveryType="PARCEL_BOX" height="50vh" />
              </Box>
            )}
            <SectionContainer title="Update Reason">
              <SectionFields fields={requestReasonField} control={control}></SectionFields>
            </SectionContainer>
          </form>
          <Button
            variant="contained"
            onClick={() => {
              if (getValues('deliveryType') !== 'Home' && !getPointId().pointId)
                enqueueSnackbar('Please choose an address from the map', {
                  variant: 'error',
                  headerMessage: 'No address was provided',
                } as CustomSnackbarOptions);
              void handleSubmit(onSubmit)();
            }}
            fullWidth
            disabled={
              normalize({ ...address, deliveryType: deliveryConverter(data?.deliveryType) }) === normalize(getValues())
            }
            color="primary"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              borderColor: 'action.disabled',
            }}
          >
            Update
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
