import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { PARCEL_FORM_DEFAULT_VALUES, RECIPIENT_FORM_DEFAULT_VALUES } from '@/constants';

import { FormContext, type FormContextValue, type FormData } from '@/contexts/FormContext';

import type { ParcelFormSchema, RecipientFormSchema } from '@/utils/parcelComposition';

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
    };
  }, [formData]);

  const contextValue: FormContextValue = useMemo(
    () => ({
      formData,
      updateFormData,
      resetForm,
      getRecipientFormData,
      getParcelFormData,
    }),
    [formData, updateFormData, resetForm, getRecipientFormData, getParcelFormData]
  );

  return <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>;
};
