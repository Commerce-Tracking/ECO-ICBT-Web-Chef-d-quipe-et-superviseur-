import { useState } from 'react';
import fr from '../i18n/prime-react-fr';
import en from '../i18n/prime-react-en';
import { locale as setLocale } from 'primereact/api';

export const useLanguage = () => {
    const [language, setLanguage] = useState<'fr' | 'en'>('en');

    const changeLanguage = (lang: 'fr' | 'en') => {
        setLanguage(lang);
        // @ts-ignore
        setLocale(lang === 'fr' ? fr : en);
    };

    return { language, changeLanguage };
};