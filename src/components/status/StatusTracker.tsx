'use client';
import { useState } from 'react';
import { Token, ExchangeResponse } from '@/lib/types';
import { truncateAddress } from '@/lib/utils';
import { useStatus } from '@/hooks/useStatus';
import { DepositInfo } from './DepositInfo';
import { StatusProgress } from './StatusProgress';


function CopyLinkButton({ houdiniId }: { houdiniId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/swap/${houdiniId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-zkira-green hover:text-zkira-green/80 transition-colors"
    >
      {copied ? '✓ Copied!' : 'Copy Link'}
    </button>
  );
}

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

  // Use polled status, fall back to exchange response status when polling hasn't loaded yet
  const effectiveStatus = status?.status ?? exchange.status ?? 0;
  // Show deposit info for NEW (-1) and WAITING (0) — both mean user needs to send funds
  const isWaiting = effectiveStatus <= 0;
  const isFinished = effectiveStatus === 4;
  // Status 5 = Expired, 6 = Failed — NOT -1 (that's NEW/initializing)
  const isFailed = effectiveStatus === 5 || effectiveStatus === 6;
  const isRefunded = effectiveStatus === 7;

  const formatEstimatedTime = (eta: number) => {
    const minutes = Math.ceil(eta / 60);
    return `~${minutes} min${minutes !== 1 ? 's' : ''}`;
  };

  return (
    <div className="bg-zkira-card rounded-xl border border-zkira-border p-6 max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-zkira-text mb-2">Swap Status</h2>
        <div className="text-zkira-text-secondary text-sm font-mono flex items-center gap-2 flex-wrap">
          <span>ID: {truncateAddress(exchange.houdiniId)}</span>
          <button
            onClick={() => navigator.clipboard.writeText(exchange.houdiniId)}
            className="text-zkira-blue hover:text-zkira-blue/80 transition-colors"
          >
            Copy ID
          </button>
          <span className="text-zkira-text-muted">·</span>
          <CopyLinkButton houdiniId={exchange.houdiniId} />
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
          currentStatus={Math.max(effectiveStatus, 0)}
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
            {effectiveStatus === 5 ? 'Swap expired' : 'Swap failed'}
          </div>
          <button
            onClick={onNewSwap}
            className="bg-zkira-red hover:bg-zkira-red/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {isRefunded && (
        <div className="text-center">
          <div className="text-zkira-yellow font-medium mb-4">
            Swap refunded
          </div>
          <button
            onClick={onNewSwap}
            className="bg-zkira-yellow hover:bg-zkira-yellow/90 text-black px-4 py-2 rounded-lg font-medium transition-colors"
          >
            New Swap
          </button>
        </div>
      )}
    </div>
  );
}