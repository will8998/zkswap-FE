'use client';

import { useState, useCallback } from 'react';
import type { ExchangeRequest, ExchangeResponse } from '@/lib/types';
import { createExchange } from '@/lib/api';

export function useExchange() {
  const [exchange, setExchange] = useState<ExchangeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: ExchangeRequest): Promise<ExchangeResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await createExchange(data);
      setExchange(result);
      setLoading(false);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create exchange';
      setError(message);
      setLoading(false);
      return null;
    }
  }, []);

  return { exchange, loading, error, create };
}
