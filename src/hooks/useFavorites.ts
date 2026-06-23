"use client";

import { useCallback, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSession } from "@/provider/SessionProvider";

/**
 * Hook for managing user favorites.
 *
 * Returns:
 * - `favorites`: Array of favorited component names
 * - `isFavorited(name)`: Check if a component is favorited
 * - `toggleFavorite(name)`: Toggle favorite status
 * - `isAuthenticated`: Whether the user is logged in
 */
export function useFavorites() {
  const { session } = useSession();
  const isAuthenticated = !!session;

  const favoritesData = useQuery(
    api.favorites.getUserFavorites,
    isAuthenticated ? {} : "skip",
  );

  const toggleMutation = useMutation(api.favorites.toggleFavorite);

  const favorites = useMemo(
    () => favoritesData?.map((f) => f.componentName) ?? [],
    [favoritesData],
  );

  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

  const isFavorited = useCallback(
    (componentName: string) => favoritesSet.has(componentName),
    [favoritesSet],
  );

  const toggleFavorite = useCallback(
    async (componentName: string) => {
      if (!isAuthenticated) return null;
      return toggleMutation({ componentName });
    },
    [isAuthenticated, toggleMutation],
  );

  return {
    favorites,
    isFavorited,
    toggleFavorite,
    isAuthenticated,
    isLoading: isAuthenticated && favoritesData === undefined,
  };
}
