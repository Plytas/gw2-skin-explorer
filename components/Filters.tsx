import React from 'react';
import { FilterState } from '../types';
import { Search, ChevronDown, X } from 'lucide-react';

interface FiltersProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
  shownCount: number;
  subTypeOptions: Record<string, string[]>;
  weightClassOptions: string[];
}

const Select: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = ({ value, onChange, children }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="appearance-none bg-gw2-dark text-white text-sm border border-gray-700 rounded pl-3 pr-8 py-2 focus:border-gw2-gold outline-none cursor-pointer"
    >
      {children}
    </select>
    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
  </div>
);

export const Filters: React.FC<FiltersProps> = ({ filter, setFilter, totalCount, shownCount, subTypeOptions, weightClassOptions }) => {
  const handleChange = (key: keyof FilterState, value: string) => {
    const updates: Partial<FilterState> = { [key]: value };
    if (key === 'type') {
      updates.subType = 'All';
      updates.weightClass = 'All';
    }
    setFilter(prev => ({ ...prev, ...updates }));
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

            <Select value={filter.show} onChange={(e) => handleChange('show', e.target.value)}>
              <option value="All">Show All</option>
              <option value="Locked">Locked Only</option>
              <option value="Unlocked">Unlocked Only</option>
            </Select>

            <Select value={filter.type} onChange={(e) => handleChange('type', e.target.value)}>
              <option value="All">All Types</option>
              <option value="Armor">Armor</option>
              <option value="Weapon">Weapon</option>
              <option value="Back">Back Item</option>
              <option value="Gathering">Gathering</option>
            </Select>

            {weightClassOptions.length > 0 && filter.type === 'Armor' && (
              <Select value={filter.weightClass} onChange={(e) => handleChange('weightClass', e.target.value)}>
                <option value="All">All Weights</option>
                {weightClassOptions.map(wc => (
                  <option key={wc} value={wc}>{wc}</option>
                ))}
              </Select>
            )}

            {subTypeOptions[filter.type] && (
              <Select value={filter.subType} onChange={(e) => handleChange('subType', e.target.value)}>
                <option value="All">All {filter.type} Types</option>
                {subTypeOptions[filter.type].map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </Select>
            )}

            <Select value={filter.rarity} onChange={(e) => handleChange('rarity', e.target.value)}>
              <option value="All">All Rarities</option>
              <option value="Basic">Basic</option>
              <option value="Fine">Fine</option>
              <option value="Masterwork">Masterwork</option>
              <option value="Rare">Rare</option>
              <option value="Exotic">Exotic</option>
              <option value="Ascended">Ascended</option>
              <option value="Legendary">Legendary</option>
            </Select>
          </div>

          <div className="text-xs text-gray-500 whitespace-nowrap hidden lg:block">
            Showing {shownCount.toLocaleString()} / {totalCount.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
