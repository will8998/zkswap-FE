import { SwapStatus } from '@/lib/types';
import { STATUS_LABELS } from '@/lib/constants';

interface StatusProgressProps {
  currentStatus: number;
  anonymous: boolean;
}

export function StatusProgress({
  currentStatus,
  anonymous
}: StatusProgressProps) {
  const steps = anonymous 
    ? [0, 1, 2, 3, 4] 
    : [0, 1, 2, 4];

  const getStepStatus = (step: number): 'completed' | 'current' | 'pending' | 'failed' => {
    if (currentStatus === 5 || currentStatus === 6) {
      if (step < currentStatus) return 'completed';
      if (step === currentStatus) return 'failed';
      return 'pending';
    }
    
    if (step < currentStatus) return 'completed';
    if (step === currentStatus) return 'current';
    return 'pending';
  };

  const getStepStyles = (status: 'completed' | 'current' | 'pending' | 'failed') => {
    switch (status) {
      case 'completed':
        return 'bg-zkira-green';
      case 'current':
        return 'bg-zkira-green animate-pulse-dot';
      case 'failed':
        return 'bg-zkira-red';
      case 'pending':
      default:
        return 'bg-zkira-border-light';
    }
  };

  const getLineStyles = (fromStep: number, toStep: number) => {
    const fromStatus = getStepStatus(fromStep);
    const toStatus = getStepStatus(toStep);
    
    if (fromStatus === 'completed' && toStatus === 'completed') {
      return 'bg-zkira-green';
    }
    if (fromStatus === 'completed' && toStatus === 'current') {
      return 'bg-gradient-to-r from-zkira-green to-zkira-border-light';
    }
    return 'bg-zkira-border-light';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step);
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step} className="flex flex-col items-center flex-1 relative">
              <div className="flex items-center w-full">
                <div className="flex flex-col items-center">
                  <div 
                    className={`
                      w-8 h-8 rounded-full border-2 border-transparent flex items-center justify-center relative z-10
                      ${getStepStyles(stepStatus)}
                    `}
                  >
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                  <div className="text-xs text-zkira-text-secondary mt-2 text-center max-w-20">
                    {STATUS_LABELS[step] || `Status ${step}`}
                  </div>
                </div>
                
                {!isLast && (
                  <div className="flex-1 h-0.5 mx-2 relative">
                    <div 
                      className={`
                        absolute inset-0 h-full
                        ${getLineStyles(step, steps[index + 1])}
                      `}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}