import { prisma } from "./prisma";

export interface CurrencyConfig {
  code: string;
  symbol: string;
  locale: string;
  name: string;
  spacing: string;
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  USD: {
    code: "USD",
    symbol: "$",
    locale: "en-US",
    name: "US Dollar (USD)",
    spacing: "",
  },
  LKR: {
    code: "LKR",
    symbol: "Rs.",
    locale: "en-LK",
    name: "Sri Lankan Rupee (LKR)",
    spacing: " ",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    locale: "de-DE",
    name: "Euro (EUR)",
    spacing: "",
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    locale: "en-GB",
    name: "British Pound (GBP)",
    spacing: "",
  },
};

export const DEFAULT_CURRENCY = "LKR";

/**
 * Formats a given price based on the currency code.
 */
export function formatPrice(amount: number, currencyCode: string = DEFAULT_CURRENCY): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES[DEFAULT_CURRENCY];
  const formatted = amount.toLocaleString(config.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${config.symbol}${config.spacing}${formatted}`;
}

/**
 * Server-side helper to retrieve the current store currency setting from the database.
 */
export async function getStoreCurrency(): Promise<string> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "currency" },
    });
    return setting?.value || DEFAULT_CURRENCY;
  } catch (error) {
    console.error("Error retrieving currency setting from DB:", error);
    return DEFAULT_CURRENCY;
  }
}
