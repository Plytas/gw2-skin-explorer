import { Skin } from '../types';

const BASE_URL = 'https://api.guildwars2.com/v2';

export const Gw2Api = {
  // Get list of all available skin IDs
  fetchAllSkinIds: async (): Promise<number[]> => {
    const res = await fetch(`${BASE_URL}/skins`);
    if (!res.ok) throw new Error('Failed to fetch skin list');
    return res.json();
  },

  // Fetch details for specific skin IDs
  fetchSkinsDetails: async (ids: number[]): Promise<Skin[]> => {
    // GW2 API usually handles ~200 items per request, but URLs can get too long.
    // 150 is a safe batch size.
    const idsString = ids.join(',');
    const res = await fetch(`${BASE_URL}/skins?ids=${idsString}&lang=en`);
    if (!res.ok) throw new Error('Failed to fetch skin details');
    return res.json();
  },

  // Get unlocked skins for an account
  fetchAccountSkins: async (apiKey: string): Promise<number[]> => {
    // Using query parameter instead of Authorization header to prevent CORS preflight issues
    const res = await fetch(`${BASE_URL}/account/skins?access_token=${apiKey}`);

    if (res.status === 401 || res.status === 403) {
      throw new Error('Invalid API Key or missing permissions');
    }
    if (!res.ok) throw new Error('Failed to fetch account skins');
    return res.json();
  }
};
