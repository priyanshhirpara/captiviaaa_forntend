import React from "react";
import PostMenu from "./post_menu";

const PostHeader = ({
  username,
  profilePicture,
  location,
  isMenuActive,
  onMenuToggle,
  setShowReportModal,
  post,
  closeMenu,
  isFavorite,
  onGoToPost,
}: {
  username: string;
  profilePicture: string;
  location: string;
  isMenuActive: boolean;
  onMenuToggle: () => void;
  setShowReportModal: (show: boolean) => void;
  post: any;
  closeMenu: () => void;
  isFavorite: boolean;
  onGoToPost: () => void;
}) => {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center">
        {/* Profile Picture */}
        <div className="w-9 h-9 rounded-full overflow-hidden mr-3">
          <img
            src={profilePicture || "https://via.placeholder.com/40"} // Fallback image
            alt={username}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h2 className="text-sm font-bold leading-none">{username}</h2>
          {location && <p className="text-xs text-gray-500 mt-1">{location}</p>}
        </div>
      </div>

      <div className="relative flex items-center gap-2 z-10">
        {/* Star icon for favorites */}
        {isFavorite && (
          <div className="text-yellow-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {/* Three-dot menu button */}
        <button
          onClick={onMenuToggle}
          className="text-gray-500 dark:text-gray-400 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isMenuActive && (
          <PostMenu
            setShowReportModal={setShowReportModal}
            post={post}
            closeMenu={closeMenu}
            onGoToPost={onGoToPost}
          />
        )}
      </div>
    </div>
  );
};

export default PostHeader;
