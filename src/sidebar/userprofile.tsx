import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import PostGrid from "../profile/postgrid";
import { useAuth } from "../hooks/useAuth";
import { useFollowUnfollow } from "../hooks/useFollowUnfollow";

interface UserProfileData {
  id: string;
  username: string;
  fullname: string;
  posts: {
    id: string;
    image: string;
    caption: string;
    created_at: string;
    created_by: string;
  }[];
  followers: { length: number };
  following: { length: number };
  personal_information?: {
    profile_picture?: string;
    bio?: string;
    website?: string;
  };
}

const UserProfile = () => {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { currentUser } = useAuth();
  const { username } = useParams();
  const { followUser, unfollowUser } = useFollowUnfollow();
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Reset states when username changes
  useEffect(() => {
    setUserData(null);
    setLoading(true);
    setError(null);
    setIsFollowing(false);
    setHasMore(true);
  }, [username]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/user_profiles/?username=${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("access_token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);

        // If there are fewer posts than a typical page size, set hasMore to false
        if (data.posts && data.posts.length < 12) {
          setHasMore(false);
        }

        // Check if current user is following this profile
        if (currentUser && data.id) {
          checkFollowStatus(data.id);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (username && currentUser) {
      fetchUserData();
    }
  }, [username, API_BASE_URL, currentUser]);

  const checkFollowStatus = async (profileUserId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/is_following/?user_id=${profileUserId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.is_following);
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !userData || followLoading) return;

    setFollowLoading(true);
    try {
      let response;

      if (isFollowing) {
        // Unfollow the user
        response = await unfollowUser(userData.id);
      } else {
        // Follow the user
        response = await followUser(userData.id);
      }

      if (response) {
        // Toggle follow status
        setIsFollowing(!isFollowing);

        // Update followers count
        setUserData((prevData: UserProfileData | null) => {
          if (!prevData) return null;
          return {
            ...prevData,
            followers: {
              ...prevData.followers,
              length: isFollowing
                ? (prevData.followers?.length || 1) - 1
                : (prevData.followers?.length || 0) + 1,
            },
          };
        });

        // Store the follow status in localStorage for better persistence
        // This helps maintain the follow state across page refreshes
        const followData = JSON.parse(
          localStorage.getItem("followData") || "{}"
        );
        followData[userData.id] = !isFollowing;
        localStorage.setItem("followData", JSON.stringify(followData));
      } else {
        throw new Error("Failed to toggle follow status");
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  // Check localStorage for follow status when component loads
  useEffect(() => {
    if (userData && currentUser) {
      const followData = JSON.parse(localStorage.getItem("followData") || "{}");
      if (followData[userData.id] !== undefined) {
        setIsFollowing(followData[userData.id]);
      }
    }
  }, [userData, currentUser]);

  const fetchUserPosts = async (reset = false) => {
    // Prevent fetching more posts if already loading
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Calculate the offset based on current posts
      const offset = reset ? 0 : userData?.posts?.length || 0;

      const response = await fetch(
        `${API_BASE_URL}/posts/?username=${username}&offset=${offset}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const newPosts = await response.json();

      // Update userData with new posts
      if (reset) {
        setUserData({ ...userData, posts: newPosts } as UserProfileData);
      } else {
        setUserData({
          ...userData,
          posts: [...(userData?.posts || []), ...newPosts],
        } as UserProfileData);
      }

      // If we received fewer posts than requested, there are no more to load
      if (newPosts.length < 12) {
        // Adjust number based on your page size
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      );
    }

    if (!userData) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-gray-500 text-xl">User not found</div>
        </div>
      );
    }

    // Don't show follow button for own profile
    const isOwnProfile = currentUser && currentUser.id === Number(userData.id);

    return (
      <div className="container mx-auto mt-20 md:mt-10 px-4 md:px-8 max-w-screen-lg">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start mb-10">
          {/* Profile Picture */}
          <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden mr-0 md:mr-10 mb-4 md:mb-0">
            <img
              src={
                userData.personal_information?.profile_picture ||
                "/api/placeholder/150/150"
              }
              alt={`${userData.username}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            {/* Username and Buttons */}
            <div className="flex flex-col md:flex-row items-center md:items-start mb-4">
              <h1 className="text-xl md:text-2xl font-semibold mr-0 md:mr-4 mb-3 md:mb-0">
                {userData.username}
              </h1>
              <div className="flex space-x-2">
                {!isOwnProfile && currentUser && (
                  <button
                    className={`px-4 py-1 rounded font-medium ${
                      isFollowing
                        ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                        : "bg-blue-500 text-white"
                    }`}
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                  >
                    {followLoading
                      ? "Loading..."
                      : isFollowing
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                )}
                <button className="bg-gray-200 dark:bg-gray-700 px-4 py-1 rounded font-medium">
                  Message
                </button>
                <button className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  •••
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center md:justify-start space-x-4 md:space-x-8 mb-4">
              <div className="text-center md:text-left">
                <span className="font-semibold">
                  {userData.posts?.length || 0}
                </span>{" "}
                <span>posts</span>
              </div>
              <div className="text-center md:text-left">
                <span className="font-semibold">
                  {userData.followers?.length || 0}
                </span>{" "}
                <span>followers</span>
              </div>
              <div className="text-center md:text-left">
                <span className="font-semibold">
                  {userData.following?.length || 0}
                </span>{" "}
                <span>following</span>
              </div>
            </div>

            {/* Bio */}
            <div className="text-center md:text-left">
              <p className="font-semibold">{userData.fullname}</p>
              <p>{userData.personal_information?.bio}</p>
              {userData.personal_information?.website && (
                <a
                  href={userData.personal_information.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-900 dark:text-blue-400"
                >
                  {userData.personal_information.website}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Posts/Tagged Tabs */}
        <div className="border-t dark:border-gray-700">
          <div className="flex justify-center">
            <button className="px-4 py-2 border-t-2 border-black dark:border-white font-semibold flex items-center">
              POSTS
            </button>
            <button className="px-4 py-2 text-gray-500 dark:text-gray-400 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              TAGGED
            </button>
          </div>
        </div>

        {/* Posts Content */}
        <div className="mt-8">
          {isLoading && userData.posts.length === 0 ? (
            <div className="flex justify-center">
              <p>Loading posts...</p>
            </div>
          ) : userData.posts.length > 0 ? (
            <>
              <PostGrid
                posts={userData.posts}
                API_BASE_URL={API_BASE_URL}
                currentUser={currentUser}
              />
              {/* Load More button */}
              {hasMore && (
                <div className="flex justify-center mt-4 mb-8">
                  <button
                    onClick={() => fetchUserPosts(false)}
                    disabled={isLoading}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  >
                    {isLoading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center mt-8">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                No posts yet
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="hidden md:block md:w-60 md:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
};

export default UserProfile;
