'use client';

import { useState } from 'react';
import SwapCard from '@/components/swap/SwapCard';
import RoutesPanel from '@/components/swap/RoutesPanel';
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
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-4xl">
        <div className="w-full lg:w-[450px]">
          <SwapCard onSwapCreated={handleSwapCreated} />
        </div>
        <div className="w-full lg:w-[450px]">
          <RoutesPanel />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return <SwapPage />;
}
