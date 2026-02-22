'use client';

import { useState } from 'react';
import SwapCard from '@/components/swap/SwapCard';
import { StatusTracker } from '@/components/status/StatusTracker';
import { useSwap } from '@/context/SwapContext';
import type { ExchangeResponse } from '@/lib/types';

function SwapPage() {
  const { fromToken, toToken, anonymous, setStep, setExchange, reset } = useSwap();
  const [exchange, setLocalExchange] = useState<ExchangeResponse | null>(null);

  const handleSwapCreated = (ex: ExchangeResponse) => {
    setLocalExchange(ex);
    setExchange(ex);
    setStep('depositing');
  };

  const handleNewSwap = () => {
    setLocalExchange(null);
    reset();
  };

  if (exchange && fromToken && toToken) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <StatusTracker
          exchange={exchange}
          fromToken={fromToken}
          toToken={toToken}
          anonymous={anonymous}
          onNewSwap={handleNewSwap}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-zkira-text mb-2">
          Private Token Swaps
        </h1>
        <p className="text-zkira-text-secondary text-sm max-w-sm mx-auto">
          Swap tokens across chains with optional privacy routing through XMR
        </p>
      </div>
      <SwapCard onSwapCreated={handleSwapCreated} />
    </div>
  );
}

export default function Home() {
  return <SwapPage />;
}
