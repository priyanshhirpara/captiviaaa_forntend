import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient, API_ENDPOINTS, isAuthenticated, handleError } from './apiClient';

// Types
export interface Post {
  id: string;
  username: string;
  image_url: string;
  time: string;
  location: string;
  saves: number;
  comments: Comment[];
  user_profile_picture: string;
  caption: string;
  created_by: string;
  likes_count: number;
}

export interface Comment {
  id: string;
  text: string;
  username: string;
  user_profile_picture: string;
  timestamp: string;
}

export interface Like {
  user_id: string;
  username: string;
  profile_picture: string;
  created_at: string;
}

export interface UsePostsReturn {
  posts: Post[];
  likedPosts: Record<string, boolean>;
  savedPosts: Record<string, boolean>;
  likesData: Record<string, Like[]>;
  hasMore: boolean;
  isLoading: boolean;
  fetchMorePosts: () => void;
  handleLike: (postId: string) => Promise<void>;
  handleSave: (postId: string) => Promise<void>;
  fetchLikesData: (postId: string) => Promise<void>;
}

// Constants
const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_SKIP: 0,
  SCROLL_THRESHOLD: 100,
};

const STORAGE_KEYS = {
  LIKED_POSTS: 'likedPosts',
};

const ERROR_MESSAGES = {
  NO_ACCESS_TOKEN: 'No access token found. Please log in.',
};


const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
};

// API functions
const getPosts = async (skip: number, limit: number): Promise<any[]> => {
  const response = await apiClient.get(`/posts/?skip=${skip}&limit=${limit}`);
  return response.data as any[];
};

const getPostLikes = async (postId: string): Promise<any[]> => {
  const response = await apiClient.get(`/post/like/?post_id=${postId}`);
  return response.data as any[];
};

const likePost = async (postId: string): Promise<void> => {
  await apiClient.post(`/post/like/?post_id=${postId}`);
};

const savePost = async (postId: string): Promise<void> => {
  await apiClient.post(`saves/?post_id=${postId}`);
};

export const usePosts = (): UsePostsReturn => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>(() => {
    const savedLikes = localStorage.getItem(STORAGE_KEYS.LIKED_POSTS);
    return savedLikes ? JSON.parse(savedLikes) : {};
  });
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [likesData, setLikesData] = useState<Record<string, Like[]>>({});
  const [skip, setSkip] = useState<number>(PAGINATION.DEFAULT_SKIP);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isLoadingRef = useRef<boolean>(false);

  const fetchPosts = useCallback(async (reset = false): Promise<void> => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);

    if (!isAuthenticated()) {
      console.error(ERROR_MESSAGES.NO_ACCESS_TOKEN);
      setIsLoading(false);
      isLoadingRef.current = false;
      return;
    }

    try {
      const currentSkip = reset ? 0 : skip;
      const apiData = await getPosts(currentSkip, PAGINATION.DEFAULT_LIMIT);

      const transformedPosts: Post[] = apiData.map((post: any) => ({
        id: post.id,
        username: post.username,
        image_url: post.image_url,
        time: formatDate(post.created_at || new Date().toISOString()),
        location: post.location || '',
        saves: post.saves || 0,
        comments: post.comments || [],
        user_profile_picture: post.user_profile_picture,
        caption: post.caption || '',
        created_by: post.created_by,
        likes_count: post.likes_count || 0,
      }));

      setPosts(prev => reset ? transformedPosts : [...prev, ...transformedPosts]);
      setHasMore(apiData.length === PAGINATION.DEFAULT_LIMIT);

      if (!reset) {
        setSkip(prev => prev + PAGINATION.DEFAULT_LIMIT);
      } else {
        setSkip(PAGINATION.DEFAULT_LIMIT);
      }

      // Fetch likes data for new posts
      transformedPosts.forEach(post => {
        fetchLikesData(post.id);
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      const errorMessage = handleError(error);
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [skip]);

  const fetchLikesData = useCallback(async (postId: string): Promise<void> => {
    if (!isAuthenticated()) {
      console.error(ERROR_MESSAGES.NO_ACCESS_TOKEN);
      return;
    }

    try {
      const data = await getPostLikes(postId);
      const transformedData: Like[] = data.map((like: any) => ({
        user_id: like.user_id,
        username: like.username || 'Unknown User',
        profile_picture: like.profile_picture || '/images/default.jpg',
        created_at: like.created_at,
      }));

      setLikesData(prev => ({
        ...prev,
        [postId]: transformedData,
      }));
    } catch (error) {
      console.error('Error fetching likes data:', error);
      const errorMessage = handleError(error);
      console.error(errorMessage);
    }
  }, []);

  const handleLike = useCallback(async (postId: string): Promise<void> => {
    if (!isAuthenticated()) {
      console.error(ERROR_MESSAGES.NO_ACCESS_TOKEN);
      return;
    }

    try {
      await likePost(postId);

      setLikedPosts(prev => {
        const newState = {
          ...prev,
          [postId]: !prev[postId],
        };
        localStorage.setItem(STORAGE_KEYS.LIKED_POSTS, JSON.stringify(newState));
        return newState;
      });

      await fetchLikesData(postId);
    } catch (error) {
      console.error('Error liking post:', error);
      const errorMessage = handleError(error);
      console.error(errorMessage);
    }
  }, [fetchLikesData]);

  const handleSave = useCallback(async (postId: string): Promise<void> => {
    if (!isAuthenticated()) {
      console.error(ERROR_MESSAGES.NO_ACCESS_TOKEN);
      return;
    }

    try {
      await savePost(postId);

      setSavedPosts(prev => ({
        ...prev,
        [postId]: !prev[postId],
      }));
    } catch (error) {
      console.error('Error saving post:', error);
      const errorMessage = handleError(error);
      console.error(errorMessage);
    }
  }, []);

  const fetchMorePosts = useCallback(() => {
    fetchPosts(false);
  }, [fetchPosts]);

  // Initial fetch
  useEffect(() => {
    fetchPosts(true);
  }, []);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - PAGINATION.SCROLL_THRESHOLD &&
        hasMore &&
        !isLoading
      ) {
        fetchPosts(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, fetchPosts]);

  return {
    posts,
    likedPosts,
    savedPosts,
    likesData,
    hasMore,
    isLoading,
    fetchMorePosts,
    handleLike,
    handleSave,
    fetchLikesData,
  };
};
