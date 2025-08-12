import { useState, useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import type { LikeUser, UseLikeReturn } from '../types/likeTypes';


// Constants
const ERROR_MESSAGES = {
    NO_ACCESS_TOKEN: 'No access token found. Please log in.',
    POST_NOT_AVAILABLE: 'Post or post ID is not available',
    FETCH_LIKED_FAILED: 'Failed to fetch liked by users',
    UPDATE_LIKE_FAILED: 'Failed to update like status',
};

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const accessToken = Cookies.get('access_token');

export const useLike = (
    postId: string,
    currentUserId: string | undefined,
    initialLikesCount: number = 0
): UseLikeReturn => {
    const [isLiked, setIsLiked] = useState(() => {
        const savedLikes = localStorage.getItem('likedPosts');
        return savedLikes ? JSON.parse(savedLikes)[postId] || false : false;
    });

    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [likedByUsers, setLikedByUsers] = useState<LikeUser[]>([]);
    const [loadingLikedBy, setLoadingLikedBy] = useState(false);
    const [showLikedBy, setShowLikedBy] = useState(false);

    // Fetch users who liked the post
    const fetchLikedByUsers = useCallback(async () => {
        if (!postId) {
            console.error(ERROR_MESSAGES.POST_NOT_AVAILABLE);
            return;
        }
        if (!accessToken) {
            console.error(ERROR_MESSAGES.NO_ACCESS_TOKEN);
            return;
        }

        setLoadingLikedBy(true);

        try {
            const response = await axios.get(
                `${API_BASE_URL}/post/like/?post_id=${postId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status !== 200) {
                throw new Error(ERROR_MESSAGES.FETCH_LIKED_FAILED);
            }

            const data = response.data as LikeUser[];
            setLikedByUsers(data);
            setLikesCount(data.length);

            // Check if current user has liked the post
            if (currentUserId) {
                const currentUserLiked = data.some((user: LikeUser) => user.id === currentUserId);
                if (currentUserLiked !== isLiked) {
                    setIsLiked(currentUserLiked);
                    // Update localStorage
                    const savedLikes = JSON.parse(localStorage.getItem('likedPosts') || '{}');
                    savedLikes[postId] = currentUserLiked;
                    localStorage.setItem('likedPosts', JSON.stringify(savedLikes));
                }
            }
        } catch (error) {
            console.error("Error fetching liked by users:", error);
        } finally {
            setLoadingLikedBy(false);
        }
    }, [postId, currentUserId, isLiked, API_BASE_URL]);

    // Handle like/unlike functionality
    const handleLikeToggle = useCallback(async () => {
        const accessToken = Cookies.get("access_token");

        if (!accessToken) {
            console.error(ERROR_MESSAGES.NO_ACCESS_TOKEN);
            return;
        }

        // Optimistically update UI
        const newLikeStatus = !isLiked;
        setIsLiked(newLikeStatus);
        setLikesCount(newLikeStatus ? likesCount + 1 : likesCount - 1);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/post/like/?post_id=${postId}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status !== 200) {
                // Revert optimistic update if the API call fails
                setIsLiked(!newLikeStatus);
                setLikesCount(newLikeStatus ? likesCount : likesCount + 1);
                throw new Error(ERROR_MESSAGES.UPDATE_LIKE_FAILED);
            }

            // Update localStorage
            const savedLikes = JSON.parse(localStorage.getItem('likedPosts') || '{}');
            savedLikes[postId] = newLikeStatus;
            localStorage.setItem('likedPosts', JSON.stringify(savedLikes));

            // Fetch updated likes data
            await fetchLikedByUsers();
        } catch (error) {
            console.error("Error updating like status:", error);
        }
    }, [isLiked, likesCount, postId, API_BASE_URL, fetchLikedByUsers]);

    // Toggle liked by modal
    const toggleLikedBy = useCallback(() => {
        if (!showLikedBy && likesCount > 0) {
            fetchLikedByUsers();
        }
        setShowLikedBy(!showLikedBy);
    }, [showLikedBy, likesCount, fetchLikedByUsers]);

    // Fetch liked users when component mounts
    useEffect(() => {
        fetchLikedByUsers();
    }, [fetchLikedByUsers]);

    return {
        isLiked,
        likesCount,
        likedByUsers,
        loadingLikedBy,
        showLikedBy,
        setIsLiked,
        setLikesCount,
        setShowLikedBy,
        handleLikeToggle,
        fetchLikedByUsers,
        toggleLikedBy,
    };
};
