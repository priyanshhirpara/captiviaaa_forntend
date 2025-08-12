import { useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Types
export interface UseFollowUnfollowReturn {
  isFollowing: Record<string, boolean>;
  followersCount: number;
  followingCount: number;
  followUser: (userId: string) => Promise<boolean>;
  unfollowUser: (userId: string) => Promise<boolean>;
  toggleFollow: (userId: string) => Promise<boolean>;
  checkFollowStatus: (userId: string) => boolean;
  fetchFollowerCounts: () => Promise<void>;
  updateFollowerCounts: (increment: boolean) => void;
}

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const accessToken = Cookies.get('access_token');

// API functions
const followUserAPI = async (userId: string): Promise<void> => {
  await axios.post(`${API_BASE_URL}/follow/?user_id=${userId}`, {}, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const unfollowUserAPI = async (userId: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/unfollow/?user_id=${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const useFollowUnfollow = (): UseFollowUnfollowReturn => {
  const [isFollowing, setIsFollowing] = useState<Record<string, boolean>>({});
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const fetchFollowerCounts = useCallback(async (): Promise<void> => {
    if (!accessToken) {
      console.error('No access token found. Please log in.');
      return;
    }

    try {
      // Fetch followers count
      const followersResponse = await axios.get(`${API_BASE_URL}/followers/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (followersResponse.data && Array.isArray(followersResponse.data)) {
        setFollowersCount(followersResponse.data.length);
      }

      // Fetch following count
      const followingResponse = await axios.get(`${API_BASE_URL}/following/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (followingResponse.data && Array.isArray(followingResponse.data)) {
        setFollowingCount(followingResponse.data.length);
      }
    } catch (error) {
      console.error('Error fetching follower counts:', error);
    }
  }, []);

  const updateFollowerCounts = useCallback((increment: boolean): void => {
    if (increment) {
      setFollowersCount(prev => prev + 1);
    } else {
      setFollowersCount(prev => Math.max(0, prev - 1));
    }
  }, []);

  const followUser = useCallback(async (userId: string): Promise<boolean> => {
    if (!accessToken) {
      console.error('No access token found. Please log in.');
      return false;
    }

    try {
      await followUserAPI(userId);

      setIsFollowing(prev => ({
        ...prev,
        [userId]: true,
      }));

      // Update follower count when following someone
      updateFollowerCounts(true);

      console.log('Successfully followed user');
      return true;
    } catch (error) {
      console.error('Error following user:', error);
      return false;
    }
  }, [updateFollowerCounts]);

  const unfollowUser = useCallback(async (userId: string): Promise<boolean> => {
    if (!accessToken) {
      console.error('No access token found. Please log in.');
      return false;
    }

    try {
      await unfollowUserAPI(userId);

      setIsFollowing(prev => ({
        ...prev,
        [userId]: false,
      }));

      // Update follower count when unfollowing someone
      updateFollowerCounts(false);

      console.log('Successfully unfollowed user');
      return true;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return false;
    }
  }, [updateFollowerCounts]);

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

  return {
    isFollowing,
    followersCount,
    followingCount,
    followUser,
    unfollowUser,
    toggleFollow,
    checkFollowStatus,
    fetchFollowerCounts,
    updateFollowerCounts,
  };
};
