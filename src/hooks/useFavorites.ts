"use client";

import { useCallback, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSession } from "@/provider/SessionProvider";

/**
 * Hook for managing user favorites.
 *
 * Production hardening:
 * - toggleFavorite catches network/server errors and returns null
 * - isLoading state prevents flash of empty state
 * - All Convex calls gated behind authentication check
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
      try {
        return await toggleMutation({ componentName });
      } catch {
        // Network error / server error — silently fail
        // The UI will stay in its current state and retry on next click
        console.warn(`[useFavorites] Failed to toggle "${componentName}"`);
        return null;
      }
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
