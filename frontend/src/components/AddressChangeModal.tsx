import { useState, type FormEvent } from 'react';
import { ADDRESS_CHANGE_DEFAULT_VALUES, DELIVERY_TYPE_NAME_CONVERTER, DeliveryEnum, PARCEL_STATUS } from '@/constants';
import { enqueueSnackbar } from 'notistack';

import { useAddressChangeForm } from '@/hooks/useAddressChangeForm';
import { useFormContext } from '@/contexts/FormContext';

import { useUpdateParcelAddress, type ParcelData } from '@/apis/parcel';

import CloseIcon from '@mui/icons-material/Close';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { SectionFields } from '@/components/FormSectionFields';
import { QueryStates } from '@/components/QueryStates';
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

  const { mutate, status: addressStatus } = useUpdateParcelAddress();

  const addressChangeCondition =
    parcelData?.currentStatus !== PARCEL_STATUS.CREATED &&
    parcelData?.currentStatus !== PARCEL_STATUS.PICKED_UP &&
    parcelData?.currentStatus !== PARCEL_STATUS.IN_TRANSIT;

  const parcelId = parcelData?.id;

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
    <Box mr={{ xs: 1.5, md: 3 }} mt={{ xs: 1.5, md: 3 }} sx={{ float: 'right' }}>
      <Tooltip title={addressChangeCondition ? 'You cannot change address at this status' : undefined} arrow>
        <span style={{ display: 'inline-flex' }}>
          <Button
            sx={{ fontSize: 20, borderRadius: 4 }}
            variant="contained"
            disabled={addressChangeCondition}
            onClick={handleOpen}
          >
            Change address
          </Button>
        </span>
      </Tooltip>
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
        <QueryStates state={addressStatus}>
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
          </Box>
        </QueryStates>
      </Modal>
    </Box>
  );
};
