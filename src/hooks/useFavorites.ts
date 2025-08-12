import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const useFavorites = () => {
    const [favoritePosts, setFavoritePosts] = useState<Record<string, boolean>>(() => {
        const savedFavorites = localStorage.getItem('favoritePosts');
        return savedFavorites ? JSON.parse(savedFavorites) : {};
    });

    const addToFavorites = async (postId: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/post/${postId}/favorite/`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("access_token")}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                console.log("Successfully added to favorites");
                setFavoritePosts((prev: Record<string, boolean>) => {
                    const newState = {
                        ...prev,
                        [postId]: true,
                    };
                    localStorage.setItem('favoritePosts', JSON.stringify(newState));
                    return newState;
                });
                return response;
            } else {
                console.error("Failed to add to favorites");
                return response;
            }
        } catch (error) {
            console.error("Error adding to favorites:", error);
            return error;
        }
    };

    const removeFromFavorites = async (postId: string) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/post/${postId}/favorite/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("access_token")}`,
                },
            });

            if (response.status === 200 || response.status === 204) {
                console.log("Successfully removed from favorites");
                setFavoritePosts((prev: Record<string, boolean>) => {
                    const newState = {
                        ...prev,
                        [postId]: false,
                    };
                    localStorage.setItem('favoritePosts', JSON.stringify(newState));
                    return newState;
                });
                return response;
            } else {
                console.error("Failed to remove from favorites");
                return response;
            }
        } catch (error) {
            console.error("Error removing from favorites:", error);
            return error;
        }
    };

    const toggleFavorite = async (postId: string) => {
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

    return {
        favoritePosts,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite
    };
};

export default useFavorites;
