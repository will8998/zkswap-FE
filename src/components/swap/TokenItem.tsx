'use client'

import React, { useState } from 'react'
import { Token } from '@/lib/types'
import { formatUSD } from '@/lib/utils'

interface TokenItemProps {
  token: Token
  isSelected: boolean
  onSelect: (token: Token) => void
}

export function TokenItem({ token, isSelected, onSelect }: TokenItemProps) {
  const [imageError, setImageError] = useState(false)

  function handleImageError() {
    setImageError(true)
  }

  function handleClick() {
    onSelect(token)
  }

  function getInitial() {
    return token.symbol.charAt(0).toUpperCase()
  }

  function getBackgroundColor() {
    if (token.color) {
      return token.color
    }
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#1DD1A1', '#FD79A8'
    ]
    const index = token.symbol.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div
      onClick={handleClick}
      className={`
        flex items-center px-4 h-14 cursor-pointer transition-colors
        hover:bg-zkira-card-hover
        ${isSelected 
          ? 'border-l-2 border-zkira-green bg-zkira-card-hover/50' 
          : 'border-l-2 border-transparent'
        }
      `.trim().replace(/\s+/g, ' ')}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          {!imageError ? (
            <img
              src={token.icon}
              alt={token.symbol}
              className="w-6 h-6 rounded-full"
              onError={handleImageError}
            />
          ) : (
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold"
              style={{ backgroundColor: getBackgroundColor() }}
            >
              {getInitial()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-zkira-text truncate">
              {token.symbol}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-zkira-input text-zkira-text-secondary border border-zkira-border">
              {token.network.shortName}
            </span>
          </div>
          <div className="text-xs text-zkira-text-secondary truncate">
            {token.name}
          </div>
        </div>
      </div>

      {token.price && (
        <div className="flex-shrink-0 text-xs text-zkira-text-secondary">
          {formatUSD(token.price)}
        </div>
      )}
    </div>
  )
}