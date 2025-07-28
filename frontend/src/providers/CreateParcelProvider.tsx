import React, { useCallback, useMemo, useState, type ReactNode } from 'react';
import { parcelFormDefaultValues, recipientFormDefaultValues } from '@/constants';

import { FormContext, type FormContextValue, type FormData } from '@/contexts/createParcelContext';

import type { Page1FormSchema, Page2FormSchema } from '@/utils/parcelComposition';

const defaultFormData: FormData = {
  ...recipientFormDefaultValues,

  ...parcelFormDefaultValues,
};

interface FormProviderProps {
  children: ReactNode;
  initialData?: Partial<FormData>;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children, initialData }) => {
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

  const getPage1Data = useCallback((): Page1FormSchema => {
    return {
      title: formData.title,
      name: formData.name,
      dateOfBirth: formData.dateOfBirth,
      mobilePhone: formData.mobilePhone,
      emailAddress: formData.emailAddress,
    };
  }, [formData]);

  const getPage2Data = useCallback((): Page2FormSchema => {
    return {
      addressName: formData.addressName,
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
      getPage1Data,
      getPage2Data,
    }),
    [formData, updateFormData, resetForm, getPage1Data, getPage2Data]
  );

  return <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>;
};
