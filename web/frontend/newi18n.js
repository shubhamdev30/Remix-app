import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json'
import fr from './locales/fr.json'
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: en
      }
    }
  });

export default i18n;