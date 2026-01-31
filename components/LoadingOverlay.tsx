import React from 'react';
import { SyncProgress } from '../types';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  progress: SyncProgress | null;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ progress, message }) => {
  if (!progress && !message) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-gw2-panel border border-gw2-gold/30 p-8 rounded-xl max-w-md w-full shadow-2xl text-center">
        <Loader2 className="w-12 h-12 text-gw2-gold animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Synchronizing GW2 Data</h2>
        
        {message && <p className="text-gray-300 mb-4">{message}</p>}

        {progress && (
          <div className="w-full space-y-2">
             <div className="flex justify-between text-sm text-gray-400">
               <span>{progress.phase}</span>
               <span>{Math.round((progress.current / progress.total) * 100)}%</span>
             </div>
             <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gw2-gold h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
             </div>
             <p className="text-xs text-gray-500 mt-2">
               Fetching {progress.current} of {progress.total} items...
               <br/>
               This only happens once or when new skins are added.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};
