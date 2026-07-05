import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number of rupees into a compact Indian-style string,
 * e.g. 1234567 -> "₹12.3L", 45000 -> "₹45,000", 950 -> "₹950".
 */
export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, "")}Cr`
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1).replace(/\.0$/, "")}L`
  }
  return `₹${amount.toLocaleString("en-IN")}`
}
