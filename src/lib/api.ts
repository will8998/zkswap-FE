import { API_BASE } from './constants';
import type {
  Token,
  QuoteResponse,
  RouteQuote,
  SwapProvider,
  ExchangeRequest,
  ExchangeResponse,
  StatusResponse,
  HealthResponse,
  VolumeResponse,
} from './types';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    // Try to parse structured error from backend
    let message = `API Error: ${response.status} ${response.statusText}`;
    try {
      const body = await response.json();
      if (body && typeof body === 'object') {
        // Backend returns { error: "...", status: N, details: {...} }
        // Next.js proxy wraps it as { error: "{json string}" }
        if (typeof body.error === 'string') {
          try {
            const parsed = JSON.parse(body.error);
            message = parsed.error || parsed.message || body.error;
          } catch {
            message = body.error;
          }
        }
      }
    } catch {
      // response wasn't JSON, use default message
    }
    throw new ApiError(response.status, message);
  }
  return response.json() as Promise<T>;
}

export async function getTokens(): Promise<Token[]> {
  return fetchJson<Token[]>(`${API_BASE}/tokens`);
}

export async function getQuote(params: {
  amount: number;
  from: string;
  to: string;
  anonymous: boolean;
}): Promise<QuoteResponse> {
  const searchParams = new URLSearchParams({
    amount: params.amount.toString(),
    from: params.from,
    to: params.to,
    anonymous: params.anonymous.toString(),
  });

  return fetchJson<QuoteResponse>(`${API_BASE}/quote?${searchParams}`);
}

export async function createExchange(data: ExchangeRequest & { inviteCode?: string }): Promise<ExchangeResponse> {
  return fetchJson<ExchangeResponse>(`${API_BASE}/exchange`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function getStatus(houdiniId: string): Promise<StatusResponse> {
  return fetchJson<StatusResponse>(`${API_BASE}/status/${houdiniId}`);
}

export async function getHealth(): Promise<HealthResponse> {
  return fetchJson<HealthResponse>(`${API_BASE}/health`);
}

export async function getVolume(): Promise<VolumeResponse> {
  return fetchJson<VolumeResponse>(`${API_BASE}/volume`);
}

export async function getRouteQuotes(params: {
  amount: number;
  from: string;
  to: string;
}): Promise<RouteQuote[]> {
  const searchParams = new URLSearchParams({
    amount: params.amount.toString(),
    from: params.from,
    to: params.to,
  });

  return fetchJson<RouteQuote[]>(`${API_BASE}/quotes?${searchParams}`);
}

export async function getSwapProviders(): Promise<SwapProvider[]> {
  return fetchJson<SwapProvider[]>(`${API_BASE}/swaps`);
}

export async function validateInviteCode(code: string): Promise<{ valid: boolean; used: boolean }> {
  return fetchJson<{ valid: boolean; used: boolean }>(`${API_BASE}/invite/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
}
