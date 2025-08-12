import React, { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import CenterContent from './center_content';
import RightSidebar from './right_sidebar';
import {
  FaPlusCircle,
  FaUser,
  FaComments,
  FaBell,
  FaSearch,
} from 'react-icons/fa';
import { Home, Compass, Video, BookOpen, Pencil } from 'lucide-react';

const ROUTES = {
  HOME: '/home',
  EXPLORE: '/explore',
  REELS: '/reels',
  PROFILE: '/profile',
  CREATE_STORY: '/create/story',
  CREATE_POST: '/create',
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications',
};

const HomePage: React.FC = memo(() => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // Handle search bar toggle
  const handleSearchClick = useCallback(() => {
    setIsSearchOpen(prev => !prev);
  }, []);

  // Handle create menu toggle
  const handleCreateClick = useCallback(() => {
    setIsCreateMenuOpen(prev => !prev);
  }, []);

  // Navigation handlers
  const handleMessageClick = useCallback(() => navigate(ROUTES.MESSAGES), [navigate]);
  const handleNotificationClick = useCallback(() => navigate(ROUTES.NOTIFICATIONS), [navigate]);
  const handleHomeClick = useCallback(() => navigate(ROUTES.HOME), [navigate]);
  const handleReelsClick = useCallback(() => navigate(ROUTES.REELS), [navigate]);
  const handleProfileClick = useCallback(() => navigate(ROUTES.PROFILE), [navigate]);
  const handleExploreClick = useCallback(() => navigate(ROUTES.EXPLORE), [navigate]);
  const handleCreateStoryClick = useCallback(() => navigate(ROUTES.CREATE_STORY), [navigate]);
  const handleCreatePostClick = useCallback(() => navigate(ROUTES.CREATE_POST), [navigate]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Top Bar (Mobile Only - Fixed) */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md p-4 flex justify-between items-center md:hidden text-black dark:bg-[#161519] dark:text-white">
        {/* Search Bar (Visible when isSearchOpen is true) */}
        {isSearchOpen ? (
          <div className="flex-1 mr-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full p-2 border text-lg rounded-xl bg-gray-200 text-black dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              autoFocus
            />
          </div>
        ) : (
          <img
            src="/images/instagram_logo.png"
            alt="Instagram"
            className="text-sm h-8 w-24 font-bold cursor-pointer"
            loading="lazy"
          />
        )}

        {/* Message and Notification Icons */}
        <div className="flex space-x-4">
          <button
            onClick={handleExploreClick}
            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            aria-label="Search"
          >
            <FaSearch className="w-6 h-6" />
          </button>
          <button
            onClick={handleNotificationClick}
            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            aria-label="Notifications"
          >
            <FaBell className="w-6 h-6" />
          </button>
          <button
            onClick={handleMessageClick}
            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            aria-label="Messages"
          >
            <FaComments className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop Only) */}
      <div className="hidden md:block md:w-60 md:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content - Scrollable Area */}
      <div className="flex-1 flex flex-col md:flex-row mt-16 md:mt-0 overflow-y-auto h-[calc(100vh-4rem)] md:h-auto">
        <div className="flex-1 p-4">
          <CenterContent />
        </div>
        {/* Right Sidebar (Hidden on Mobile) */}
        <div className="hidden lg:block w-72 bg-[#FDFAF6] text-black dark:bg-[#101013] dark:text-white">
          <RightSidebar />
        </div>
      </div>

      {/* Bottom Navigation Bar (Mobile Only - Fixed) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-md p-2 md:hidden text-black dark:bg-[#161519] dark:text-white">
        <div className="flex justify-around items-center relative">
          <button
            onClick={handleHomeClick}
            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            aria-label="Home"
          >
            <Home className="w-6 h-6" />
          </button>
          <button
            onClick={handleExploreClick}
            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            aria-label="Explore"
          >
            <Compass className="w-6 h-6" />
          </button>
          <button
            onClick={handleReelsClick}
            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            aria-label="Reels"
          >
            <Video className="w-6 h-6" />
          </button>
          <div className="relative">
            <button
              onClick={handleCreateClick}
              className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              aria-label="Create"
            >
              <FaPlusCircle className="w-6 h-6" />
            </button>
            {isCreateMenuOpen && (
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white text-black dark:bg-[#2b2931] dark:text-white shadow-md rounded-md p-2 min-w-[120px]">
                <button
                  onClick={handleCreateStoryClick}
                  className="block w-full text-left p-2 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center transition-colors duration-200"
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Story
                </button>
                <button
                  onClick={handleCreatePostClick}
                  className="block w-full text-left p-2 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center transition-colors duration-200"
                >
                  <Pencil className="w-4 h-4 mr-2" /> Post
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleProfileClick}
            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            aria-label="Profile"
          >
            <FaUser className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;