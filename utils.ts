export const RarityColors: Record<string, string> = {
  Junk: 'border-gray-600 text-gray-400',
  Basic: 'border-white text-white',
  Fine: 'border-blue-400 text-blue-400',
  Masterwork: 'border-green-500 text-green-500',
  Rare: 'border-yellow-400 text-yellow-400',
  Exotic: 'border-orange-500 text-orange-500',
  Ascended: 'border-pink-500 text-pink-500',
  Legendary: 'border-purple-600 text-purple-600',
};

export const RarityBg: Record<string, string> = {
  Junk: 'bg-gray-800',
  Basic: 'bg-gray-800',
  Fine: 'bg-blue-900/20',
  Masterwork: 'bg-green-900/20',
  Rare: 'bg-yellow-900/20',
  Exotic: 'bg-orange-900/20',
  Ascended: 'bg-pink-900/20',
  Legendary: 'bg-purple-900/20',
};

export const RarityShadow: Record<string, string> = {
  Junk: 'shadow-gray-900/50',
  Basic: 'shadow-gray-900/50',
  Fine: 'shadow-blue-900/50',
  Masterwork: 'shadow-green-900/50',
  Rare: 'shadow-yellow-900/50',
  Exotic: 'shadow-orange-900/50',
  Ascended: 'shadow-pink-900/50',
  Legendary: 'shadow-purple-900/50',
};

export function wikiLink(name: string) {
  const encoded = encodeURIComponent(name);

  return `https://wiki.guildwars2.com/index.php?title=Special%3ASearch&search=${encoded}&go=Go`;
}
