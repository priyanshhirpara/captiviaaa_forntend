import { useState, useEffect } from 'react';
import { apiClient, API_ENDPOINTS, isAuthenticated, handleError } from './apiClient';

// Types
export interface UseFavoritesReturn {
  favoritePosts: Record<string, boolean>;
  addToFavorites: (postId: string) => Promise<boolean>;
  removeFromFavorites: (postId: string) => Promise<boolean>;
  toggleFavorite: (postId: string) => Promise<boolean>;
  isFavorite: (postId: string) => boolean;
}

// Constants
const STORAGE_KEYS = {
  FAVORITE_POSTS: 'favoritePosts',
};

// API functions
const addToFavoritesAPI = async (postId: string): Promise<void> => {
  await apiClient.post(`/post/${postId}/favorite/`);
};

const removeFromFavoritesAPI = async (postId: string): Promise<void> => {
  await apiClient.delete(`/post/${postId}/favorite/`);
};

export const useFavorites = (): UseFavoritesReturn => {
  const [favoritePosts, setFavoritePosts] = useState<Record<string, boolean>>(() => {
    const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITE_POSTS);
    return savedFavorites ? JSON.parse(savedFavorites) : {};
  });

  const addToFavorites = async (postId: string): Promise<boolean> => {
    if (!isAuthenticated()) {
      console.error('No access token found. Please log in.');
      return false;
    }

    try {
      await addToFavoritesAPI(postId);
      
      setFavoritePosts((prev) => {
        const newState = {
          ...prev,
          [postId]: true,
        };
        localStorage.setItem(STORAGE_KEYS.FAVORITE_POSTS, JSON.stringify(newState));
        return newState;
      });
      
      console.log('Successfully added to favorites');
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      const errorMessage = handleError(error);
      console.error(errorMessage);
      return false;
    }
  };

  const removeFromFavorites = async (postId: string): Promise<boolean> => {
    if (!isAuthenticated()) {
      console.error('No access token found. Please log in.');
      return false;
    }

    try {
      await removeFromFavoritesAPI(postId);
      
      setFavoritePosts((prev) => {
        const newState = {
          ...prev,
          [postId]: false,
        };
        localStorage.setItem(STORAGE_KEYS.FAVORITE_POSTS, JSON.stringify(newState));
        return newState;
      });
      
      console.log('Successfully removed from favorites');
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      const errorMessage = handleError(error);
      console.error(errorMessage);
      return false;
    }
  };

  const toggleFavorite = async (postId: string): Promise<boolean> => {
    const isCurrentlyFavorite = favoritePosts[postId];

    if (isCurrentlyFavorite) {
      return await removeFromFavorites(postId);
    } else {
      return await addToFavorites(postId);
    }
  };

  const isFavorite = (postId: string): boolean => {
    return favoritePosts[postId] || false;
  };

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITE_POSTS);
    if (savedFavorites) {
      setFavoritePosts(JSON.parse(savedFavorites));
    }
  }, []);

  return {
    favoritePosts,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
  };
};
