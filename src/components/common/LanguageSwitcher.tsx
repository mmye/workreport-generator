import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language.startsWith('ja') ? 'en' : 'ja';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded-md border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center space-x-1"
        >
            <span>{i18n.language.startsWith('ja') ? '🇯🇵 JP' : '🇺🇸 EN'}</span>
            <svg className="w-4 h-4 ml-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
    );
};

export default LanguageSwitcher;
