'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Token, RouteQuote } from '@/lib/types';
import { getRouteQuotes } from '@/lib/api';
import { QUOTE_DEBOUNCE_MS } from '@/lib/constants';
import { useDebounce } from './useDebounce';

const QUOTE_REFRESH_INTERVAL = 60;

interface UseQuotesParams {
  amount: number | null;
  from: Token | null;
  to: Token | null;
}

export function useQuotes({ amount, from, to }: UseQuotesParams) {
  const [routes, setRoutes] = useState<RouteQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(QUOTE_REFRESH_INTERVAL);
  const abortControllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const debouncedAmount = useDebounce(amount, QUOTE_DEBOUNCE_MS);

  const fetchQuotes = useCallback(async (signal?: AbortSignal) => {
    if (!debouncedAmount || debouncedAmount <= 0 || !from || !to || from.id === to.id) {
      setRoutes([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getRouteQuotes({
        amount: debouncedAmount,
        from: from.id,
        to: to.id,
      });

      if (!signal?.aborted) {
        setRoutes(result);
        setLoading(false);
        setCountdown(QUOTE_REFRESH_INTERVAL);
      }
    } catch (err) {
      if (!signal?.aborted) {
        setError(err instanceof Error ? err.message : 'Failed to fetch quotes');
        setRoutes([]);
        setLoading(false);
      }
    }
  }, [debouncedAmount, from, to]);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    if (!debouncedAmount || debouncedAmount <= 0 || !from || !to || from.id === to.id) {
      setRoutes([]);
      setLoading(false);
      setError(null);
      setCountdown(QUOTE_REFRESH_INTERVAL);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    fetchQuotes(controller.signal);

    intervalRef.current = setInterval(() => {
      fetchQuotes(controller.signal);
    }, QUOTE_REFRESH_INTERVAL * 1000);

    countdownRef.current = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? QUOTE_REFRESH_INTERVAL : prev - 1));
    }, 1000);

    return () => {
      controller.abort();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [debouncedAmount, from, to, fetchQuotes]);

  useEffect(() => {
    if (amount && amount > 0 && from && to) {
      setLoading(true);
    }
  }, [amount, from, to]);

  return { routes, loading, error, countdown };
}
