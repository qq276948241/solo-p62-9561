import { useState, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'pet-favorites';

function loadFavorites(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const arr: number[] = JSON.parse(raw);
      return new Set(arr);
    }
  } catch {
    // ignore parse errors
  }
  return new Set();
}

function persistFavorites(favs: Set<number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favs]));
  } catch {
    // ignore write errors
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(() => loadFavorites());

  const isFavorite = useCallback(
    (petId: number) => favorites.has(petId),
    [favorites],
  );

  const addFavorite = useCallback((petId: number) => {
    setFavorites((prev) => {
      if (prev.has(petId)) return prev;
      const next = new Set(prev);
      next.add(petId);
      persistFavorites(next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((petId: number) => {
    setFavorites((prev) => {
      if (!prev.has(petId)) return prev;
      const next = new Set(prev);
      next.delete(petId);
      persistFavorites(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((petId: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(petId)) {
        next.delete(petId);
      } else {
        next.add(petId);
      }
      persistFavorites(next);
      return next;
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites(new Set());
    persistFavorites(new Set());
  }, []);

  const favoritesCount = useMemo(() => favorites.size, [favorites]);

  const favoriteIds = useMemo(() => [...favorites], [favorites]);

  return {
    favorites,
    favoriteIds,
    favoritesCount,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
  };
}
