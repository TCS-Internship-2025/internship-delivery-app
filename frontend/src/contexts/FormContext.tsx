import { createContext, useContext } from 'react';

import type { ParcelFormSchema } from '@/apis/parcel';

import type { Page1FormSchema, Page2FormSchema } from '@/utils/parcelComposition';

export type FormData = ParcelFormSchema;

export interface FormContextValue {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
  getPage1Data: () => Page1FormSchema;
  getPage2Data: () => Page2FormSchema;
}

export const FormContext = createContext<FormContextValue | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
