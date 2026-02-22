import { API_BASE } from './constants';
import type {
  Token,
  QuoteResponse,
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
    const message = `API Error: ${response.status} ${response.statusText}`;
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

export async function createExchange(data: ExchangeRequest): Promise<ExchangeResponse> {
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
