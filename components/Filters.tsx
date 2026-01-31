import React from 'react';
import { FilterState } from '../types';
import { Search, Filter, X } from 'lucide-react';

interface FiltersProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
  shownCount: number;
}

export const Filters: React.FC<FiltersProps> = ({ filter, setFilter, totalCount, shownCount }) => {
  const handleChange = (key: keyof FilterState, value: string) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-gw2-panel border-y border-white/10 sticky top-0 z-20 shadow-xl backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search */}
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gw2-gold transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search skins..." 
              value={filter.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full bg-gw2-dark border border-gray-700 rounded-md py-2 pl-10 pr-10 text-white focus:outline-none focus:border-gw2-gold transition-all"
            />
            {filter.search && (
              <button 
                onClick={() => handleChange('search', '')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            
            <select 
              value={filter.show} 
              onChange={(e) => handleChange('show', e.target.value)}
              className="bg-gw2-dark text-white text-sm border border-gray-700 rounded px-3 py-2 focus:border-gw2-gold outline-none cursor-pointer"
            >
              <option value="All">Show All</option>
              <option value="Locked">Locked Only</option>
              <option value="Unlocked">Unlocked Only</option>
            </select>

            <select 
              value={filter.type} 
              onChange={(e) => handleChange('type', e.target.value)}
              className="bg-gw2-dark text-white text-sm border border-gray-700 rounded px-3 py-2 focus:border-gw2-gold outline-none cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Armor">Armor</option>
              <option value="Weapon">Weapon</option>
              <option value="Back">Back Item</option>
              <option value="Gathering">Gathering</option>
            </select>

            <select 
              value={filter.rarity} 
              onChange={(e) => handleChange('rarity', e.target.value)}
              className="bg-gw2-dark text-white text-sm border border-gray-700 rounded px-3 py-2 focus:border-gw2-gold outline-none cursor-pointer"
            >
              <option value="All">All Rarities</option>
              <option value="Basic">Basic</option>
              <option value="Fine">Fine</option>
              <option value="Masterwork">Masterwork</option>
              <option value="Rare">Rare</option>
              <option value="Exotic">Exotic</option>
              <option value="Ascended">Ascended</option>
              <option value="Legendary">Legendary</option>
            </select>
          </div>

          <div className="text-xs text-gray-500 whitespace-nowrap hidden lg:block">
            Showing {shownCount.toLocaleString()} / {totalCount.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
