import React from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider as MuiDateLocalization } from '@mui/x-date-pickers/LocalizationProvider';

export const DATE_FORMAT = 'dd-MMM-yyyy';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm';

void (async () => {
  await i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      backend: {
        loadPath: `${import.meta.env.VITE_BACKEND_BASE_URL}/locales/{{lng}}`,
      },
      interpolation: {
        escapeValue: false,
      },
    });
})();

export const LocalizationProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <MuiDateLocalization dateAdapter={AdapterDateFns}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </MuiDateLocalization>
  );
};
