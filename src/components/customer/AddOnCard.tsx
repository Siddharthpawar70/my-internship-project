import React from 'react';
import { Plus, Check, Car, Coffee, Sparkles, Clock, Wine, Baby } from 'lucide-react';
import { AddOn } from '../../types';

interface AddOnCardProps {
  addOn: AddOn;
  isSelected: boolean;
  quantity: number;
  onToggle: (addOn: AddOn, quantity?: number) => void;
}

export function AddOnCard({ addOn, isSelected, quantity, onToggle }: AddOnCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Car':
        return <Car className="w-5 h-5 text-[#C5A880]" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-[#C5A880]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#C5A880]" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-[#C5A880]" />;
      case 'Wine':
        return <Wine className="w-5 h-5 text-[#C5A880]" />;
      case 'Baby':
        return <Baby className="w-5 h-5 text-[#C5A880]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#C5A880]" />;
    }
  };

  const priceLabel = addOn.priceType === 'per_night'
    ? 'per night'
    : addOn.priceType === 'per_guest'
    ? 'per guest'
    : 'per stay';

  return (
    <div
      onClick={() => onToggle(addOn)}
      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
        isSelected
          ? 'border-[#1E252B] bg-[#FAF9F6] ring-1 ring-[#1E252B] shadow-xs'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 shrink-0">
          {getIcon(addOn.iconName)}
        </div>
        <div>
          <h4 className="font-bold text-xs text-gray-900">{addOn.name}</h4>
          <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
            {addOn.description}
          </p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-bold text-xs text-gray-900">
              ₹{addOn.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-gray-400">/{priceLabel}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
          isSelected
            ? 'bg-[#1E252B] text-white'
            : 'border border-gray-200 text-gray-400 hover:text-gray-900'
        }`}
      >
        {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
    </div>
  );
}
