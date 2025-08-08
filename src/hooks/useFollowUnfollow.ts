import { useState, useCallback } from 'react';
import { apiClient, API_ENDPOINTS, isAuthenticated, handleError } from './apiClient';

// Types
export interface UseFollowUnfollowReturn {
  isFollowing: Record<string, boolean>;
  followUser: (userId: string) => Promise<boolean>;
  unfollowUser: (userId: string) => Promise<boolean>;
  toggleFollow: (userId: string) => Promise<boolean>;
  checkFollowStatus: (userId: string) => boolean;
}


// API functions
const followUserAPI = async (userId: string): Promise<void> => {
  await apiClient.post(`/users/${userId}/follow/`);
};

const unfollowUserAPI = async (userId: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}/follow/`);
};

const getFollowStatusAPI = async (userId: string): Promise<boolean> => {
  const response = await apiClient.get(`/users/${userId}/follow-status/`);
  return (response.data as { is_following: boolean }).is_following || false;
};

export const useFollowUnfollow = (): UseFollowUnfollowReturn => {
  const [isFollowing, setIsFollowing] = useState<Record<string, boolean>>({});

  const followUser = useCallback(async (userId: string): Promise<boolean> => {
    if (!isAuthenticated()) {
      console.error('No access token found. Please log in.');
      return false;
    }

    try {
      await followUserAPI(userId);
      
      setIsFollowing(prev => ({
        ...prev,
        [userId]: true,
      }));
      
      console.log('Successfully followed user');
      return true;
    } catch (error) {
      console.error('Error following user:', error);
      const errorMessage = handleError(error);
      console.error(errorMessage);
      return false;
    }
  }, []);

  const unfollowUser = useCallback(async (userId: string): Promise<boolean> => {
    if (!isAuthenticated()) {
      console.error('No access token found. Please log in.');
      return false;
    }

    try {
      await unfollowUserAPI(userId);
      
      setIsFollowing(prev => ({
        ...prev,
        [userId]: false,
      }));
      
      console.log('Successfully unfollowed user');
      return true;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      const errorMessage = handleError(error);
      console.error(errorMessage);
      return false;
    }
  }, []);

  const toggleFollow = useCallback(async (userId: string): Promise<boolean> => {
    const currentlyFollowing = isFollowing[userId];

    if (currentlyFollowing) {
      return await unfollowUser(userId);
    } else {
      return await followUser(userId);
    }
  }, [isFollowing, followUser, unfollowUser]);

  const checkFollowStatus = useCallback((userId: string): boolean => {
    return isFollowing[userId] || false;
  }, [isFollowing]);

  // Function to fetch follow status for a user
  const fetchFollowStatus = useCallback(async (userId: string): Promise<void> => {
    if (!isAuthenticated()) {
      return;
    }

    try {
      const status = await getFollowStatusAPI(userId);
      setIsFollowing(prev => ({
        ...prev,
        [userId]: status,
      }));
    } catch (error) {
      console.error('Error fetching follow status:', error);
      const errorMessage = handleError(error);
      console.error(errorMessage);
    }
  }, []);

  return {
    isFollowing,
    followUser,
    unfollowUser,
    toggleFollow,
    checkFollowStatus,
  };
};
