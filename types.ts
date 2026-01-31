export interface Skin {
  id: number;
  name: string;
  type: string;
  flags: string[];
  restrictions: string[];
  rarity: string;
  icon?: string;
  description?: string;
  details?: {
    type?: string;
    weight_class?: string;
    damage_type?: string;
  };
}

export type FetchStatus = 'idle' | 'loading' | 'syncing' | 'success' | 'error';

export interface FilterState {
  search: string;
  type: string; // 'All' | 'Weapon' | 'Armor' | 'Back'
  rarity: string; // 'All' | 'Basic' | ...
  show: 'All' | 'Locked' | 'Unlocked';
}

export interface SyncProgress {
  current: number;
  total: number;
  phase: string;
}
