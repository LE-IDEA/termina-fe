import Image from 'next/image';
import { Geologica, Instrument_Serif } from 'next/font/google';
import { useAppConnection } from '@/providers/PrivyProvider';
import { useState, useEffect, useRef } from 'react';

const geologica = Geologica({ weight: ['300','400','500','600'], subsets: ['latin'] });
const instrumentSerif = Instrument_Serif({ weight: '400', subsets: ['latin'] });

export interface CurrencyItem {
  imgURL: string;
  id: number;
  curName: string;
  curCode: string;
  symbol: string;
  conversionRate: number;
}

interface CurrencyChangeProps {
  currencies: CurrencyItem[];
  selectedCurrency: CurrencyItem;
  onCurrencySelect: (currency: CurrencyItem) => void;
  onClose: () => void;
}

export default function CurrencyChange({ 
  currencies, 
  selectedCurrency, 
  onCurrencySelect, 
  onClose 
}: CurrencyChangeProps) {
  const { ready } = useAppConnection();
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Focus management for keyboard navigation
  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) => 
          prev < currencies.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) => 
          prev > 0 ? prev - 1 : currencies.length - 1
        );
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedIndex >= 0) {
          handleCurrencySelect(currencies[focusedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
      default:
        // Handle letter key navigation
        const key = event.key.toLowerCase();
        const matchIndex = currencies.findIndex((currency, index) => 
          index > focusedIndex && currency.curName.toLowerCase().startsWith(key)
        );
        if (matchIndex >= 0) {
          setFocusedIndex(matchIndex);
        } else {
          // Wrap around to beginning
          const wrapIndex = currencies.findIndex(currency => 
            currency.curName.toLowerCase().startsWith(key)
          );
          if (wrapIndex >= 0) {
            setFocusedIndex(wrapIndex);
          }
        }
        break;
    }
  };

  const handleCurrencySelect = (currency: CurrencyItem) => {
    onCurrencySelect(currency);
  };

  const handleMouseEnter = (index: number) => {
    setFocusedIndex(index);
  };

  if (!ready) return null;

  return (
    <div 
      className="bg-white rounded-lg shadow-lg p-1 w-48 max-h-64 overflow-y-auto"
      role="listbox"
      aria-label="Available currencies"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="p-2 border-b border-gray-100">
        <h3 className={`${instrumentSerif.className} text-sm font-medium text-gray-900`}>
          Select Currency
        </h3>
      </div>
      
      {currencies.map((currency, index) => {
        const isSelected = selectedCurrency.id === currency.id;
        const isFocused = focusedIndex === index;
        
        return (
          <button
            key={currency.id}
            ref={(el) => { itemRefs.current[index] = el }}
            onClick={() => handleCurrencySelect(currency)}
            onMouseEnter={() => handleMouseEnter(index)}
            className={`
              flex items-center gap-3 w-full p-2 mb-0.5 rounded-md transition-colors
              hover:bg-gray-100 focus:outline-none focus:bg-gray-100
              ${isSelected ? 'bg-blue-50 border border-blue-200' : ''}
              ${isFocused ? 'bg-gray-100' : ''}
            `}
            role="option"
            aria-selected={isSelected}
            aria-label={`Select ${currency.curName} (${currency.curCode})`}
            tabIndex={isFocused ? 0 : -1}
          >
            <div className="flex-shrink-0">
              <Image 
                src={currency.imgURL} 
                alt="" 
                width={28} 
                height={28}
                className="rounded-full"
              />
            </div>
            
            <div className="flex flex-col text-left flex-grow min-w-0">
              <span className={`${instrumentSerif.className} font-medium text-sm text-gray-900 truncate`}>
                {currency.curName}
              </span>
              <span className={`${geologica.className} font-normal text-xs text-gray-500`}>
                {currency.curCode} • {currency.symbol}
              </span>
            </div>
            
            {isSelected && (
              <div className="flex-shrink-0 ml-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" aria-hidden="true" />
              </div>
            )}
          </button>
        );
      })}
      
      <div className="p-2 pt-1 border-t border-gray-100 mt-1">
        <p className={`${geologica.className} text-xs text-gray-400 text-center`}>
          Use ↑↓ keys to navigate
        </p>
      </div>
    </div>
  );
}