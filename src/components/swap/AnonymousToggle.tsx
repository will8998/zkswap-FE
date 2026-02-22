interface AnonymousToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export default function AnonymousToggle({ enabled, onChange }: AnonymousToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <svg
          className={`w-4 h-4 ${enabled ? 'text-zkira-green' : 'text-zkira-text-secondary'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
          />
        </svg>
        <span 
          className={`text-sm font-medium ${
            enabled ? 'text-zkira-green' : 'text-zkira-text-secondary'
          }`}
        >
          Private
        </span>
      </div>

      <button
        onClick={() => onChange(!enabled)}
        className="relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200"
        style={{
          backgroundColor: enabled ? 'var(--color-zkira-green)' : 'var(--color-zkira-border)'
        }}
        title="Route through XMR for privacy"
      >
        <div
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            enabled ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}