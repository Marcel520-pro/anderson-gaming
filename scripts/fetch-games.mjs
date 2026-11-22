// Génère src/assets/games.json à partir de data/games-list.json et de l'API RAWG.
// Usage : RAWG_API_KEY=xxxx node scripts/fetch-games.mjs   (Node 18+)
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const KEY = process.env.RAWG_API_KEY;
if (!KEY) {
  console.error('RAWG_API_KEY manquante.');
  process.exit(1);
}

const LIST_PATH = 'data/games-list.json';
const OUT_PATH = 'src/assets/games.json';
const API = 'https://api.rawg.io/api';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function rawg(path, params = {}) {
  const url = new URL(API + path);
  url.searchParams.set('key', KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG ${res.status} sur ${path}`);
  return res.json();
}

async function loadPrevious() {
  try {
    return JSON.parse(await readFile(OUT_PATH, 'utf8'));
  } catch {
    return [];
  }
}

async function buildGame(item) {
  const search = await rawg('/games', { search: item.query, search_precise: 'true', page_size: 1 });
  const hit = search.results?.[0];
  if (!hit) throw new Error('aucun résultat');

  const [detail, storeLinks] = await Promise.all([
    rawg(`/games/${hit.id}`),
    rawg(`/games/${hit.id}/stores`),
  ]);

  const storeNames = new Map((detail.stores ?? []).map((s) => [s.store.id, s.store.name]));
  const stores = (storeLinks.results ?? [])
    .filter((s) => s.url)
    .map((s) => ({ name: storeNames.get(s.store_id) ?? 'Boutique', url: s.url }));

  return {
    id: item.id,
    title: item.title,
    description: (detail.description_raw ?? '').slice(0, 600).trim(),
    image: detail.background_image ?? '',
    genres: (detail.genres ?? []).map((g) => g.name),
    platforms: (detail.platforms ?? []).map((p) => p.platform.name),
    released: detail.released ?? '',
    rating: detail.rating ?? null,
    stores,
    rawgUrl: `https://rawg.io/games/${detail.slug}`,
  };
}

const list = JSON.parse(await readFile(LIST_PATH, 'utf8'));
const previous = new Map((await loadPrevious()).map((g) => [g.id, g]));
const games = [];

for (const item of list) {
  try {
    games.push(await buildGame(item));
    console.log(`OK     ${item.title}`);
  } catch (err) {
    console.warn(`ECHEC  ${item.title} : ${err.message}`);
    if (previous.has(item.id)) games.push(previous.get(item.id)); // on garde l'ancienne entrée
  }
  await sleep(300); // reste poli avec l'API
}

await mkdir(dirname(OUT_PATH), { recursive: true });
await writeFile(OUT_PATH, JSON.stringify(games, null, 2) + '\n');
console.log(`\n${games.length}/${list.length} jeux écrits dans ${OUT_PATH}`);
