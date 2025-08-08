import { useState, useCallback } from 'react';
import { apiClient, API_ENDPOINTS, isAuthenticated, handleError } from './apiClient';

// Types
export interface Comment {
  id: string;
  text: string;
  username: string;
  user_profile_picture: string;
  timestamp: string;
}

export interface User {
  id: number;
  username: string;
  fullname: string;
  email?: string;
  mobile_number?: string;
  profile_picture?: string;
  bio?: string;
  website?: string;
}

export interface UseCommentsReturn {
  commentText: string;
  activeCommentPostId: string | null;
  setActiveCommentPostId: (postId: string | null) => void;
  handleCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCommentSubmit: (postId: string) => Promise<Comment | null>;
}

// Constants
const ERROR_MESSAGES = {
  NO_ACCESS_TOKEN: 'No access token found. Please log in.',
};

// API functions
const addComment = async (postId: string, commentText: string): Promise<any> => {
  const response = await apiClient.post(`/posts/${postId}/comments/`, {
    text: commentText,
  });
  return response.data as any;
};

export const useComments = (currentUser?: User): UseCommentsReturn => {
  const [commentText, setCommentText] = useState<string>('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);

  const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  }, []);

  const handleCommentSubmit = useCallback(async (postId: string): Promise<Comment | null> => {
    if (!commentText.trim()) {
      return null;
    }

    if (!isAuthenticated()) {
      console.error(ERROR_MESSAGES.NO_ACCESS_TOKEN);
      return null;
    }

    try {
      const newComment = await addComment(postId, commentText.trim());

      const commentWithUserInfo: Comment = {
        ...newComment,
        username: currentUser?.username || 'Anonymous',
        user_profile_picture: currentUser?.profile_picture || 'https://via.placeholder.com/30',
        timestamp: new Date().toISOString(),
      };

      setCommentText('');
      return commentWithUserInfo;
    } catch (error) {
      console.error('Error posting comment:', error);
      const errorMessage = handleError(error);
      console.error(errorMessage);
      return null;
    }
  }, [commentText, currentUser]);

  return {
    commentText,
    activeCommentPostId,
    setActiveCommentPostId,
    handleCommentChange,
    handleCommentSubmit,
  };
};
