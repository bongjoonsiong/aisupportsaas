import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { SupportedLanguage } from '../../locales';

interface LanguageSelectorProps {
  variant?: 'light' | 'dark' | 'ghost';
  compact?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'light',
  compact = false,
  className = '',
}) => {
  const { language, setLanguage, currentLanguageOption, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const buttonStyle = () => {
    if (variant === 'dark') {
      return 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700/80 hover:text-white';
    }
    if (variant === 'ghost') {
      return 'bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border-transparent';
    }
    // light (adaptive)
    return 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white shadow-xs';
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 ${buttonStyle()}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Change Language / 切换语言"
      >
        <span className="text-sm leading-none">{currentLanguageOption.flag}</span>
        {!compact && (
          <span className="hidden sm:inline-block font-medium">
            {currentLanguageOption.nativeName}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200/90 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>Select Language</span>
          </div>

          <div className="py-1">
            {languages.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLanguage(item.code as SupportedLanguage);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{item.flag}</span>
                    <div className="flex flex-col">
                      <span className="leading-tight">{item.nativeName}</span>
                      {item.nativeName !== item.name && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal leading-none mt-0.5">
                          {item.name}
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

};
