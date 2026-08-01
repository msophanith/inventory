import { createContext, useContext, useState, type ReactNode } from 'react';
import { DEFAULT_KHR_RATE } from '../../../utils/currency';

interface CurrencyContextValue {
  khrRate: number;
  setKhrRate: (rate: number) => void;
  formatKhr: (usdAmount: number) => string;
}

const STORAGE_KEY = 'pos_khr_exchange_rate';

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [khrRate, setKhrRateState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) || DEFAULT_KHR_RATE : DEFAULT_KHR_RATE;
  });

  const setKhrRate = (newRate: number) => {
    const validRate = Math.max(1000, Math.min(10000, newRate));
    setKhrRateState(validRate);
    localStorage.setItem(STORAGE_KEY, validRate.toString());
  };

  const formatKhr = (usdAmount: number) => {
    const khr = Math.round(usdAmount * khrRate);
    return `៛${new Intl.NumberFormat('en-US').format(khr)}`;
  };

  return (
    <CurrencyContext.Provider value={{ khrRate, setKhrRate, formatKhr }}>
      {children}
    </CurrencyContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    return {
      khrRate: DEFAULT_KHR_RATE,
      setKhrRate: () => {},
      formatKhr: (usdAmount: number) => `៛${new Intl.NumberFormat('en-US').format(Math.round(usdAmount * DEFAULT_KHR_RATE))}`,
    };
  }
  return context;
}
