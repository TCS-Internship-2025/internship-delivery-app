import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { PARCEL_FORM_DEFAULT_VALUES, RECIPIENT_FORM_DEFAULT_VALUES } from '@/constants';

import { FormContext, type FormContextValue, type FormData } from '@/contexts/FormContext';

import type { ParcelFormSchema, PointSchema, RecipientFormSchema } from '@/utils/parcelComposition';

const defaultFormData: FormData = {
  ...RECIPIENT_FORM_DEFAULT_VALUES,

  ...PARCEL_FORM_DEFAULT_VALUES,
};

interface FormProviderProps {
  children: ReactNode;
  initialData?: Partial<FormData>;
}

export const FormProvider = ({ children, initialData }: FormProviderProps) => {
  const [formData, setFormData] = useState<FormData>({
    ...defaultFormData,
    ...initialData,
  });

  const updateFormData = useCallback((data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
  }, []);

  const resetParcelForm = useCallback(
    (persistedData: Partial<ParcelFormSchema>) => {
      const updatedParcelForm: ParcelFormSchema = {
        ...PARCEL_FORM_DEFAULT_VALUES,
        ...persistedData,
      };

      updateFormData(updatedParcelForm);
    },
    [updateFormData]
  );

  const getRecipientFormData = useCallback((): RecipientFormSchema => {
    return {
      title: formData.title,
      name: formData.name,
      birthDate: formData.birthDate,
      phone: formData.phone,
      email: formData.email,
    };
  }, [formData]);

  const getParcelFormData = useCallback((): ParcelFormSchema => {
    return {
      line1: formData.line1,
      line2: formData.line2,
      building: formData.building,
      apartment: formData.apartment,
      city: formData.city,
      postalCode: formData.postalCode,
      country: formData.country,
      paymentType: formData.paymentType,
      deliveryType: formData.deliveryType,
      longitude: formData.longitude,
      latitude: formData.latitude,
    };
  }, [formData]);

  const getPointId = useCallback((): PointSchema => {
    return {
      pointId: formData.pointId,
      longitude: formData.longitude,
      latitude: formData.latitude,
    };
  }, [formData]);

  const contextValue: FormContextValue = useMemo(
    () => ({
      formData,
      updateFormData,
      resetForm,
      resetParcelForm,
      getRecipientFormData,
      getParcelFormData,
      getPointId,
    }),
    [formData, updateFormData, resetForm, getRecipientFormData, getParcelFormData, resetParcelForm, getPointId]
  );

  return <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>;
};
