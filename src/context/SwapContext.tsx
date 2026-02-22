'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Token, QuoteResponse, ExchangeResponse, SwapStep } from '@/lib/types';

interface SwapState {
  fromToken: Token | null;
  toToken: Token | null;
  amount: string;
  anonymous: boolean;
  destinationAddress: string;
  step: SwapStep;
  quote: QuoteResponse | null;
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
  exchange: null,
  error: null,
};

const SwapContext = createContext<SwapContextValue | null>(null);

export function SwapProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SwapState>(initialState);

  const setFromToken = useCallback((token: Token | null) => {
    setState(prev => ({ ...prev, fromToken: token, quote: null }));
  }, []);

  const setToToken = useCallback((token: Token | null) => {
    setState(prev => ({ ...prev, toToken: token, quote: null }));
  }, []);

  const setAmount = useCallback((amount: string) => {
    setState(prev => ({ ...prev, amount }));
  }, []);

  const setAnonymous = useCallback((anonymous: boolean) => {
    setState(prev => ({ ...prev, anonymous, quote: null }));
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
