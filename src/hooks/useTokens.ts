'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Token } from '@/lib/types';
import { getTokens } from '@/lib/api';
import { POPULAR_TOKEN_IDS } from '@/lib/constants';

export function useTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        const tokenList = await getTokens();
        setTokens(tokenList);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tokens');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  const sortedTokens = useMemo(() => {
    const popularTokens = tokens.filter(token => POPULAR_TOKEN_IDS.includes(token.id));
    const otherTokens = tokens.filter(token => !POPULAR_TOKEN_IDS.includes(token.id));
    
    popularTokens.sort((a, b) => {
      const aIndex = POPULAR_TOKEN_IDS.indexOf(a.id);
      const bIndex = POPULAR_TOKEN_IDS.indexOf(b.id);
      return aIndex - bIndex;
    });

    return [...popularTokens, ...otherTokens];
  }, [tokens]);

  const search = useCallback((query: string): Token[] => {
    if (!query.trim()) {
      return sortedTokens;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = tokens.filter(token => 
      token.symbol.toLowerCase().includes(lowerQuery) ||
      token.name.toLowerCase().includes(lowerQuery) ||
      (token.keyword && token.keyword.toLowerCase().includes(lowerQuery))
    );

    const popularFiltered = filtered.filter(token => POPULAR_TOKEN_IDS.includes(token.id));
    const otherFiltered = filtered.filter(token => !POPULAR_TOKEN_IDS.includes(token.id));

    popularFiltered.sort((a, b) => {
      const aIndex = POPULAR_TOKEN_IDS.indexOf(a.id);
      const bIndex = POPULAR_TOKEN_IDS.indexOf(b.id);
      return aIndex - bIndex;
    });

    return [...popularFiltered, ...otherFiltered];
  }, [tokens, sortedTokens]);

  return {
    tokens: sortedTokens,
    loading,
    error,
    search
  };
}