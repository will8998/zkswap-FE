'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Token, QuoteResponse, RouteQuote, ExchangeResponse, SwapStep } from '@/lib/types';
import { getTokens } from '@/lib/api';

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

  // Set default USDT tokens on mount
  useEffect(() => {
    const setDefaultTokens = async () => {
      // Only set defaults if user hasn't already selected tokens
      if (state.fromToken !== null) return;
      
      try {
        const tokens = await getTokens();
        
        // Find USDT on Ethereum for fromToken
        const fromToken = tokens.find(t => t.symbol === 'USDT' && t.network.shortName === 'ETH');
        
        // Find USDT on other networks for toToken, try in order
        const toToken = 
          tokens.find(t => t.symbol === 'USDT' && t.network.shortName === 'TRX') ||
          tokens.find(t => t.symbol === 'USDT' && t.network.shortName === 'TRON') ||
          tokens.find(t => t.symbol === 'USDT' && t.network.shortName === 'BSC') ||
          tokens.find(t => t.symbol === 'USDT' && t.network.name !== 'Ethereum');
        
        // Set both tokens if found
        if (fromToken && toToken) {
          setState(prev => ({
            ...prev,
            fromToken,
            toToken
          }));
        }
      } catch (error) {
        // Silently fail if token fetch fails
        console.debug('Failed to set default tokens:', error);
      }
    };
    
    setDefaultTokens();
  }, []); // Empty dependency array - only run once on mount

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
