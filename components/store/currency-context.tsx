"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CURRENCIES, DEFAULT_CURRENCY, CurrencyConfig } from "@/lib/currency";

interface CurrencyContextType {
  currencyCode: string;
  currencySymbol: string;
  currencyConfig: CurrencyConfig;
  formatPrice: (amount: number) => string;
  refreshCurrency: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({
  children,
  initialCurrency = DEFAULT_CURRENCY,
}: {
  children: React.ReactNode;
  initialCurrency?: string;
}) {
  const [currencyCode, setCurrencyCode] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const match = document.cookie.match(/(^| )store_currency=([^;]+)/);
      if (match && match[2] && CURRENCIES[match[2]]) {
        return match[2];
      }
    }
    return initialCurrency;
  });

  const fetchCurrency = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        if (data.currency && CURRENCIES[data.currency]) {
          setCurrencyCode(data.currency);
        }
      }
    } catch (error) {
      console.error("Failed to fetch store settings:", error);
    }
  };

  useEffect(() => {
    // Attempt to read from cookie first for fast rendering
    const match = document.cookie.match(/(^| )store_currency=([^;]+)/);
    if (!match || !match[2] || !CURRENCIES[match[2]]) {
      const timer = setTimeout(() => {
        fetchCurrency();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const config = CURRENCIES[currencyCode] || CURRENCIES[DEFAULT_CURRENCY];

  const formatPrice = (amount: number): string => {
    const formatted = amount.toLocaleString(config.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${config.symbol}${config.spacing}${formatted}`;
  };

  const refreshCurrency = async () => {
    await fetchCurrency();
  };

  return (
    <CurrencyContext.Provider
      value={{
        currencyCode,
        currencySymbol: config.symbol,
        currencyConfig: config,
        formatPrice,
        refreshCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
