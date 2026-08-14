import { useState, useEffect, useCallback } from 'react';

export interface CrudItem {
  id: string;
}

/**
 * Generic localStorage-backed CRUD hook.
 * Data persists across page refreshes so created/edited/deleted
 * records behave like a real database during the demo.
 */
export function useCrud<T extends CrudItem>(storageKey: string, initialData: T[]) {
  const [items, setItems] = useState<T[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed as T[];
      }
    } catch {
      // corrupted / unavailable storage -> fall back to seed data
    }
    return initialData;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // storage full or unavailable -> keep in-memory state
    }
  }, [items, storageKey]);

  const create = useCallback((data: T) => {
    setItems((prev) => [data, ...prev]);
  }, []);

  const update = useCallback((id: string, data: Partial<T>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...data } : item)));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { items, setItems, create, update, remove };
}