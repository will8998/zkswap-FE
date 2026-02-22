'use client'

import { useState, useEffect } from 'react'
import { useSwap } from '@/context/SwapContext'
import { useTokens } from '@/hooks/useTokens'
import { useQuote } from '@/hooks/useQuote'
import { useExchange } from '@/hooks/useExchange'
import type { ExchangeResponse } from '@/lib/types'
import TokenInput from './TokenInput'
import SwapDirectionButton from './SwapDirectionButton'
import QuoteDisplay from './QuoteDisplay'
import AnonymousToggle from './AnonymousToggle'
import AddressInput from './AddressInput'
import SwapButton from './SwapButton'
import { TokenSelector } from './TokenSelector'

interface SwapCardProps {
  onSwapCreated: (exchange: ExchangeResponse) => void
}

export default function SwapCard({ onSwapCreated }: SwapCardProps) {
  const {
    fromToken,
    toToken,
    amount,
    anonymous,
    destinationAddress,
    quote,
    setFromToken,
    setToToken,
    setAmount,
    setAnonymous,
    setDestinationAddress,
    setQuote,
  } = useSwap()

  const { tokens, search } = useTokens()
  const { quote: fetchedQuote, loading: quoteLoading, error: quoteError } = useQuote({
    amount: amount ? parseFloat(amount) : null,
    from: fromToken,
    to: toToken,
    anonymous,
  })
  const { create: createExchange, loading: exchangeLoading, error: exchangeError } = useExchange()

  const [tokenSelectorOpen, setTokenSelectorOpen] = useState<'from' | 'to' | null>(null)

  useEffect(() => {
    if (fetchedQuote && fetchedQuote !== quote) {
      setQuote(fetchedQuote)
    }
  }, [fetchedQuote, quote, setQuote])

  const getSwapButtonLabel = () => {
    if (exchangeLoading) return 'Swapping...'
    if (!fromToken || !toToken) return 'Select tokens'
    if (fromToken && toToken && fromToken.id === toToken.id) return 'Select different tokens'
    if (!amount || parseFloat(amount) <= 0) return 'Enter amount'
    if (!destinationAddress) return 'Enter destination address'
    if (quoteLoading) return 'Getting quote...'
    if (!quote) return 'Enter amount'
    return 'Swap'
  }

  const isSwapDisabled = () => {
    return (
      !fromToken ||
      !toToken ||
      fromToken?.id === toToken?.id ||
      !amount ||
      parseFloat(amount) <= 0 ||
      !destinationAddress ||
      !quote ||
      exchangeLoading ||
      quoteLoading
    )
  }

  const handleSwap = async () => {
    if (isSwapDisabled() || !fromToken || !toToken) return

    try {
      const exchange = await createExchange({
        amount: parseFloat(amount),
        from: fromToken.id,
        to: toToken.id,
        addressTo: destinationAddress,
        anonymous,
      })

      if (exchange) {
        onSwapCreated(exchange)
      }
    } catch (error) {
      console.error('Swap failed:', error)
    }
  }

  const error = quoteError || exchangeError

  return (
    <div className="bg-zkira-card rounded-xl border border-zkira-border p-6 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-zkira-text">Swap</h2>
        <AnonymousToggle
          enabled={anonymous}
          onChange={setAnonymous}
        />
      </div>

      <div className="space-y-1">
        <TokenInput
          label="From"
          token={fromToken}
          amount={amount}
          onAmountChange={setAmount}
          onTokenClick={() => setTokenSelectorOpen('from')}
        />

        <div className="relative flex justify-center -my-3 z-10">
          <SwapDirectionButton />
        </div>

        <TokenInput
          label="To"
          token={toToken}
          amount={quote ? String(quote.amountOut) : ''}
          onTokenClick={() => setTokenSelectorOpen('to')}
          readOnly={true}
          loading={quoteLoading}
          usdValue={quote ? String(quote.amountOutUsd) : undefined}
        />
      </div>

      {quote && fromToken && toToken && (
        <QuoteDisplay
          quote={quote}
          fromToken={fromToken}
          toToken={toToken}
        />
      )}

      <AddressInput
        value={destinationAddress}
        onChange={setDestinationAddress}
        token={toToken}
      />

      <div className="mt-4">
        <SwapButton
          onClick={handleSwap}
          disabled={isSwapDisabled()}
          loading={exchangeLoading}
          label={getSwapButtonLabel()}
        />
      </div>

      {error && (
        <div className="text-zkira-red text-sm text-center mt-3">
          {error}
        </div>
      )}

      <TokenSelector
        isOpen={tokenSelectorOpen === 'from'}
        onClose={() => setTokenSelectorOpen(null)}
        onSelect={(token) => {
          setFromToken(token)
          setTokenSelectorOpen(null)
        }}
        selectedToken={fromToken}
        label="Select token to send"
      />

      <TokenSelector
        isOpen={tokenSelectorOpen === 'to'}
        onClose={() => setTokenSelectorOpen(null)}
        onSelect={(token) => {
          setToToken(token)
          setTokenSelectorOpen(null)
        }}
        selectedToken={toToken}
        label="Select token to receive"
      />
    </div>
  )
}
