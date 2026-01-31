import React from 'react';
import { Skin } from '../types';
import { X, ExternalLink, Dna } from 'lucide-react';
import { wikiLink, RarityColors, RarityBg, RarityShadow } from '../utils';

interface RandomSkinModalProps {
  skin: Skin | null;
  isOpen: boolean;
  onClose: () => void;
  onReroll: () => void;
}

export const RandomSkinModal: React.FC<RandomSkinModalProps> = ({ skin, isOpen, onClose, onReroll }) => {
  if (!isOpen || !skin) return null;

  const rarityColor = RarityColors[skin.rarity] || 'border-gray-600 text-gray-400';
  const rarityBg = RarityBg[skin.rarity] || 'bg-gray-800';
  const rarityShadow = RarityShadow[skin.rarity] || 'shadow-gray-900/50';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border ${rarityColor} ${rarityBg}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`p-4 flex justify-between items-center border-b ${rarityColor}`}>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Dna className={rarityColor.split(' ').find(c => c.startsWith('text-'))} /> Random Locked Skin
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center text-center">
            <div className={`w-32 h-32 rounded-lg border-2 shadow-lg mb-6 overflow-hidden bg-black ${rarityColor} ${rarityShadow}`}>
               {skin.icon && <img src={skin.icon} alt={skin.name} className="w-full h-full object-cover" />}
            </div>

            <h3 className={`text-2xl font-bold mb-1 ${rarityColor.split(' ').find(c => c.startsWith('text-'))}`}>{skin.name}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border mb-4 ${rarityColor} ${rarityBg}`}>
                {skin.rarity} {skin.type}
            </span>

            {skin.description && (
                <p className="text-gray-400 italic mb-6 text-sm max-w-xs">{skin.description}</p>
            )}

            <div className="flex gap-3 w-full">
                 <button
                    onClick={onReroll}
                    className="flex-1 bg-gw2-dark hover:bg-gray-800 text-white font-bold py-3 px-4 rounded border border-gray-600 transition-colors"
                >
                    Reroll
                </button>
                <a
                    href={wikiLink(skin.name)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-gw2-accent hover:bg-red-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-900/20"
                >
                    View on Wiki <ExternalLink size={18} />
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};
