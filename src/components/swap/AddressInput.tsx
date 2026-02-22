import { useState } from 'react'
import { Token } from '@/lib/types'
import { validateAddress } from '@/lib/utils'

interface AddressInputProps {
  value: string
  onChange: (value: string) => void
  token: Token | null
  error?: string
}

export default function AddressInput({ value, onChange, token, error }: AddressInputProps) {
  const [validationError, setValidationError] = useState<string>('')

  const handleBlur = () => {
    if (value && token?.network?.addressValidation) {
      const isValid = validateAddress(value, token.network.addressValidation)
      if (!isValid) {
        setValidationError(`Invalid ${token.network.shortName} address format`)
      } else {
        setValidationError('')
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    if (validationError) {
      setValidationError('')
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      onChange(text.trim())
      if (validationError) {
        setValidationError('')
      }
    } catch (err) {
      console.error('Failed to paste:', err)
    }
  }

  const getPlaceholder = () => {
    if (token?.network?.shortName) {
      return `Enter ${token.network.shortName} address`
    }
    return 'Select a token first'
  }

  const displayError = error || validationError

  return (
    <div className="mt-4">
      <label className="block text-xs text-zkira-text-secondary mb-2">
        Destination Address
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={getPlaceholder()}
          disabled={!token}
          className="bg-zkira-input rounded-lg p-3 pr-12 text-sm font-mono text-white w-full border border-transparent focus:border-zkira-border-light outline-none placeholder-zkira-text-muted disabled:opacity-50"
        />
        
        <button
          onClick={handlePaste}
          disabled={!token}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zkira-text-secondary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>
      </div>

      {displayError && (
        <div className="text-zkira-red text-xs mt-2">
          {displayError}
        </div>
      )}
    </div>
  )
}