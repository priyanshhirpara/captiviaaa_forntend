import React, { useState } from "react";
import PostDetail from "./postdetail";
import { Heart, MessageCircle } from "lucide-react";
import { useLike } from "../hooks/useLike";
import type { Post } from "../hooks/usePosts";

interface PostGridProps {
  posts: Post[];
  API_BASE_URL: string;
}

const PostGrid = ({ posts, API_BASE_URL }: PostGridProps) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);

  // Get current user ID from localStorage or cookies (you may need to adjust this)
  const currentUserId = localStorage.getItem("userId") || undefined;

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const closePostDetail = () => {
    setSelectedPost(null);
  };

  const handleMouseEnter = (post: Post) => {
    setHoveredPost(post.id);
  };

  const handleMouseLeave = () => {
    setHoveredPost(null);
  };

  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => {
        // Create a separate component for each post to use the hook properly
        return (
          <PostGridItem
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            API_BASE_URL={API_BASE_URL}
            hoveredPost={hoveredPost}
            onPostClick={handlePostClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}

      {selectedPost && (
        <PostDetail
          post={selectedPost}
          onClose={closePostDetail}
          API_BASE_URL={API_BASE_URL}
        />
      )}
    </div>
  );
};

// Separate component to use the useLike hook properly
interface PostGridItemProps {
  post: Post;
  currentUserId: string | undefined;
  API_BASE_URL: string;
  hoveredPost: number | null;
  onPostClick: (post: Post) => void;
  onMouseEnter: (post: Post) => void;
  onMouseLeave: () => void;
}

const PostGridItem = ({
  post,
  currentUserId,
  API_BASE_URL,
  hoveredPost,
  onPostClick,
  onMouseEnter,
  onMouseLeave,
}: PostGridItemProps) => {
  const { isLiked, likesCount, handleLikeToggle, loadingLikedBy } = useLike(
    post.id.toString(),
    currentUserId,
    API_BASE_URL,
    post.likes || 0
  );

  return (
    <div
      className="h-96 w-80 relative cursor-pointer overflow-hidden"
      onClick={() => onPostClick(post)}
      onMouseEnter={() => onMouseEnter(post)}
      onMouseLeave={onMouseLeave}
    >
      {post.image_url.includes('.mp4') || post.image_url.includes('.mov') ? (
        <div className="relative w-full h-full">
          <img
            src={post.image_url}
            alt="Post thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              className="lucide lucide-video"
            >
              <path d="M22 8.5v7a1.5 1.5 0 0 1-1.5 1.5H3.5A1.5 1.5 0 0 1 2 15.5v-7A1.5 1.5 0 0 1 3.5 7h17A1.5 1.5 0 0 1 22 8.5Z" />
              <path d="m2 12 20-5" />
              <path d="m2 12 20 5" />
              <path d="M2 12h20" />
            </svg>
          </div>
        </div>
      ) : (
        <img
          src={post.image_url}
          alt="Post"
          className="w-full h-full object-cover"
        />
      )}

      {/* Overlay with like and comment count on hover */}
      {hoveredPost === post.id && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-200">
          <div className="flex items-center space-x-8 text-white">
            <div
              className="flex items-center space-x-2 cursor-pointer hover:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                handleLikeToggle();
              }}
            >
              <Heart
                size={24}
                fill={isLiked ? "red" : "white"}
                stroke={isLiked ? "red" : "white"}
              />
              <span className="font-semibold text-lg">
                {loadingLikedBy ? "..." : likesCount}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle size={24} fill="transparent" stroke="white" />
              <span className="font-semibold text-lg">
                {post.comments?.length || 0}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostGrid;
