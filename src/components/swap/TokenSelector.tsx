'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Token } from '@/lib/types'
import { useTokens } from '@/hooks/useTokens'
import { TokenList } from './TokenList'

interface TokenSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (token: Token) => void
  selectedToken: Token | null
  label: string
}

export function TokenSelector({
  isOpen,
  onClose,
  onSelect,
  selectedToken,
  label
}: TokenSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { tokens, search, loading } = useTokens()

  const filteredTokens = searchTerm ? search(searchTerm) : tokens

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('')
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  function handleTokenSelect(token: Token) {
    onSelect(token)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-md mx-4 mt-20 bg-zkira-card rounded-xl border border-zkira-border max-h-[70vh] flex flex-col animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-zkira-border">
          <h3 className="text-lg font-semibold text-zkira-text">{label}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zkira-text-secondary hover:text-zkira-text hover:bg-zkira-card-hover transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 border-b border-zkira-border">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2.5 bg-zkira-input text-white border border-zkira-border rounded-lg placeholder:text-zkira-text-muted focus:outline-none focus:ring-2 focus:ring-zkira-green/50 focus:border-zkira-green/50 transition-all"
          />
        </div>

        <div className="flex-1 min-h-0" style={{ height: '400px' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin w-6 h-6 text-zkira-green" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-sm text-zkira-text-secondary">Loading tokens...</span>
              </div>
            </div>
          ) : (
            <TokenList
              tokens={filteredTokens}
              onSelect={handleTokenSelect}
              selectedToken={selectedToken}
            />
          )}
        </div>

        <div className="px-4 py-2 border-t border-zkira-border text-xs text-zkira-text-muted text-center">
          {filteredTokens.length} tokens available
        </div>
      </div>
    </div>
  )
}

export default TokenSelector
