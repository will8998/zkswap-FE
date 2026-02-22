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
    <div className="pt-12 md:pt-16 lg:pt-20 px-4">
      <div className="text-center mb-10 md:mb-12">
        <h1 
          className="font-orbitron font-normal text-4xl md:text-5xl lg:text-6xl text-white leading-tight"
          style={{ textShadow: '0 0 30px rgba(0, 200, 83, 0.3)' }}
        >
          BE UNTRACEABLE.<br />
          BE UNTOUCHABLE.
        </h1>
      </div>
      
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-4xl">
          <div className="w-full lg:w-[450px]">
            <SwapCard onSwapCreated={handleSwapCreated} />
          </div>
          <div className="w-full lg:w-[450px]">
            <RoutesPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return <SwapPage />;
}
