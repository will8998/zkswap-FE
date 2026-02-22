export interface Network {
  name: string;
  shortName: string;
  addressValidation: string;
  memoNeeded: boolean;
  explorerUrl: string;
  addressUrl: string;
  priority: number;
  kind: 'evm' | 'bitcoin' | 'sol' | string;
  chainId: number | null;
  icon: string;
}

// HoudiniSwap returns minMax as [min, max] tuples
export type MinMaxRange = [number, number];
export interface TokenMinMax {
  cex: MinMaxRange | null;
  anon: MinMaxRange | null;
}

export interface Token {
  id: string;
  name: string;
  symbol: string;
  network: Network;
  color: string;
  keyword: string;
  displayName: string;
  chain: number | null;
  address: string | null;
  networkPriority: number;
  icon: string;
  price: number | null;
  hasFixed: boolean;
  hasFixedReverse: boolean;
  minMax: TokenMinMax | null;
}

export interface QuoteResponse {
  amountOut: number;
  min: number;
  max: number;
  path: string;
  rateId: string | null;
  amountIn: number;
  duration: number;
  amountOutUsd: number;
  inQuoteId: string;
  filtered: boolean;
  type: string;
  markupSupported: boolean;
  quoteId: string;
  rewardsAvailable: boolean;
  swap: string;
  swapName: string;
  logoUrl: string;
}

export type RouteType = 'standard' | 'private';

export interface RouteQuote extends QuoteResponse {
  routeType: RouteType;
  routeLabel: string;
  percentDiff: number;
}

export interface SwapProvider {
  name: string;
  shortName: string;
  logoUrl: string;
  slippage: number;
  markupSupported: boolean;
  txUrl: string;
  enabled: boolean;
  isDex: boolean;
}

export interface ExchangeRequest {
  amount: number;
  from: string;
  to: string;
  addressTo: string;
  anonymous: boolean;
  inviteCode?: string;
}

export interface ExchangeResponse {
  houdiniId: string;
  senderAddress: string;
  receiverAddress: string;
  status: number;
  inAmount: number;
  outAmount: number;
  expires: string;
  eta: number;
}

export enum SwapStatus {
  NEW = -1,
  WAITING = 0,
  CONFIRMING = 1,
  EXCHANGING = 2,
  ANONYMIZING = 3,
  FINISHED = 4,
  EXPIRED = 5,
  FAILED = 6,
  REFUNDED = 7,
}

export interface StatusResponse {
  houdiniId: string;
  status: SwapStatus;
  inAmount: number;
  outAmount: number;
  from: string;
  to: string;
  addressTo: string;
  senderAddress: string;
  hash?: string;
  hashOut?: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}

export interface VolumeResponse {
  count: number;
  totalTransactedUSD: number;
}

export type SwapStep = 'idle' | 'quoting' | 'ready' | 'submitting' | 'depositing' | 'tracking';
