import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import des JSONs
import frTranslation from './locales/fr/translation.json';
import enTranslation from './locales/en/translation.json';

i18next.use(initReactI18next).init({
    resources: {
        fr: {
            translation: frTranslation,
        },
        en: {
            translation: enTranslation,
        },
    },
    lng: 'fr', // Langue par défaut
    fallbackLng: 'fr',
    interpolation: {
        escapeValue: false, // React gère déjà l'échappement
    },
});

export default i18next;