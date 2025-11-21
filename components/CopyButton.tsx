
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, label = "Копировать", className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-500 transform active:scale-90
        ${copied 
          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-105' 
          : 'bg-white text-stone-500 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:text-stone-800'
        } 
        ${className}
      `}
    >
      <div className={`transition-all duration-500 ${copied ? 'scale-100 rotate-0' : 'scale-0 rotate-45'} absolute inset-0 flex items-center justify-center`}>
         <Check size={16} strokeWidth={3} />
      </div>
      
      <div className={`flex items-center gap-2 transition-all duration-500 ${copied ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <Copy size={14} strokeWidth={2.5} />
        <span>{label}</span>
      </div>
      
      {copied && <span className="ml-6">Скопировано</span>}
    </button>
  );
};

export default CopyButton;
