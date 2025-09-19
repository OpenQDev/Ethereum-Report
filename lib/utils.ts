import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats numbers with smart comma separators and K/M abbreviations
 * Examples:
 * 1234 → 1,234
 * 123456 → 123K
 * 1234567 → 1.2M
 */
export function formatNumber(value: string | number): string {
  const num = typeof value === "string" ? parseInt(value) : value;

  if (isNaN(num)) return value.toString();

  // For numbers >= 1 million, use M abbreviation
  if (num >= 1000000) {
    const millions = num / 1000000;
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
  }

  // For numbers >= 100,000, use K abbreviation
  if (num >= 100000) {
    const thousands = num / 1000;
    return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(0)}K`;
  }

  // For smaller numbers, use comma separators
  return num.toLocaleString();
}
