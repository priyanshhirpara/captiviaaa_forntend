import React, { useState } from "react";

const CommentModal = ({
  post,
  commentText,
  onCommentChange,
  onCommentSubmit,
  onClose,
  currentUser,
}: {
  post: any;
  commentText: string;
  onCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCommentSubmit: () => void;
  onClose: () => void;
  currentUser: any;
}) => {
  const [comments, setComments] = useState(post.comments || []);

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now(), // Temporary unique ID
        username: currentUser.username,
        user_profile_picture:
          currentUser.personal_information?.profile_picture ||
          "https://via.placeholder.com/40",
        content: commentText.trim(),
      };
      setComments([...comments, newComment]);
      onCommentSubmit(); // Call the parent-provided submit handler
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-75" onClick={onClose}></div>

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
              src={
                post.user_profile_picture || "https://via.placeholder.com/40"
              }
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
                src={
                  post.user_profile_picture || "https://via.placeholder.com/40"
                }
                alt={post.username}
                className="w-8 h-8 rounded-full object-cover mr-3"
              />
              <div>
                <p>
                  <span className="font-semibold mr-2">{post.username}</span>
                  {post.caption}
                </p>
                <p className="text-xs text-gray-500 mt-1">{post.posted_time}</p>
              </div>
            </div>

            {/* Comment list */}
            {comments.length > 0 ? (
              comments.map((comment: any) => (
                <div key={comment.id} className="flex items-start mb-4">
                  <img
                    src={
                      comment.user_profile_picture ||
                      "https://via.placeholder.com/30"
                    }
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
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 my-6">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>

          {/* Post actions (like, comment, share)
                    <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                        <div className="flex items-center space-x-4 mb-3">
                            <button className="text-2xl">❤️</button>
                            <button className="text-2xl">💬</button>
                            <button className="text-2xl">📤</button>
                            <button className="text-2xl ml-auto">🔖</button>
                        </div>
                        <p className="font-semibold mb-1">{post.likes || 0} likes</p>
                        <p className="text-xs text-gray-500">{post.posted_time}</p>
                    </div> */}

          {/* Comment input */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-3 flex items-center">
            <button className="text-xl mr-3">😊</button>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={onCommentChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCommentSubmit();
                }
              }}
              className="flex-grow bg-transparent focus:outline-none"
            />
            <button
              onClick={handleCommentSubmit}
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
    </div>
  );
};

export default CommentModal;
