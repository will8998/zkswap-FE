import { Token } from '@/lib/types'
import { formatNumber } from '@/lib/utils'

interface TokenInputProps {
  label: string
  token: Token | null
  amount: string
  onAmountChange?: (value: string) => void
  onTokenClick: () => void
  readOnly?: boolean
  usdValue?: string
  loading?: boolean
}

export default function TokenInput({
  label,
  token,
  amount,
  onAmountChange,
  onTokenClick,
  readOnly = false,
  usdValue,
  loading = false
}: TokenInputProps) {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onAmountChange && !readOnly) {
      const value = e.target.value
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        onAmountChange(value)
      }
    }
  }

  return (
    <div className="bg-zkira-input rounded-lg p-4">
      <div className="text-xs text-zkira-text-secondary mb-2">
        {label}
      </div>
      
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={loading ? '' : amount}
          onChange={handleAmountChange}
          placeholder={loading ? '' : '0'}
          disabled={readOnly || loading}
          className="bg-transparent text-white text-2xl font-mono flex-1 border-none outline-none placeholder-zkira-text-muted min-w-0"
        />
        
        <button
          onClick={onTokenClick}
          className="flex items-center gap-2 bg-zkira-border rounded-lg px-3 py-2 hover:bg-zkira-border-light transition-colors"
        >
          {token ? (
            <>
              <img 
                src={token.icon}
                alt={token.symbol}
                className="w-5 h-5 rounded-full"
              />
              <span className="text-white font-medium">
                {token.symbol}
              </span>
            </>
          ) : (
            <span className="text-zkira-text-secondary">
              Select
            </span>
          )}
          <svg
            className="w-4 h-4 text-zkira-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-zkira-text-secondary">
          {usdValue && !loading ? `$${formatNumber(parseFloat(usdValue))}` : ''}
          {loading && (
            <div className="animate-pulse bg-zkira-border rounded h-3 w-16"></div>
          )}
        </div>
        <div className="text-xs text-zkira-text-secondary">
          {token && !loading && (
            <span>Balance: —</span>
          )}
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-zkira-input rounded-lg flex items-center justify-center">
          <div className="animate-pulse text-2xl font-mono text-zkira-text-muted">
            <div className="bg-zkira-border rounded h-8 w-24"></div>
          </div>
        </div>
      )}
    </div>
  )
}