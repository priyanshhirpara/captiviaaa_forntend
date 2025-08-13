import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useComments } from "../hooks/useComments";
import { useLike } from "../hooks/useLike";
import { useSave } from "../hooks/useSave";
import type { Post, CurrentUser } from "../types/posttypes";


const PostDetail = ({
  post,
  onClose,
  API_BASE_URL,
}: {
  post: Post;
  onClose: () => void;
  API_BASE_URL: string;
}) => {
  const { currentUser } = useAuth() as { currentUser: CurrentUser | null };
  const { commentText, handleCommentChange, postComment } = useComments(
    currentUser as CurrentUser
  );
  const [comments, setComments] = useState(post.comments || []);

  // Use the useSave hook to handle all save-related functionality
  const { isSaved, toggleSave } = useSave();

  // Use the useLike hook to handle all like-related functionality
  const {
    isLiked,
    likesCount,
    likedByUsers,
    loadingLikedBy,
    showLikedBy,
    handleLikeToggle,
    fetchLikedByUsers,
    toggleLikedBy,
  } = useLike(post.id.toString(), currentUser?.id, API_BASE_URL, post.likes);

  // Handle comment submission
  const handleCommentSubmitWrapper = async () => {
    if (!commentText.trim()) return;

    const username = currentUser?.username || "Anonymous";
    const profilePicture =
      currentUser?.personal_information?.profile_picture ||
      "/images/default.jpg";

    const newComment = await postComment(
      post.id.toString(),
      commentText.trim(),
      username,
      profilePicture
    );
    if (newComment) {
      // Convert the Comment type to match the Post.comments structure
      const convertedComment = {
        id: newComment.id,
        user_id: currentUser?.id || "",
        username: newComment.username,
        post_id: post.id,
        content: newComment.text,
        user_profile_picture: newComment.user_profile_picture,
        created_at: newComment.created_at || "",
      };
      setComments([...comments, convertedComment]);
    }
  };

  // Handle save/unsave functionality
  const handleSaveToggle = async () => {
    await toggleSave(post.id);
  };

  // Fetch liked users when component mounts
  useEffect(() => {
    fetchLikedByUsers();
  }, [fetchLikedByUsers]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-75"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-[#262626] w-full max-w-4xl h-[90vh] flex overflow-hidden rounded-xl">
        {/* Left Side - Post Image */}
        <div className="w-1/2 bg-black flex items-center justify-center">
          <img
            src={post.image_url}
            alt="Post"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right Side - Comments and Input */}
        <div className="w-1/2 flex flex-col">
          {/* Header with post author info */}
          <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800">
            <img
              src={post.user_profile_picture || "/images/default.jpg"}
              alt={post.username}
              className="w-8 h-8 rounded-full object-cover mr-3"
            />
            <span className="font-semibold">{post.username}</span>
            <button
              onClick={onClose}
              className="ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Comments section */}
          <div className="flex-grow overflow-y-auto p-4">
            {/* Original post caption */}
            <div className="flex items-start mb-4">
              <img
                src={post.user_profile_picture || "/images/default.jpg"}
                alt={post.username}
                className="w-8 h-8 rounded-full object-cover mr-3"
              />
              <div>
                <p>
                  <span className="font-semibold mr-2">{post.username}</span>
                  {post.caption}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(post.created_at || "").toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Comment list */}
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start mb-4">
                  <img
                    src={comment.user_profile_picture || "/images/default.jpg"}
                    alt={comment.username}
                    className="w-8 h-8 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <p>
                      <span className="font-semibold mr-2">
                        {comment.username}
                      </span>
                      {comment.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.created_at || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 my-6">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>

          {/* Like and Save section */}
          <div className="border-t border-gray-200 dark:border-gray-800">
            <div className="p-3">
              <div className="flex items-center">
                {/* Like button */}
                <button onClick={handleLikeToggle} className="mr-4">
                  {isLiked ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="red"
                      className="w-6 h-6"
                    >
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                  )}
                </button>

                {/* Comment button */}
                <button className="mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                    />
                  </svg>
                </button>

                {/* Save button */}
                <button onClick={handleSaveToggle} className="ml-auto">
                  {isSaved(post.id) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Likes count */}
              {likesCount > 0 && (
                <button
                  onClick={toggleLikedBy}
                  className="font-semibold mt-2 text-sm hover:underline"
                >
                  {likesCount === 1 ? "1 like" : `${likesCount} likes`}
                </button>
              )}
            </div>
          </div>

          {/* Comment input */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-3 flex items-center">
            <button className="text-xl mr-3">😊</button>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={handleCommentChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCommentSubmitWrapper();
                }
              }}
              className="flex-grow bg-transparent focus:outline-none"
            />
            <button
              onClick={handleCommentSubmitWrapper}
              disabled={!commentText.trim()}
              className={`font-semibold ${
                commentText.trim() ? "text-blue-500" : "text-blue-300"
              }`}
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Liked By Modal */}
      {showLikedBy && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-75"
            onClick={toggleLikedBy}
          ></div>
          <div className="relative bg-white dark:bg-[#262626] w-80 max-h-96 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-center font-semibold flex-grow">Likes</h3>
              <button onClick={toggleLikedBy}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto max-h-80 p-2">
              {loadingLikedBy ? (
                <p className="text-center p-4">Loading...</p>
              ) : likedByUsers.length > 0 ? (
                likedByUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    <img
                      src={user.profile_picture || "/images/default.jpg"}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="font-semibold">{user.username}</p>
                      {user.fullname && (
                        <p className="text-sm text-gray-500">{user.fullname}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center p-4">No likes yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
