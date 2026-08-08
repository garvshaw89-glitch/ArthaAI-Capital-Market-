import React from 'react';
import { StockCategory } from '../types';

interface CategoryBarProps {
  selectedCategory: StockCategory;
  onSelectCategory: (category: StockCategory) => void;
}

const categories: StockCategory[] = ['All', 'Stocks', 'MFs', 'Bonds', 'ETFs'];

export const CategoryBar: React.FC<CategoryBarProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)] border border-indigo-400/30'
                : 'bg-[#0F1115] border border-slate-800 text-slate-300 hover:border-indigo-500/40 hover:text-white'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};
