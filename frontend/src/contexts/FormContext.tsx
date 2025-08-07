import { createContext, useContext } from 'react';

import type { FullFormSchema } from '@/apis/parcel';

import type { ParcelFormSchema, PointSchema, RecipientFormSchema } from '@/utils/parcelComposition';

export type FormData = FullFormSchema;

export interface FormContextValue {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
  resetParcelForm: (persistedData: Partial<ParcelFormSchema>) => void;
  getRecipientFormData: () => RecipientFormSchema;
  getParcelFormData: () => ParcelFormSchema;
  getPointId: () => PointSchema;
}

export const FormContext = createContext<FormContextValue | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
