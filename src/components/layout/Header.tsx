'use client'

import Logo from './Logo'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zkira-bg border-b border-zkira-border">
      <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <Logo />
          <nav>
            <span className="text-white font-medium border-b-2 border-zkira-green pb-1">
              Swap
            </span>
          </nav>
        </div>
        <div className="flex items-center">
          <button className="text-zkira-text-secondary hover:text-zkira-text transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
