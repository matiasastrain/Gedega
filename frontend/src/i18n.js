// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importa los JSON
import esTranslation from './idioma/es/translation.json';
import enTranslation from './idioma/en/translation.json';

const resources = {
  es: { translation: esTranslation },
  en: { translation: enTranslation }
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
