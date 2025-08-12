import { useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import type { Comment, UseCommentsReturn, CurrentUser } from '../types/posttypes';


// Constants
const ERROR_MESSAGES = {
  NO_ACCESS_TOKEN: 'No access token found. Please log in.',
};

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// API functions
const addComment = async (postId: string, commentText: string): Promise<{ id: string }> => {
  const token = Cookies.get('access_token');
  const response = await axios.post(`${API_BASE_URL}/post/${postId}/comment/`, {
    content: commentText,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data as { id: string };
};

export const useComments = (currentUser?: CurrentUser): UseCommentsReturn => {
  const [commentText, setCommentText] = useState<string>('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);

  const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  }, []);

  const handleCommentSubmit = useCallback(async (postId: string): Promise<Comment | null> => {
    if (!commentText.trim()) {
      return null;
    }

    const token = Cookies.get('access_token');
    if (!token) {
      console.error(ERROR_MESSAGES.NO_ACCESS_TOKEN);
      return null;
    }

    try {
      const newComment = await addComment(postId, commentText.trim());

      const commentWithUserInfo: Comment = {
        ...newComment,
        text: commentText.trim(),
        username: currentUser?.username || 'Anonymous',
        user_profile_picture: currentUser?.personal_information?.profile_picture || 'https://via.placeholder.com/30',
        created_at: new Date().toISOString(),
      };

      setCommentText('');
      return commentWithUserInfo;
    } catch (error) {
      console.error('Error posting comment:', error);
      return null;
    }
  }, [commentText, currentUser]);

  // New function to post comments with explicit user info
  const postComment = useCallback(async (
    postId: string,
    commentText: string,
    username: string,
    profilePicture: string
  ): Promise<Comment | null> => {
    if (!commentText.trim()) {
      return null;
    }

    const token = Cookies.get('access_token');
    if (!token) {
      console.error(ERROR_MESSAGES.NO_ACCESS_TOKEN);
      return null;
    }

    try {
      const newCommentData = await addComment(postId, commentText.trim());

      // Create the new comment with user info
      const newComment: Comment = {
        id: newCommentData.id || Date.now().toString(),
        username: username,
        user_profile_picture: profilePicture,
        text: commentText.trim(),
        created_at: new Date().toISOString(),
      };

      return newComment;
    } catch (error) {
      console.error('Error posting comment:', error);

      // Return a temporary comment for optimistic updates
      const tempComment: Comment = {
        id: Date.now().toString(),
        username: username,
        user_profile_picture: profilePicture,
        text: commentText.trim(),
        created_at: new Date().toISOString(),
      };

      return tempComment;
    }
  }, []);

  return {
    commentText,
    activeCommentPostId,
    setActiveCommentPostId,
    handleCommentChange,
    handleCommentSubmit,
    postComment,
  };
};
