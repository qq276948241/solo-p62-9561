import { useState, useCallback, useMemo, useEffect } from 'react';

const STORAGE_KEY = 'pet-favorites';

type Subscriber = () => void;

let favorites: Set<number> = loadFavorites();
const subscribers = new Set<Subscriber>();

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

function updateFavorites(next: Set<number>) {
  favorites = next;
  persistFavorites(next);
  subscribers.forEach((sub) => sub());
}

function useForceRerender() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const subscriber = () => setTick((t) => t + 1);
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
    };
  }, []);
}

export function useFavorites() {
  useForceRerender();

  const isFavorite = useCallback((petId: number) => favorites.has(petId), []);

  const addFavorite = useCallback((petId: number) => {
    if (favorites.has(petId)) return;
    const next = new Set(favorites);
    next.add(petId);
    updateFavorites(next);
  }, []);

  const removeFavorite = useCallback((petId: number) => {
    if (!favorites.has(petId)) return;
    const next = new Set(favorites);
    next.delete(petId);
    updateFavorites(next);
  }, []);

  const toggleFavorite = useCallback((petId: number) => {
    const next = new Set(favorites);
    if (next.has(petId)) {
      next.delete(petId);
    } else {
      next.add(petId);
    }
    updateFavorites(next);
  }, []);

  const clearFavorites = useCallback(() => {
    updateFavorites(new Set());
  }, []);

  const favoritesCount = useMemo(() => favorites.size, [favorites.size]);

  const favoriteIds = useMemo(() => [...favorites], [favorites.size]);

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
