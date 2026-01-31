import React, { useState, useEffect, useMemo } from 'react';
import { Skin, SyncProgress, FilterState } from './types';
import { Gw2Api } from './services/gw2Api';
import { SkinDB } from './services/db';
import { SkinCard } from './components/SkinCard';
import { LoadingOverlay } from './components/LoadingOverlay';
import { Filters } from './components/Filters';
import { RandomSkinModal } from './components/RandomSkinModal';
import { Key, Shuffle, RefreshCw, Trophy, AlertCircle } from 'lucide-react';

const API_KEY_STORAGE = 'gw2_api_key';
const UNLOCKED_IDS_STORAGE = 'gw2_unlocked_ids';

const App: React.FC = () => {
  const [allSkins, setAllSkins] = useState<Skin[]>([]);
  
  // Initialize from local storage if available
  const [unlockedIds, setUnlockedIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem(UNLOCKED_IDS_STORAGE);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      console.warn("Failed to parse saved unlocked IDs", e);
      return new Set();
    }
  });

  const [apiKey, setApiKey] = useState<string>(localStorage.getItem(API_KEY_STORAGE) || '');
  const [loadingMsg, setLoadingMsg] = useState<string>('');
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [filter, setFilter] = useState<FilterState>({
    search: '',
    type: 'All',
    rarity: 'All',
    show: 'All'
  });

  // Random Modal State
  const [randomSkin, setRandomSkin] = useState<Skin | null>(null);
  const [isRandomOpen, setIsRandomOpen] = useState(false);

  // Initial Data Load
  useEffect(() => {
    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeData = async () => {
    try {
      // 1. Load cached skins
      // Only show loading if we really have nothing
      if (allSkins.length === 0) setLoadingMsg('Checking cache...');
      
      const cachedSkins = await SkinDB.getAll();
      setAllSkins(cachedSkins);

      // 2. Sync if cache is empty or stale
      // We check for new skins in the background if we already have some skins
      const hasSkins = cachedSkins.length > 0;
      if (!hasSkins) setLoadingMsg('Fetching skin list...');

      const allIds = await Gw2Api.fetchAllSkinIds();
      const cachedIdsSet = new Set(cachedSkins.map(s => s.id));
      const missingIds = allIds.filter(id => !cachedIdsSet.has(id));

      if (missingIds.length > 0) {
        // If we have no skins, we need to block UI. If we have skins, we can sync in background (optional, but let's be explicit for now)
        if (!hasSkins) setLoadingMsg('Downloading skin database...');
        await syncSkins(missingIds, cachedSkins);
      } else {
        setLoadingMsg('');
      }

      // 3. Load account data if key exists
      if (apiKey) {
        // If we already have unlockedIds from localStorage, don't block the UI with a loader
        // just update in background.
        const showLoader = unlockedIds.size === 0;
        await refreshAccount(apiKey, showLoader);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to initialize. Check your connection.');
      setLoadingMsg('');
    }
  };

  const syncSkins = async (missingIds: number[], currentSkins: Skin[]) => {
    const BATCH_SIZE = 150;
    const total = missingIds.length;
    let processed = 0;
    const newSkins: Skin[] = [];

    setSyncProgress({ current: 0, total, phase: 'Downloading skin details' });

    // Process in batches
    for (let i = 0; i < total; i += BATCH_SIZE) {
      const batchIds = missingIds.slice(i, i + BATCH_SIZE);
      try {
        const skinsDetails = await Gw2Api.fetchSkinsDetails(batchIds);
        const validSkins = skinsDetails.filter(s => s && s.name);
        newSkins.push(...validSkins);
        
        await SkinDB.addBulk(validSkins);
        
        processed += batchIds.length;
        setSyncProgress({ 
          current: Math.min(processed, total), 
          total, 
          phase: 'Downloading skin details' 
        });
      } catch (err) {
        console.error('Batch failed', err);
      }
    }

    setAllSkins([...currentSkins, ...newSkins]);
    setSyncProgress(null);
    setLoadingMsg('');
  };

  const refreshAccount = async (key: string, showLoader: boolean = true) => {
    if (!key) return;
    if (showLoader) setLoadingMsg('Syncing account unlocks...');
    
    // Clear previous error when starting a new fetch
    setError(null);
    
    try {
      const ids = await Gw2Api.fetchAccountSkins(key);
      setUnlockedIds(new Set(ids));
      
      // Persist to storage
      localStorage.setItem(API_KEY_STORAGE, key);
      localStorage.setItem(UNLOCKED_IDS_STORAGE, JSON.stringify(ids));
    } catch (err: any) {
      console.error("Account sync error:", err);
      
      // If we have valid data in memory/storage, don't wipe it on network error.
      // Only show error.
      const isAuthError = err.message && (err.message.includes('Invalid API Key') || err.message.includes('permissions'));
      
      if (isAuthError) {
        setError('Invalid API Key or permissions. Please check your key.');
        // Optionally clear data if key is definitely wrong
        // setUnlockedIds(new Set()); 
      } else {
        setError('Could not sync latest account data. Showing cached unlocks.');
      }
    } finally {
      setLoadingMsg('');
    }
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Force loader on manual submit
    await refreshAccount(apiKey, true);
  };

  // Filter Logic
  const filteredSkins = useMemo(() => {
    return allSkins.filter(skin => {
      // Search
      if (filter.search && !skin.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
      
      // Type
      if (filter.type !== 'All' && skin.type !== filter.type) return false;
      
      // Rarity
      if (filter.rarity !== 'All' && skin.rarity !== filter.rarity) return false;

      // Unlocked State
      const isUnlocked = unlockedIds.has(skin.id);
      if (filter.show === 'Locked' && isUnlocked) return false;
      if (filter.show === 'Unlocked' && !isUnlocked) return false;

      return true;
    });
  }, [allSkins, filter, unlockedIds]);

  // Paginated display for performance
  const [displayLimit, setDisplayLimit] = useState(48);
  const displayedSkins = filteredSkins.slice(0, displayLimit);

  // Infinite Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        setDisplayLimit(prev => Math.min(prev + 48, filteredSkins.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredSkins.length]);

  // Reset display limit when filter changes
  useEffect(() => {
    setDisplayLimit(48);
  }, [filter]);

  const handleRandomLocked = () => {
    const lockedSkins = allSkins.filter(s => !unlockedIds.has(s.id) && s.name && s.icon);
    if (lockedSkins.length === 0) {
      alert("You have unlocked all skins! (Or data hasn't loaded)");
      return;
    }
    const random = lockedSkins[Math.floor(Math.random() * lockedSkins.length)];
    setRandomSkin(random);
    setIsRandomOpen(true);
  };

  return (
    <div className="min-h-screen bg-gw2-dark text-gray-200 font-sans pb-20">
      <LoadingOverlay progress={syncProgress} message={loadingMsg} />
      
      <RandomSkinModal 
        skin={randomSkin} 
        isOpen={isRandomOpen} 
        onClose={() => setIsRandomOpen(false)}
        onReroll={handleRandomLocked}
      />

      {/* Header */}
      <header className="bg-gw2-panel border-b border-gw2-gold/20 pt-6 pb-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gw2-accent rounded-lg flex items-center justify-center shadow-lg shadow-red-900/50">
                <Trophy className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">GW2 <span className="text-gw2-gold">Skin Explorer</span></h1>
                <p className="text-gray-400 text-sm">Track your wardrobe & discover new looks</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
                <form onSubmit={handleApiKeySubmit} className="flex gap-2">
                    <div className="relative flex-1 md:w-80">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input 
                        type="password" 
                        value={apiKey}
                        onChange={handleApiKeyChange}
                        placeholder="Paste API Key (account, unlocks)"
                        className="w-full bg-black/30 border border-gray-600 rounded px-3 py-2 pl-9 text-sm focus:border-gw2-gold focus:outline-none transition-colors"
                    />
                    </div>
                    <button 
                        type="submit"
                        className="bg-gw2-panel hover:bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-all"
                        title="Sync Account"
                    >
                        <RefreshCw size={18} className={loadingMsg.includes('Syncing account') ? 'animate-spin' : ''} />
                    </button>
                </form>
                {error && <div className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12}/> {error}</div>}
                {unlockedIds.size > 0 && !error && (
                    <div className="text-green-400 text-xs text-right">
                        Unlocked: {unlockedIds.size.toLocaleString()} skins
                    </div>
                )}
                {unlockedIds.size > 0 && error && (
                    <div className="text-yellow-500 text-xs text-right">
                        Showing cached: {unlockedIds.size.toLocaleString()} skins
                    </div>
                )}
            </div>
          </div>
        </div>
      </header>

      <Filters 
        filter={filter} 
        setFilter={setFilter} 
        totalCount={allSkins.length} 
        shownCount={filteredSkins.length}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {allSkins.length === 0 && !loadingMsg ? (
            <div className="text-center py-20 opacity-50">
                <p>No skins loaded. Something went wrong.</p>
                <button onClick={() => window.location.reload()} className="underline mt-4">Reload</button>
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {displayedSkins.map(skin => (
                <SkinCard 
                key={skin.id} 
                skin={skin} 
                isUnlocked={unlockedIds.has(skin.id)} 
                />
            ))}
            </div>
        )}
        
        {displayedSkins.length < filteredSkins.length && (
           <div className="text-center py-8 text-gray-500 animate-pulse">
             Loading more skins...
           </div>
        )}
      </main>

      {/* Floating Action Button for Random Skin */}
      <button 
        onClick={handleRandomLocked}
        className="fixed bottom-8 right-8 bg-gw2-accent hover:bg-red-700 text-white p-4 rounded-full shadow-lg shadow-red-900/40 transition-transform hover:scale-110 active:scale-95 group z-30"
        title="Find Random Locked Skin"
      >
        <Shuffle size={32} className="group-hover:rotate-180 transition-transform duration-500" />
      </button>

    </div>
  );
};

export default App;