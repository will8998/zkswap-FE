import { clsx, type ClassValue } from 'clsx';

export function formatNumber(n: number, decimals = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatUSD(n: number): string {
  return `$${formatNumber(n, 2)}`;
}

export function truncateAddress(addr: string, start = 6, end = 4): string {
  if (addr.length <= start + end) {
    return addr;
  }
  return `${addr.slice(0, start)}...${addr.slice(-end)}`;
}

export function validateAddress(address: string, validationRegex: string): boolean {
  try {
    const regex = new RegExp(validationRegex);
    return regex.test(address);
  } catch {
    return false;
  }
}

export function getTokenIconUrl(icon: string): string {
  return icon;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `~${Math.round(minutes)} min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (mins === 0) {
    return `~${hours} hr`;
  }

  return `~${hours} hr ${mins} min`;
}

export function cn(...classes: ClassValue[]): string {
  return clsx(classes);
}
