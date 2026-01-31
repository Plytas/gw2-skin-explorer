import React from 'react';
import { Skin } from '../types';
import { ExternalLink, Lock, Unlock } from 'lucide-react';
import { wikiLink } from '../utils';

interface SkinCardProps {
  skin: Skin;
  isUnlocked: boolean;
  onClick?: () => void;
}

const RarityColors: Record<string, string> = {
  Junk: 'border-gray-600 text-gray-400',
  Basic: 'border-white text-white',
  Fine: 'border-blue-400 text-blue-400',
  Masterwork: 'border-green-500 text-green-500',
  Rare: 'border-yellow-400 text-yellow-400',
  Exotic: 'border-orange-500 text-orange-500',
  Ascended: 'border-pink-500 text-pink-500',
  Legendary: 'border-purple-600 text-purple-600',
};

const RarityBg: Record<string, string> = {
  Junk: 'bg-gray-800',
  Basic: 'bg-gray-800',
  Fine: 'bg-blue-900/20',
  Masterwork: 'bg-green-900/20',
  Rare: 'bg-yellow-900/20',
  Exotic: 'bg-orange-900/20',
  Ascended: 'bg-pink-900/20',
  Legendary: 'bg-purple-900/20',
};

export const SkinCard: React.FC<SkinCardProps> = ({ skin, isUnlocked, onClick }) => {
  const rarityClass = RarityColors[skin.rarity] || 'border-gray-600 text-gray-400';
  const bgClass = RarityBg[skin.rarity] || 'bg-gray-800';

  return (
    <div 
      className={`relative group rounded-lg border p-3 flex flex-col gap-2 transition-all hover:shadow-lg hover:scale-[1.02] ${rarityClass} ${bgClass} ${!isUnlocked ? 'opacity-75 grayscale hover:grayscale-0' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div className="relative w-12 h-12 bg-black rounded overflow-hidden flex-shrink-0 border border-current">
            {skin.icon ? (
              <img src={skin.icon} alt={skin.name} className="w-full h-full object-cover" loading="lazy" />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Icon</div>
            )}
        </div>
        <div className="text-right">
           {isUnlocked ? <Unlock size={16} className="text-green-400" /> : <Lock size={16} className="text-gray-500" />}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm truncate" title={skin.name}>{skin.name}</h3>
        <p className="text-xs opacity-80">{skin.rarity} {skin.type}</p>
      </div>

      <div className="flex gap-2 mt-1">
        <a 
          href={wikiLink(skin.name)}
          target="_blank" 
          rel="noreferrer"
          className="text-xs flex items-center gap-1 hover:underline opacity-60 hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          Wiki <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
};
