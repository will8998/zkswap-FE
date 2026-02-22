import { useState } from 'react'
import { useSwap } from '@/context/SwapContext'

export default function SwapDirectionButton() {
  const { flipTokens } = useSwap()
  const [isFlipping, setIsFlipping] = useState(false)

  const handleClick = () => {
    if (flipTokens) {
      setIsFlipping(true)
      flipTokens()
      setTimeout(() => setIsFlipping(false), 300)
    }
  }

  return (
    <div className="flex justify-center -my-3 relative z-10">
      <button
        onClick={handleClick}
        className="w-10 h-10 bg-zkira-border rounded-full flex items-center justify-center hover:bg-zkira-border-light transition-all duration-200 hover:scale-110"
      >
        <svg
          className={`w-5 h-5 text-zkira-text-secondary transition-transform duration-300 ${
            isFlipping ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" 
          />
        </svg>
      </button>
    </div>
  )
}