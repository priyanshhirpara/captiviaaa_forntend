import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import type { Post, UsePostsReturn, ApiPostData } from '../types/posttypes';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface LikeData {
  user_id: string;
  username: string;
  profile_picture: string;
}

export const usePosts = (): UsePostsReturn => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>(() => {
    const savedLikes = localStorage.getItem('likedPosts');
    return savedLikes ? JSON.parse(savedLikes) : {};
  });
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [likesData, setLikesData] = useState<Record<string, LikeData[]>>({});
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10); // Default limit for pagination
  const [hasMore, setHasMore] = useState(true); // To track if more posts are available
  const [isLoading, setIsLoading] = useState(false); // To prevent duplicate calls

  // Use ref to prevent stale closures in useEffect
  const isLoadingRef = useRef(isLoading);
  const skipRef = useRef(skip);
  const hasMoreRef = useRef(hasMore);

  // Update refs when state changes
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    skipRef.current = skip;
  }, [skip]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const fetchPosts = useCallback(async (reset = false) => {
    if (isLoadingRef.current) return; // Prevent duplicate calls
    setIsLoading(true);

    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      console.error("No access token found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const currentSkip = reset ? 0 : skipRef.current; // Use 0 if resetting, otherwise use current skip
      console.log(`Fetching posts: skip=${currentSkip}, limit=${limit}`);

      const response = await axios.get<ApiPostData[]>(`${API_BASE_URL}/posts/?skip=${currentSkip}&limit=${limit}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch posts");
      }

      const apiData = response.data;
      console.log(`Received ${apiData.length} posts from API`);

      const transformedPosts: Post[] = apiData.map((post: ApiPostData) => ({
        id: post.id,
        username: post.username,
        image_url: post.image_url,
        time: new Date().toLocaleTimeString(),
        location: post.location || "",
        saves: post.saves || 0,
        comments: (post.comments || []).map(comment => ({
          id: comment.id,
          text: comment.text,
          username: comment.username,
          user_profile_picture: comment.user_profile_picture,
          created_at: comment.created_at,
        })),
        user_profile_picture: post.user_profile_picture,
        caption: post.caption || "",
        created_by: post.created_by || "",
        post_type: post.post_type || "image",
        created_at: post.created_at ? new Date(post.created_at).getTime() : Date.now(),
        likes: post.likes || 0,
      }));

      setPosts(prev => reset ? transformedPosts : [...prev, ...transformedPosts]);
      setHasMore(apiData.length === limit); // If fewer posts are returned, no more posts are available

      if (!reset) {
        setSkip(prev => prev + limit); // Increment skip for the next fetch
      } else {
        setSkip(limit); // Reset skip to the first page's limit
      }

      transformedPosts.forEach(post => {
        fetchLikesData(String(post.id));
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchPosts(true); // Fetch initial posts on mount
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && hasMoreRef.current && !isLoadingRef.current) {
        fetchPosts(false); // Fetch more posts when near the bottom
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array - only attach listener once

  const fetchLikesData = useCallback(async (postId: string) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      console.error("No access token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get<LikeData[]>(`${API_BASE_URL}/post/like/?post_id=${postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch likes data");
      }

      const data = response.data;
      // Transform the data to include only the necessary user information
      const transformedData: LikeData[] = data.map((like: LikeData) => ({
        user_id: like.user_id,
        username: like.username || 'Unknown User',
        profile_picture: like.profile_picture || '/images/default.jpg'
      }));

      setLikesData(prev => ({
        ...prev,
        [postId]: transformedData
      }));
    } catch (error) {
      console.error("Error fetching likes data:", error);
    }
  }, []);

  const handleLike = useCallback(async (postId: string) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      console.error("No access token found. Please log in.");
      return;
    }

    try {
      console.log(`Liking post: ${postId}`);
      const response = await axios.post(`${API_BASE_URL}/post/like/?post_id=${postId}`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to like post");
      }

      console.log(`Successfully liked post: ${postId}`);
      setLikedPosts(prev => {
        const newState = {
          ...prev,
          [postId]: !prev[postId],
        };
        localStorage.setItem('likedPosts', JSON.stringify(newState));
        return newState;
      });

      await fetchLikesData(postId);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }, [fetchLikesData]);

  const handleSave = useCallback(async (postId: string) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      console.error("No access token found. Please log in.");
      return;
    }

    try {
      console.log(`Saving post: ${postId}`);
      const response = await axios.post(`${API_BASE_URL}/saves/?post_id=${postId}`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to save post");
      }

      console.log(`Successfully saved post: ${postId}`);
      setSavedPosts(prev => ({
        ...prev,
        [postId]: !prev[postId],
      }));
    } catch (error) {
      console.error("Error saving post:", error);
    }
  }, []);

  const handleCollaborator = useCallback(async (postId: string) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      console.error("No access token found. Please log in.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/post/collaborator/?post_id=${postId}`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to add collaborator");
      }

      console.log("Collaborator added successfully");
    } catch (error) {
      console.error("Error adding collaborator:", error);
    }
  }, []);

  return {
    posts,
    isLoading,
    hasMore,
    likedPosts,
    savedPosts,
    likesData,
    fetchUserPosts: fetchPosts,
    fetchMorePosts: () => fetchPosts(false), // Function to load more posts
    handleLike,
    handleSave,
    handleCollaborator,
    fetchLikesData
  };
};
