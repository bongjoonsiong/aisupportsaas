import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  SupportedLanguage, 
  SUPPORTED_LANGUAGES, 
  LanguageOption, 
  locales, 
  LocaleSchema 
} from '../locales';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currentLanguageOption: LanguageOption;
  languages: LanguageOption[];
  t: (path: string, fallback?: string) => string;
  strings: LocaleSchema;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'omnidesk_lang';

function getInitialLanguage(): SupportedLanguage {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (saved === 'en' || saved === 'zh-CN' || saved === 'zh-TW' || saved === 'es' || saved === 'ja')) {
      return saved;
    }

    // Auto-detect from browser
    const browserLang = (navigator.language || '').toLowerCase();
    if (browserLang.startsWith('zh-tw') || browserLang.startsWith('zh-hk')) {
      return 'zh-TW';
    }
    if (browserLang.startsWith('zh')) {
      return 'zh-CN';
    }
    if (browserLang.startsWith('es')) {
      return 'es';
    }
    if (browserLang.startsWith('ja')) {
      return 'ja';
    }
  } catch {
    // Fallback for SSR or storage disabled
  }
  return 'en';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(getInitialLanguage);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore storage error
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // ignore
    }
  }, [language]);

  const currentLanguageOption = useMemo(() => {
    return SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  }, [language]);

  const strings = useMemo(() => {
    return locales[language] || locales.en;
  }, [language]);

  // Deep key resolver for t('section.key')
  const t = useMemo(() => {
    return (path: string, fallback?: string): string => {
      const parts = path.split('.');
      
      // Try current language
      let currVal: any = strings;
      for (const part of parts) {
        if (currVal && typeof currVal === 'object' && part in currVal) {
          currVal = currVal[part];
        } else {
          currVal = undefined;
          break;
        }
      }
      if (typeof currVal === 'string' && currVal.trim()) {
        return currVal;
      }

      // Fallback to English
      let fallbackVal: any = locales.en;
      for (const part of parts) {
        if (fallbackVal && typeof fallbackVal === 'object' && part in fallbackVal) {
          fallbackVal = fallbackVal[part];
        } else {
          fallbackVal = undefined;
          break;
        }
      }
      if (typeof fallbackVal === 'string' && fallbackVal.trim()) {
        return fallbackVal;
      }

      return fallback ?? path;
    };
  }, [strings]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    currentLanguageOption,
    languages: SUPPORTED_LANGUAGES,
    t,
    strings,
  }), [language, currentLanguageOption, t, strings]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
