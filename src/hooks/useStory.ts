import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import type { UserStories, UseStoryReturn } from "../types/posttypes";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const accessToken = Cookies.get("access_token");

export const useStory = (): UseStoryReturn => {
    const [userStories, setUserStories] = useState<UserStories[]>([]);

    const fetchStories = async () => {
        try {
            if (!accessToken) {
                console.error("No access token found. Please log in.");
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/story-list/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status !== 200) {
                throw new Error("Failed to fetch stories");
            }

            const stories = response.data as Array<{
                username: string;
                profileImage: string;
                created_at: string;
                image: string;
                caption?: string;
                id: string;
            }>;

            // Group stories by username
            const storiesByUser: Record<string, {
                username: string;
                profileImage: string;
                latestTime: string;
                stories: {
                    image: string;
                    postedTime: string;
                    caption: string;
                    id: string;
                }[];
            }> = {};
            stories.forEach((story: {
                username: string;
                profileImage: string;
                created_at: string;
                image: string;
                caption?: string;
                id: string;
            }) => {
                if (!storiesByUser[story.username]) {
                    storiesByUser[story.username] = {
                        username: story.username,
                        profileImage: story.profileImage,
                        latestTime: story.created_at,
                        stories: []
                    };
                }

                storiesByUser[story.username].stories.push({
                    image: story.image,
                    postedTime: story.created_at,
                    caption: story.caption || "",
                    id: story.id
                });
            });

            // Convert to array and sort by latest story time
            const groupedStories = Object.values(storiesByUser);
            setUserStories(groupedStories);
        } catch (error) {
            console.error("Error fetching stories:", error);
        }
    };

    useEffect(() => {
        fetchStories();
    }, [API_BASE_URL]);

    return {
        userStories,
        fetchStories
    };
};
