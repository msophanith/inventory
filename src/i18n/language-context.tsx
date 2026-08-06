import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import type { Language, LanguageContextType } from './types';
import { en } from './locales/en';
import { km } from './locales/km';

const translations = { en, km };

const STORAGE_KEY = 'app_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { readonly children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved === 'km' || saved === 'en') ? saved : 'km';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useMemo(() => {
    return (keyPath: string, params?: Record<string, string | number>): string => {
      const keys = keyPath.split('.');
      let current: unknown = translations[language];

      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = (current as Record<string, unknown>)[k];
        } else {
          current = undefined;
          break;
        }
      }

      if (typeof current !== 'string') {
        let fallback: unknown = translations.en;
        for (const k of keys) {
          if (fallback && typeof fallback === 'object' && k in fallback) {
            fallback = (fallback as Record<string, unknown>)[k];
          } else {
            fallback = undefined;
            break;
          }
        }
        current = typeof fallback === 'string' ? fallback : keyPath;
      }

      let result = current as string;
      if (params) {
        Object.entries(params).forEach(([pKey, pValue]) => {
          result = result.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pValue));
        });
      }

      return result;
    };
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
