import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../sidebar/sidebar';
import { useAuth } from "../hooks/useAuth";
import { useFollowUnfollow } from "../hooks/useFollowUnfollow";
import { usePosts } from "../hooks/usePosts";
import PostGrid from "../profile/postgrid";
import { CiSettings } from "react-icons/ci";
import { Home, Compass, Video, PlusSquare, MessageCircle, User, Settings, Grid, Bookmark, Tag } from "lucide-react";

const ProfilePage = () => {
    
    const { currentUser } = useAuth();
    const { followersCount, followingCount, fetchFollowerCounts } = useFollowUnfollow();
    const { posts, isLoading, hasMore, fetchUserPosts } = usePosts(9);
    const navigate = useNavigate();

    // Fetch user posts and follower/following counts on component mount
    useEffect(() => {
        if (currentUser?.username) {
            fetchUserPosts(true);
            fetchFollowerCounts();
        }
    }, [currentUser, fetchFollowerCounts, fetchUserPosts]);

    // Handle navigation to followers/following lists
    const navigateToFollowers = () => {
        navigate("/followers");
    };

    const navigateToFollowing = () => {
        navigate("/following");
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#FDFAF6] text-black dark:bg-[#0f0e12] dark:text-white">
            {/* Sidebar (Hidden on Mobile) */}
            <div className="hidden md:block">
                <Sidebar />
            </div>
            <div className="mx-40">

            {/* Main Profile Content */}
            <div className="flex-grow flex flex-col md:pl-56 lg:ml-7 pb-16">
                {/* Mobile Profile Header */}
                <div className="flex items-center p-4 md:hidden">
                    <button onClick={() => navigate("/settings")}>
                        <Settings size={24} />
                    </button>
                </div>

                {/* Profile Section */}
                <div className="flex flex-col items-start mt-10 ml-4 md:mt-0">
                    {/* Buttons */}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="flex items-center space-x-6">
                            <img
                                className="w-44 h-44 rounded-full border-2 border-gray-300 dark:border-gray-700 mt-16"
                                src={currentUser?.profile_picture || "/images/default.jpg"}
                                alt="Profile"
                            />
                            <div className="flex flex-col">
                                <div className="flex space-x-4 mt-2">
                                    <h1 className="text-lg font-bold">{currentUser?.username}</h1>
                                    <button
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md dark:bg-gray-700 dark:text-gray-300"
                                        onClick={() => navigate("/settings")}
                                    >
                                        Edit Profile
                                    </button>
                                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md dark:bg-gray-700 dark:text-gray-300">
                                        View archive
                                    </button>
                                    <button>
                                        <CiSettings />
                                    </button>
                                </div>
                                <div className="text-start flex w-full mt-6 text-sm font-bold">
                                    <h4 className="mr-1">{posts.length || 0}</h4>
                                    <p className="text-gray-500 dark:text-gray-400 mr-6">posts</p>
                                    
                                    <button 
                                        className="flex items-center focus:outline-none"
                                        onClick={navigateToFollowers}
                                    >
                                        <h4 className="mr-1">{followersCount || 0}</h4>
                                        <p className="text-gray-500 dark:text-gray-400 mr-6">followers</p>
                                    </button>
                                    
                                    <button 
                                        className="flex items-center focus:outline-none"
                                        onClick={navigateToFollowing}
                                    >
                                        <h4 className="mr-1">{followingCount || 0}</h4>
                                        <p className="text-gray-500 dark:text-gray-400 mr-6">following</p>
                                    </button>
                                </div>
                                <h4 className="text-sm font-bold text-start mr-44">{currentUser?.fullname}</h4>
                                {currentUser?.bio && (
                                    <div className="text-start mt-2 items-start">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{currentUser.bio}</p>
                                        {currentUser.website && (
                                            <a
                                                href={currentUser.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-500 dark:text-blue-400 underline"
                                            >
                                                {currentUser.website}
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Post Filter Buttons */}
                    <div className="flex justify-around w-full mt-6 border-t border-gray-300 dark:border-gray-700 pt-4 pb-2">
                        <button className="bg-[#FDFAF6] text-black dark:bg-[#0f0e12] dark:text-white p-2 flex items-center space-x-1">
                            <Grid size={15} />
                            <p className="text-sm">POSTS</p>
                        </button>
                        <button className="bg-[#FDFAF6] text-black dark:bg-[#0f0e12] dark:text-white p-2 flex items-center space-x-1">
                            <Bookmark size={15} />
                            <p className="text-sm">SAVED</p>
                        </button>
                        <button className="bg-[#FDFAF6] text-black dark:bg-[#0f0e12] dark:text-white p-2 flex items-center space-x-1">
                            <Tag size={15} />
                            <p className="text-sm">TAGGED</p>
                        </button>
                    </div>
                </div>

                {/* Posts Section */}
                <div className="mt-8">
                    {isLoading && posts.length === 0 ? (
                        <div className="flex justify-center">
                            <p>Loading posts...</p>
                        </div>
                    ) : posts.length > 0 ? (
                        <PostGrid
                            posts={posts}
                            API_BASE_URL={import.meta.env.VITE_BACKEND_URL}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center mt-8">
                            <p className="text-lg text-gray-500 dark:text-gray-400">No posts yet</p>
                        </div>
                    )}

                    {hasMore && posts.length > 0 && (
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
                </div>
            </div>

            {/* Bottom Navigation Bar (Visible Only on Mobile) */}
            <div className="fixed bottom-0 left-0 w-full p-2 flex justify-around items-center md:hidden border-t shadow-lg bg-white text-black dark:bg-[#101013] dark:text-white">
                <button onClick={() => navigate("/home")}>
                    <Home size={24} />
                </button>
                <button onClick={() => navigate("/explore")}>
                    <Compass size={24} />
                </button>
                <button onClick={() => navigate("/reels")}>
                    <Video size={24} />
                </button>
                <button onClick={() => navigate("/create")}>
                    <PlusSquare size={24} />
                </button>
                <button onClick={() => navigate("/messages")}>
                    <MessageCircle size={24} />
                </button>
                <button onClick={() => navigate("/profile")}>
                    <User size={24} />
                </button>
            </div>
        </div>
        </div>
    );
};

export default ProfilePage;