import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

// Type pour les langues
interface LanguageOption {
    code: string;
    name: string;
    flag: string;
}

// Liste des langues supportées
const languages: LanguageOption[] = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
];

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const [selectedLang, setSelectedLang] = useState<LanguageOption | null>(null);

    useEffect(() => {
        const savedLang = localStorage.getItem('lang') || 'fr';
        const lang = languages.find((lng) => lng.code === savedLang) || languages[0];
        setSelectedLang(lang);
        i18n.changeLanguage(lang.code);
    }, [i18n]);

    const changeLanguage = (lng: LanguageOption) => {
        setSelectedLang(lng);
        i18n.changeLanguage(lng.code);
        localStorage.setItem('lang', lng.code);
    };

    return (
        <Dropdown
            value={selectedLang}
            options={languages}
            optionLabel="name"
            onChange={(e) => changeLanguage(e.value)}
            itemTemplate={(option) => (
                <div className="flex align-items-center gap-2">
                    <span>{option.flag}</span>
                    <span>{option.name}</span>
                </div>
            )}
            valueTemplate={() => selectedLang ? (
                <div className="flex align-items-center gap-2">
                    <span>{selectedLang.flag}</span>
                    <span>{selectedLang.name}</span>
                </div>
            ) : (
                <span>Sélectionner une langue</span>
            )}
            // @ts-ignore
            trigger={
                <Button
                    label={selectedLang?.name || "Langue"}
                    icon={<span className="pi pi-chevron-down" />}
                    iconPos="right"
                    text
                    rounded
                    severity="secondary"
                    aria-label="Sélectionner la langue"
                />
            }
        />
    );
};

export default LanguageSwitcher;