'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Token, QuoteResponse, RouteQuote, ExchangeResponse, SwapStep } from '@/lib/types';

interface SwapState {
  fromToken: Token | null;
  toToken: Token | null;
  amount: string;
  anonymous: boolean;
  destinationAddress: string;
  step: SwapStep;
  quote: QuoteResponse | null;
  selectedRoute: RouteQuote | null;
  exchange: ExchangeResponse | null;
  error: string | null;
}

interface SwapContextValue extends SwapState {
  setFromToken: (token: Token | null) => void;
  setToToken: (token: Token | null) => void;
  setAmount: (amount: string) => void;
  setAnonymous: (anon: boolean) => void;
  setDestinationAddress: (addr: string) => void;
  setStep: (step: SwapStep) => void;
  setQuote: (quote: QuoteResponse | null) => void;
  setSelectedRoute: (route: RouteQuote | null) => void;
  setExchange: (exchange: ExchangeResponse | null) => void;
  setError: (error: string | null) => void;
  flipTokens: () => void;
  reset: () => void;
}

const initialState: SwapState = {
  fromToken: null,
  toToken: null,
  amount: '',
  anonymous: false,
  destinationAddress: '',
  step: 'idle',
  quote: null,
  selectedRoute: null,
  exchange: null,
  error: null,
};

const SwapContext = createContext<SwapContextValue | null>(null);

export function SwapProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SwapState>(initialState);

  const setFromToken = useCallback((token: Token | null) => {
    setState(prev => ({ ...prev, fromToken: token, quote: null, selectedRoute: null }));
  }, []);

  const setToToken = useCallback((token: Token | null) => {
    setState(prev => ({ ...prev, toToken: token, quote: null, selectedRoute: null }));
  }, []);

  const setAmount = useCallback((amount: string) => {
    setState(prev => ({ ...prev, amount }));
  }, []);

  const setAnonymous = useCallback((anonymous: boolean) => {
    setState(prev => ({ ...prev, anonymous, quote: null, selectedRoute: null }));
  }, []);

  const setDestinationAddress = useCallback((destinationAddress: string) => {
    setState(prev => ({ ...prev, destinationAddress }));
  }, []);

  const setStep = useCallback((step: SwapStep) => {
    setState(prev => ({ ...prev, step }));
  }, []);

  const setQuote = useCallback((quote: QuoteResponse | null) => {
    setState(prev => ({ ...prev, quote }));
  }, []);

  const setSelectedRoute = useCallback((selectedRoute: RouteQuote | null) => {
    setState(prev => ({
      ...prev,
      selectedRoute,
      anonymous: selectedRoute?.routeType === 'private',
      quote: selectedRoute ?? null,
    }));
  }, []);

  const setExchange = useCallback((exchange: ExchangeResponse | null) => {
    setState(prev => ({ ...prev, exchange }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const flipTokens = useCallback(() => {
    setState(prev => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      quote: null,
      selectedRoute: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <SwapContext.Provider
      value={{
        ...state,
        setFromToken,
        setToToken,
        setAmount,
        setAnonymous,
        setDestinationAddress,
        setStep,
        setQuote,
        setSelectedRoute,
        setExchange,
        setError,
        flipTokens,
        reset,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
}

export function useSwap(): SwapContextValue {
  const context = useContext(SwapContext);
  if (!context) {
    throw new Error('useSwap must be used within a SwapProvider');
  }
  return context;
}
