import { useState, type FormEvent } from 'react';
import { ADDRESS_CHANGE_DEFAULT_VALUES, DELIVERY_TYPE_NAME_CONVERTER, DeliveryEnum } from '@/constants';
import { enqueueSnackbar } from 'notistack';

import { useAddressChangeForm } from '@/hooks/useAddressChangeForm';
import { useFormContext } from '@/contexts/FormContext';

import { useUpdateParcelAddress } from '@/apis/parcel';
import { type ParcelData } from '@/apis/parcelGet';

import CloseIcon from '@mui/icons-material/Close';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import { SectionFields } from '@/components/FormSectionFields';
import { SectionContainer } from '@/components/SectionContainer';
import { BoxIcon } from './BoxIcon';
import { SharedForm } from './SharedForm';

import {
  addressChangeFields,
  deliveryOnlyField,
  requestReasonField,
  type AddressChangeSchema,
} from '@/utils/parcelComposition';

interface AddressChangeModalProps {
  parcelData?: ParcelData;
}
export const AddressChangeModal = ({ parcelData }: AddressChangeModalProps) => {
  const [open, setOpen] = useState(false);

  const { resetForm } = useFormContext();

  const { mutate, isPending } = useUpdateParcelAddress();

  const parcelId = parcelData?.id;

  console.log('data:', parcelData);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    deliveryType,
    hasFormChanged,
    handleCurrentAddressData,
    handleAddressSelect,
    initialDeliveryType,
  } = useAddressChangeForm({ parcelData });

  const handleOpen = () => {
    handleCurrentAddressData();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    void handleSubmit(onSubmit)(event);
  };

  const onSubmit = (data: AddressChangeSchema) => {
    const {
      country,
      postalCode,
      apartment,
      line1,
      city,
      building,
      line2,
      latitude,
      longitude,
      deliveryType: dT,
      requestReason,
    } = data;

    const requestData = {
      newAddress: { country, postalCode, apartment, line1, city, building, line2, latitude, longitude },
      deliveryType: DELIVERY_TYPE_NAME_CONVERTER[dT],
      requestReason,
    };
    console.log('form Submitted with this data: ', requestData);

    mutate(
      { data: requestData, id: parcelId },
      {
        onSuccess: () => {
          setOpen(false);
          enqueueSnackbar('Address updated successfully!', { variant: 'success' });
        },
      }
    );
  };

  watch((_data, { name }) => {
    if (name === 'deliveryType') {
      if (_data.deliveryType === initialDeliveryType) {
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

  return (
    <Box>
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
        <Box
          sx={{
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
          }}
        >
          {isPending ? (
            <Box
              display={'flex'}
              sx={{
                borderEndEndRadius: 6,
                borderEndStartRadius: 6,
                width: {
                  xs: 340,
                  sm: 500,
                  lg: 900,
                },
                height: {
                  xs: 600,
                  sm: 500,
                  lg: 'none',
                },
              }}
              justifyContent={'center'}
              alignItems={'center'}
              height={'100%'}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
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
              <SharedForm
                handleFormSubmit={handleFormSubmit}
                deliveryType={deliveryType}
                control={control}
                handleAddressSelect={handleAddressSelect}
                height="50vh"
                preferenceFields={deliveryOnlyField}
                recipientAddressFields={addressChangeFields}
              >
                <SectionContainer title="Update Reason">
                  <SectionFields fields={requestReasonField} control={control}></SectionFields>
                </SectionContainer>
              </SharedForm>
              <Button
                variant="contained"
                onClick={() => {
                  void handleSubmit(onSubmit)();
                }}
                fullWidth
                disabled={!hasFormChanged}
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
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};
