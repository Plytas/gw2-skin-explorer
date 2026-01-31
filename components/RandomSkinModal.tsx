import React from 'react';
import { Skin } from '../types';
import { X, ExternalLink, Dna } from 'lucide-react';
import { wikiLink } from '../utils';

interface RandomSkinModalProps {
  skin: Skin | null;
  isOpen: boolean;
  onClose: () => void;
  onReroll: () => void;
}

export const RandomSkinModal: React.FC<RandomSkinModalProps> = ({ skin, isOpen, onClose, onReroll }) => {
  if (!isOpen || !skin) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gw2-panel border border-gw2-accent w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-red-900 to-gw2-panel p-4 flex justify-between items-center border-b border-red-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Dna className="text-gw2-accent" /> Random Locked Skin
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center text-center">
            <div className={`w-32 h-32 rounded-lg border-2 shadow-lg mb-6 overflow-hidden bg-black ${
                skin.rarity === 'Legendary' ? 'border-purple-500 shadow-purple-900/50' :
                skin.rarity === 'Ascended' ? 'border-pink-500 shadow-pink-900/50' :
                skin.rarity === 'Exotic' ? 'border-orange-500 shadow-orange-900/50' :
                'border-gray-500'
            }`}>
               {skin.icon && <img src={skin.icon} alt={skin.name} className="w-full h-full object-cover" />}
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">{skin.name}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border mb-4 ${
                skin.rarity === 'Legendary' ? 'bg-purple-900/30 border-purple-500 text-purple-300' :
                skin.rarity === 'Ascended' ? 'bg-pink-900/30 border-pink-500 text-pink-300' :
                skin.rarity === 'Exotic' ? 'bg-orange-900/30 border-orange-500 text-orange-300' :
                skin.rarity === 'Rare' ? 'bg-yellow-900/30 border-yellow-500 text-yellow-300' :
                'bg-gray-800 border-gray-600 text-gray-400'
            }`}>
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
