export function wikiLink(name: string) {
  const encoded = encodeURIComponent(name);

  return `https://wiki.guildwars2.com/index.php?title=Special%3ASearch&search=${encoded}&go=Go`;
}
