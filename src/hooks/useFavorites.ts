import { useLocalStorage } from './useLocalStorage';

export interface Favorite<T> {
  id: string;
  name: string;
  createdAt: number;
  data: T;
}

export function useFavorites<T>(key: string) {
  const [favorites, setFavorites] = useLocalStorage<Favorite<T>[]>(`favorites-${key}`, []);

  const addFavorite = (name: string, data: T) => {
    const newFavorite: Favorite<T> = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      createdAt: Date.now(),
      data
    };
    setFavorites([newFavorite, ...favorites]);
    return newFavorite;
  };

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(f => f.id !== id));
  };

  const updateFavorite = (id: string, name: string, data: T) => {
    setFavorites(favorites.map(f =>
      f.id === id ? { ...f, name, data } : f
    ));
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    updateFavorite
  };
}
