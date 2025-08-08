import React, { memo } from 'react';
import type { Comment } from '../hooks/useComments';

// Constants
const PLACEHOLDER_IMAGES = {
  USER_PROFILE: '/images/default.jpg',
};

// Utility function
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
};

const CommentSection: React.FC<{
  comments: Comment[];
  commentText: string;
  onCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCommentSubmit: () => void;
}> = memo(({
  comments,
  commentText,
  onCommentChange,
  onCommentSubmit,
}) => {
  const handleSubmit = () => {
    if (commentText.trim()) {
      onCommentSubmit();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && commentText.trim()) {
      onCommentSubmit();
    }
  };

  return (
    <div className="w-1/2 h-[25rem] flex flex-col bg-white dark:bg-[#1a1922] rounded-lg ml-4 overflow-hidden">
      {/* Comments Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white">Comments</h3>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3">
              <img
                src={comment.user_profile_picture || PLACEHOLDER_IMAGES.USER_PROFILE}
                alt={comment.username}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                loading="lazy"
              />
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {comment.username}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(comment.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 break-words">
                  {comment.text}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No comments yet. Be the first to comment!
            </p>
          </div>
        )}
      </div>

      {/* Comment Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={onCommentChange}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={!commentText.trim()}
          />
          <button
            onClick={handleSubmit}
            disabled={!commentText.trim()}
            className="text-blue-500 font-semibold hover:text-blue-600 dark:hover:text-blue-400 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
});

CommentSection.displayName = 'CommentSection';

export default CommentSection;