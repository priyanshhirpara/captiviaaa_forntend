import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import type { UseSaveReturn } from '../types/saveTypes';


// Constants
const STORAGE_KEYS = {
  SAVED_POSTS: 'savedPosts',
};

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const accessToken = Cookies.get('access_token');
// API functions
const addToSavesAPI = async (postId: string): Promise<void> => {
  await axios.post(`${API_BASE_URL}/saves/?post_id=${postId}`, {}, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const removeFromSavesAPI = async (postId: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/saves/?post_id=${postId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const useSave = (): UseSaveReturn => {
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>(() => {
    const savedSaves = localStorage.getItem(STORAGE_KEYS.SAVED_POSTS);
    return savedSaves ? JSON.parse(savedSaves) : {};
  });

  const addToSaves = async (postId: string): Promise<boolean> => {
    if (!accessToken) {
      console.error('No access token found. Please log in.');
      return false;
    }

    try {
      await addToSavesAPI(postId);

      setSavedPosts((prev) => {
        const newState = {
          ...prev,
          [postId]: true,
        };
        localStorage.setItem(STORAGE_KEYS.SAVED_POSTS, JSON.stringify(newState));
        return newState;
      });

      console.log('Successfully added to saves');
      return true;
    } catch (error) {
      console.error('Error adding to saves:', error);
      return false;
    }
  };

  const removeFromSaves = async (postId: string): Promise<boolean> => {
    if (!accessToken) {
      console.error('No access token found. Please log in.');
      return false;
    }

    try {
      await removeFromSavesAPI(postId);

      setSavedPosts((prev) => {
        const newState = {
          ...prev,
          [postId]: false,
        };
        localStorage.setItem(STORAGE_KEYS.SAVED_POSTS, JSON.stringify(newState));
        return newState;
      });

      console.log('Successfully removed from saves');
      return true;
    } catch (error) {
      console.error('Error removing from saves:', error);
      return false;
    }
  };

  const toggleSave = async (postId: string): Promise<boolean> => {
    const isCurrentlySaved = savedPosts[postId];

    if (isCurrentlySaved) {
      return await removeFromSaves(postId);
    } else {
      return await addToSaves(postId);
    }
  };

  const isSaved = (postId: string): boolean => {
    return savedPosts[postId] || false;
  };

  return {
    savedPosts,
    isSaved,
    toggleSave,
    addToSaves,
    removeFromSaves,
  };
};
