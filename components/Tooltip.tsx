import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'bottom',
  className = ''
}) => {
  const positionClasses = {
    top: 'bottom-full mb-2.5 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2.5 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2.5 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2.5 top-1/2 -translate-y-1/2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-stone-800 border-b-transparent border-x-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-stone-800 border-t-transparent border-x-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-stone-800 border-r-transparent border-y-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-stone-800 border-l-transparent border-y-transparent'
  };

  return (
    <div className={`group/tooltip relative flex items-center justify-center ${className}`}>
      {children}
      <div className={`absolute ${positionClasses[position]} px-3 py-1.5 bg-stone-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl transform scale-90 group-hover/tooltip:scale-100 origin-${position === 'top' ? 'bottom' : (position === 'bottom' ? 'top' : (position === 'left' ? 'right' : 'left'))}`}>
        {content}
        {/* Arrow */}
        <div className={`absolute w-0 h-0 border-[5px] ${arrowClasses[position]}`}></div>
      </div>
    </div>
  );
};

export default Tooltip;