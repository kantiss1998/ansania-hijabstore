'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionary } from '../locales/dictionary';

type Locale = 'id' | 'en';

interface LanguageContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof typeof dictionary.id) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('id');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;
    if (saved === 'id' || saved === 'en') {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: keyof typeof dictionary.id): string => {
    return dictionary[locale][key] || dictionary['id'][key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {mounted ? children : <>{children}</>}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      locale: 'id' as Locale,
      setLocale: () => {},
      t: (key: keyof typeof dictionary.id) => dictionary['id'][key] || String(key)
    };
  }
  return context;
}
