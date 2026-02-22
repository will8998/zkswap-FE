import { QuoteResponse, Token } from '@/lib/types'
import { formatNumber, formatUSD } from '@/lib/utils'

interface QuoteDisplayProps {
  quote: QuoteResponse
  fromToken: Token
  toToken: Token
}

export default function QuoteDisplay({ quote, fromToken, toToken }: QuoteDisplayProps) {
  const rate = quote.amountOut / quote.amountIn
  const formattedRate = formatNumber(rate, 6)

  return (
    <div className="mt-3 text-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-zkira-text-secondary">Rate</span>
        <span className="text-white">
          1 {fromToken.symbol} ≈ {formattedRate} {toToken.symbol}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-zkira-text-secondary flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Est. time
        </span>
        <span className="text-white">
          ~{Math.ceil(quote.duration / 60)} min
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-zkira-text-secondary">Provider</span>
        <div className="flex items-center gap-2">
          <img 
            src={quote.logoUrl} 
            alt={quote.swapName}
            className="w-4 h-4 rounded"
          />
          <span className="text-white">{quote.swapName}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-zkira-text-secondary">You receive</span>
        <span className="text-white">
          {formatUSD(quote.amountOutUsd)}
        </span>
      </div>
    </div>
  )
}