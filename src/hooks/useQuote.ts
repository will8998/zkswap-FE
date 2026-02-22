'use client';

import { useState, useEffect, useRef } from 'react';
import type { Token, QuoteResponse } from '@/lib/types';
import { getQuote } from '@/lib/api';
import { QUOTE_DEBOUNCE_MS } from '@/lib/constants';
import { useDebounce } from './useDebounce';

interface UseQuoteParams {
  amount: number | null;
  from: Token | null;
  to: Token | null;
  anonymous: boolean;
}

export function useQuote({ amount, from, to, anonymous }: UseQuoteParams) {
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const debouncedAmount = useDebounce(amount, QUOTE_DEBOUNCE_MS);

  useEffect(() => {
    if (!debouncedAmount || debouncedAmount <= 0 || !from || !to) {
      setQuote(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchQuote = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getQuote({
          amount: debouncedAmount,
          from: from.id,
          to: to.id,
          anonymous,
        });

        if (!controller.signal.aborted) {
          setQuote(result);
          setLoading(false);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch quote');
          setQuote(null);
          setLoading(false);
        }
      }
    };

    fetchQuote();

    return () => {
      controller.abort();
    };
  }, [debouncedAmount, from, to, anonymous]);

  useEffect(() => {
    if (amount && amount > 0 && from && to) {
      setLoading(true);
    }
  }, [amount, from, to]);

  return { quote, loading, error };
}
