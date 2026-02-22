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
        <div className="flex items-center" />
      </div>
    </header>
  )
}
