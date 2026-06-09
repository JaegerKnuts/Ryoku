const SAVED_POSTS_KEY = "ryoku-saved-posts";
const WISHLIST_KEY = "ryoku-wishlist";

function readJsonArray(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeJsonArray(key: string, value: string[]) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function isPostSaved(slug: string) {
  return readJsonArray(SAVED_POSTS_KEY).includes(slug);
}

export function toggleSavedPost(slug: string) {
  const saved = readJsonArray(SAVED_POSTS_KEY);
  const exists = saved.includes(slug);
  const next = exists ? saved.filter((s) => s !== slug) : [...saved, slug];
  writeJsonArray(SAVED_POSTS_KEY, next);
  return !exists;
}

export function isInWishlist(productId: number) {
  return readJsonArray(WISHLIST_KEY).includes(String(productId));
}

export function toggleWishlist(productId: number) {
  const id = String(productId);
  const list = readJsonArray(WISHLIST_KEY);
  const exists = list.includes(id);
  const next = exists ? list.filter((item) => item !== id) : [...list, id];
  writeJsonArray(WISHLIST_KEY, next);
  return !exists;
}
