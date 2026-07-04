import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { DEFAULT_SETTINGS, type UserSettings } from '@/types/settings';

export interface FavoriteRecord {
  id: string;
  addedAt: number;
}

export interface HistoryRecord {
  /** Autoinkrementowany klucz wpisu w historii (kolejność wyświetleń). */
  entryId?: number;
  factId: string;
  viewedAt: number;
}

/** Klucze przechowywane w prostym magazynie klucz-wartość. */
export interface KVStore {
  settings: UserSettings;
  /** Id-ki już pokazane w bieżącym cyklu losowania (patrz services/randomEngine.ts). */
  shuffleSeenIds: string[];
  /** Id ostatnio wyświetlonej ciekawostki (do przywrócenia po restarcie). */
  lastFactId: string;
  /** Wszystkie unikalne id ciekawostek, jakie użytkownik kiedykolwiek zobaczył. */
  seenEverIds: string[];
}

interface CiekawostkiDB extends DBSchema {
  favorites: {
    key: string;
    value: FavoriteRecord;
  };
  history: {
    key: number;
    value: HistoryRecord;
    indexes: { byViewedAt: number };
  };
  kv: {
    key: string;
    value: unknown;
  };
}

const DB_NAME = 'ciekawostki-db';
const DB_VERSION = 1;
const HISTORY_LIMIT = 20;

let dbPromise: Promise<IDBPDatabase<CiekawostkiDB>> | null = null;

function getDb(): Promise<IDBPDatabase<CiekawostkiDB>> {
  if (!dbPromise) {
    dbPromise = openDB<CiekawostkiDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('favorites')) {
          db.createObjectStore('favorites', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('history')) {
          const store = db.createObjectStore('history', {
            keyPath: 'entryId',
            autoIncrement: true,
          });
          store.createIndex('byViewedAt', 'viewedAt');
        }
        if (!db.objectStoreNames.contains('kv')) {
          db.createObjectStore('kv');
        }
      },
    });
  }
  return dbPromise;
}

async function kvGet<K extends keyof KVStore>(key: K): Promise<KVStore[K] | undefined> {
  const db = await getDb();
  return (await db.get('kv', key)) as KVStore[K] | undefined;
}

async function kvSet<K extends keyof KVStore>(key: K, value: KVStore[K]): Promise<void> {
  const db = await getDb();
  await db.put('kv', value, key);
}

// ---------------------------------------------------------------------------
// Ustawienia
// ---------------------------------------------------------------------------

export async function loadSettings(): Promise<UserSettings> {
  const stored = await kvGet('settings');
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await kvSet('settings', settings);
}

// ---------------------------------------------------------------------------
// Ulubione
// ---------------------------------------------------------------------------

export async function getFavoriteIds(): Promise<string[]> {
  const db = await getDb();
  const all = await db.getAll('favorites');
  return all.sort((a, b) => b.addedAt - a.addedAt).map((f) => f.id);
}

export async function addFavorite(factId: string): Promise<void> {
  const db = await getDb();
  await db.put('favorites', { id: factId, addedAt: Date.now() });
}

export async function removeFavorite(factId: string): Promise<void> {
  const db = await getDb();
  await db.delete('favorites', factId);
}

export async function isFavorite(factId: string): Promise<boolean> {
  const db = await getDb();
  return (await db.get('favorites', factId)) !== undefined;
}

// ---------------------------------------------------------------------------
// Historia (ostatnie 20 wyświetleń)
// ---------------------------------------------------------------------------

export async function pushHistory(factId: string): Promise<void> {
  const db = await getDb();
  const tx = db.transaction('history', 'readwrite');
  const store = tx.store;

  // Usuń wcześniejsze wpisy tej samej ciekawostki, żeby historia nigdy nie
  // pokazywała duplikatów — ponowne obejrzenie po prostu przenosi ją na górę.
  const existing = await store.getAll();
  const duplicateKeys = existing
    .filter((entry) => entry.factId === factId)
    .map((entry) => entry.entryId as number);
  await Promise.all(duplicateKeys.map((key) => store.delete(key)));

  await store.add({ factId, viewedAt: Date.now() });

  const allKeys = await store.index('byViewedAt').getAllKeys();
  const excess = allKeys.length - HISTORY_LIMIT;
  if (excess > 0) {
    const keysToDelete = allKeys.slice(0, excess);
    await Promise.all(keysToDelete.map((key) => store.delete(key)));
  }
  await tx.done;
}

export async function getHistory(): Promise<HistoryRecord[]> {
  const db = await getDb();
  const all = await db.getAllFromIndex('history', 'byViewedAt');
  return all.reverse();
}

// ---------------------------------------------------------------------------
// Stan losowania (bez powtórzeń w cyklu) i licznik odkrytych ciekawostek
// ---------------------------------------------------------------------------

export async function getShuffleSeenIds(): Promise<Set<string>> {
  const stored = await kvGet('shuffleSeenIds');
  return new Set(stored ?? []);
}

export async function saveShuffleSeenIds(ids: Set<string>): Promise<void> {
  await kvSet('shuffleSeenIds', Array.from(ids));
}

export async function getLastFactId(): Promise<string | undefined> {
  return kvGet('lastFactId');
}

export async function saveLastFactId(factId: string): Promise<void> {
  await kvSet('lastFactId', factId);
}

export async function getSeenEverIds(): Promise<Set<string>> {
  const stored = await kvGet('seenEverIds');
  return new Set(stored ?? []);
}

export async function markSeen(factId: string): Promise<Set<string>> {
  const seen = await getSeenEverIds();
  seen.add(factId);
  await kvSet('seenEverIds', Array.from(seen));
  return seen;
}
