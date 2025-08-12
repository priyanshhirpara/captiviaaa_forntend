import React, { memo } from 'react';
import PostHeader from './post_header';
import PostActions from './post_actions';
import useFavorites from '../hooks/useFavorites';
import type { Post } from '../types/posttypes';

interface PostProps {
    post: Post;
    isMenuActive: boolean;
    isLiked: boolean;
    isSaved: boolean;
    onLike: (postId: string) => void;
    onSave: (postId: string) => void;
    onCommentToggle: () => void;
    onMenuToggle: (postId: string) => void;
    onCollaborator: (postId: string) => void;
    onShowLikes: (postId: string) => void;
    onUsernameClick: (username: string) => void;
    likesCount: number;
    likesData: Record<string, any[]>;
    setShowReportModal: (show: boolean) => void;
    closeMenu: () => void;
    onGoToPost: (postId: string) => void;
}
const apiUtils = {
    formatDate: (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;

        return date.toLocaleDateString();
    },
};
const PLACEHOLDER_IMAGES = {
    USER_PROFILE: '/images/default.jpg',
    POST_IMAGE: '/images/default.jpg',
};

const Post: React.FC<PostProps> = memo(({
    post,
    isMenuActive,
    isLiked,
    isSaved,
    onLike,
    onSave,
    onCommentToggle,
    onMenuToggle,
    onShowLikes,
    onUsernameClick,
    likesCount,
    likesData,
    setShowReportModal,
    closeMenu,
    onGoToPost,
}) => {
    const { isFavorite } = useFavorites();

    const handleLikeClick = () => {
        onLike(post.id.toString());
    };

    const handleSaveClick = () => {
        onSave(post.id.toString());
    };

    const handleCommentClick = () => {
        onCommentToggle();
    };

    const handleMenuClick = () => {
        onMenuToggle(post.id.toString());
    };

    const handleShowLikesClick = () => {
        onShowLikes(post.id.toString());
    };

    const handleGoToPostClick = () => {
        onGoToPost(post.id.toString());
    };

    const postLikes = likesData[post.id] || [];
    const hasLikes = postLikes.length > 0;

    return (
        <div className="max-w-4xl mb-6 bg-white text-black dark:bg-[#0f0e12] dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm relative">
            {/* Post Header */}
            <PostHeader
                username={post.username}
                profilePicture={post.user_profile_picture || ''}
                location={post.location || ''}
                isMenuActive={isMenuActive}
                onMenuToggle={handleMenuClick}
                setShowReportModal={setShowReportModal}
                post={post}
                closeMenu={closeMenu}
                isFavorite={isFavorite(post.id.toString()   )}
                onGoToPost={handleGoToPostClick}
            />

            {/* Post Image */}
            <div className="flex justify-center p-4">
                <div className="w-[30rem] h-[35rem] relative">
                    <img
                        src={post.image_url}
                        alt={`Post by ${post.username}`}
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = PLACEHOLDER_IMAGES.POST_IMAGE;
                        }}
                    />
                </div>
            </div>

            {/* Interaction Buttons */}
            <PostActions
                post={post}
                isLiked={isLiked}
                isSaved={isSaved}
                isCommentActive={false} // This should be passed from parent
                onLike={handleLikeClick}
                onSave={handleSaveClick}
                onCommentToggle={handleCommentClick}
            />

            {/* Likes Count */}
            <div className="px-4 pb-2">
                <button
                    onClick={handleShowLikesClick}
                    className="font-bold cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    disabled={likesCount === 0}
                >
                    {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                </button>
            </div>

            {/* Liked By Section */}
            {hasLikes && (
                <div className="px-4 py-2">
                    <div className="flex items-center space-x-2">
                        {/* Show first user's profile picture */}
                        {postLikes[0] && (
                            <button
                                onClick={() => onUsernameClick(postLikes[0].username)}
                                className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity duration-200"
                            >
                                <img
                                    src={postLikes[0].profile_picture || PLACEHOLDER_IMAGES.USER_PROFILE}
                                    alt={postLikes[0].username}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </button>
                        )}
                        <div className="text-sm text-gray-900 dark:text-white">
                            Liked by{' '}
                            <button
                                onClick={() => onUsernameClick(postLikes[0].username)}
                                className="font-bold hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                            >
                                {postLikes[0].username}
                            </button>
                            {postLikes.length > 1 && (
                                <>
                                    {' '}and{' '}
                                    <button
                                        onClick={handleShowLikesClick}
                                        className="font-bold hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                                    >
                                        {postLikes.length - 1} others
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Caption Section */}
            <div className="px-4 pb-2">
                <span className="text-gray-900 dark:text-white">
                    <button
                        onClick={() => onUsernameClick(post.username)}
                        className="font-bold mr-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                        {post.username}
                    </button>
                    <span className="text-gray-800 dark:text-gray-200 break-words">
                        {post.caption}
                    </span>
                </span>
            </div>

            {/* View All Comments Button */}
            {post.comments && post.comments.length > 0 && (
                <div className="px-4 pb-2">
                    <button
                        onClick={onCommentToggle}
                        className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                        View all {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
                    </button>
                </div>
            )}

            {/* Timestamp */}
            <div className="px-4 pb-2">
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {post.time ? apiUtils.formatDate(post.time) : '1d ago'}
                </p>
            </div>
        </div>
    );
});

Post.displayName = 'Post';

export default Post;