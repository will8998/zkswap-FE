export const API_BASE = '/api/v1';

export const POPULAR_TOKEN_IDS = ['BTC', 'ETH', 'SOL', 'USDT', 'USDC', 'XMR', 'BNB', 'MATIC', 'ARB', 'AVAX'];

export const STATUS_LABELS: Record<number, string> = {
  [-1]: 'Initializing',
  0: 'Waiting for deposit',
  1: 'Confirming',
  2: 'Exchanging',
  3: 'Anonymizing',
  4: 'Completed',
  5: 'Expired',
  6: 'Failed',
  7: 'Refunded',
};

export const STATUS_COLORS: Record<number, string> = {
  [-1]: 'text-zkira-text-muted',
  0: 'text-zkira-yellow',
  1: 'text-zkira-yellow',
  2: 'text-zkira-blue',
  3: 'text-zkira-blue',
  4: 'text-zkira-green',
  5: 'text-zkira-red',
  6: 'text-zkira-red',
  7: 'text-zkira-yellow',
};

export const QUOTE_DEBOUNCE_MS = 500;
export const STATUS_POLL_INTERVAL_MS = 5000;
export const TERMINAL_STATUSES = [4, 5, 6, 7];

export const SOCIAL_LINKS = {
  twitter: 'https://x.com/zkira_xyz',
};
