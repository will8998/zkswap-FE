'use client';

import { Token, ExchangeResponse } from '@/lib/types';
import { truncateAddress } from '@/lib/utils';
import { useStatus } from '@/hooks/useStatus';
import { DepositInfo } from './DepositInfo';
import { StatusProgress } from './StatusProgress';

interface StatusTrackerProps {
  exchange: ExchangeResponse;
  fromToken: Token;
  toToken: Token;
  anonymous: boolean;
  onNewSwap: () => void;
}

export function StatusTracker({
  exchange,
  fromToken,
  toToken,
  anonymous,
  onNewSwap
}: StatusTrackerProps) {
  const { status } = useStatus(exchange.houdiniId);

  const isWaiting = status?.status === 0;
  const isFinished = status?.status === 4;
  const isFailed = status?.status === -1 || status?.status === 5;

  const formatEstimatedTime = (eta: number) => {
    const minutes = Math.ceil(eta / 60);
    return `~${minutes} min${minutes !== 1 ? 's' : ''}`;
  };

  return (
    <div className="bg-zkira-card rounded-xl border border-zkira-border p-6 max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-zkira-text mb-2">Swap Status</h2>
        <div className="text-zkira-text-secondary text-sm font-mono">
          ID: {truncateAddress(exchange.houdiniId)}
          <button
            onClick={() => navigator.clipboard.writeText(exchange.houdiniId)}
            className="ml-2 text-zkira-blue hover:text-zkira-blue/80 transition-colors"
          >
            Copy
          </button>
        </div>
      </div>

      {isWaiting && (
        <div className="mb-6">
          <DepositInfo
            senderAddress={exchange.senderAddress}
            amount={exchange.inAmount}
            tokenSymbol={fromToken.symbol}
          />
        </div>
      )}

      <div className="mb-6">
        <StatusProgress
          currentStatus={status?.status || 0}
          anonymous={anonymous}
        />
      </div>

      <div className="mb-4">
        <div className="text-zkira-text-secondary text-sm">
          Amount: {exchange.inAmount} {fromToken.symbol} → {exchange.outAmount} {toToken.symbol}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-zkira-text-secondary text-sm">
          Estimated time: {formatEstimatedTime(exchange.eta)}
        </div>
      </div>

      {isFinished && (
        <div className="text-center">
          <div className="text-zkira-green font-medium mb-4">
            Swap completed successfully!
          </div>
          <button
            onClick={onNewSwap}
            className="bg-zkira-green hover:bg-zkira-green/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            New Swap
          </button>
        </div>
      )}

      {isFailed && (
        <div className="text-center">
          <div className="text-zkira-red font-medium mb-4">
            Swap failed or expired
          </div>
          <button
            onClick={onNewSwap}
            className="bg-zkira-red hover:bg-zkira-red/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}