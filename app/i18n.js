import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend) // Load translations using HTTP (e.g., fetch from /locales)
  .use(LanguageDetector) // Detect user language (browser)
  .use(initReactI18next) // Bind react-i18next to React
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // React already escapes
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Translation path
    },
  });

export default i18n;
