import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, ru } from './locales/index.js';

export default async () => {
  const i18n = i18next.createInstance();

  await i18n.use(initReactI18next).init({
    fallbackLng: 'ru',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: { en, ru },
  });

  return i18n;
};
