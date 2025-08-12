import React, { useState } from "react";
import StorySection from "../story/story_section";
import Post from "../post/post";
import StoryModal from "../story/story_model";
import CommentModal from "../comment/comment_model";
import LikesModal from "../like/like_mode";
import ReportModal from "../report/report_model";
import { usePosts } from "../hooks/usePosts";
import { useComments } from "../hooks/useComments";
import { useAuth } from "../hooks/useAuth";
import { useStory } from "../hooks/useStory";

const CenterContent = () => {
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [currentUserStoryIndex, setCurrentUserStoryIndex] = useState(0);
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [showLikesModal, setShowLikesModal] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const { currentUser } = useAuth();
  const { 
    posts,
    likedPosts,
    savedPosts,
    likesData,
    hasMore,
    isLoading,
    handleLike,
    handleSave,
    handleCollaborator,
    fetchMorePosts
   } = usePosts();
  const {
    commentText,
    activeCommentPostId,
    setActiveCommentPostId,
    handleCommentChange,
    handleCommentSubmit,
  } = useComments(currentUser || undefined);
  const { userStories } = useStory();

  const handleStoryClick = (userIndex: number) => {
    setCurrentUserStoryIndex(userIndex);
    setStoryModalOpen(true);
  };

  const handleCloseStory = () => {
    setStoryModalOpen(false);
  };

  const handleShowLikes = async (postId: string) => {
    setShowLikesModal(postId);
  };

  const handleNavigateToProfile = (username: string) => {
    window.location.href = `/profile/${username}`;
  };

  const handleMenuToggle = (postId: string) => {
    if (activeMenuPostId === postId) {
      setActiveMenuPostId(null);
    } else {
      setActiveMenuPostId(postId);
    }
  };

  const handleReport = (reason: string) => {
    // Handle the report logic here
    console.log("Report submitted:", reason);
    // You can add API call to submit the report
  };

  const handleGoToPost = (postId: string) => {
    setActiveCommentPostId(postId);
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchMorePosts();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-6 w-full bg-[#FDFAF6] text-black dark:bg-[#0f0e12] dark:text-white">
      {/* Stories Section - now showing user thumbnails */}
      <StorySection userStories={userStories} onStoryClick={handleStoryClick} />

      {/* Post Section */}
      {posts.map((post, index) => (
          <Post
              key={index}
              post={post}
              isMenuActive={activeMenuPostId === post.id}
              isLiked={likedPosts[post.id]}
              isSaved={savedPosts[post.id]}
              onLike={() => handleLike(post.id.toString())}
              onSave={() => handleSave(post.id.toString())}
              onCommentToggle={() => setActiveCommentPostId(post.id.toString())}
                onMenuToggle={() => handleMenuToggle(post.id.toString())}
              onCollaborator={() => handleCollaborator(post.id.toString())}
              onShowLikes={() => handleShowLikes(post.id.toString())}
              onUsernameClick={handleNavigateToProfile}
              likesCount={likesData[post.id]?.length || 0}
              likesData={likesData}
              setShowReportModal={setShowReportModal}
              closeMenu={() => setActiveMenuPostId(null)}
              onGoToPost={handleGoToPost}
          />
      ))}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-6 mb-6">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Load More Posts"}
          </button>
        </div>
      )}

      {/* Story Modal - now passing all users and stories */}
      {storyModalOpen && (
        <StoryModal
          allStories={userStories}
          initialUserIndex={currentUserStoryIndex}
          onClose={handleCloseStory}
        />
      )}

      {/* Comment Modal */}
      {activeCommentPostId && (
        <CommentModal
          post={posts.find((p) => p.id.toString() === activeCommentPostId)}
          commentText={commentText}
          onCommentChange={handleCommentChange}
          onCommentSubmit={() => handleCommentSubmit(activeCommentPostId)}
          onClose={() => setActiveCommentPostId(null)}
          currentUser={currentUser}
        />
      )}

      {/* Likes Modal */}
      {showLikesModal && (
        <LikesModal
          likesData={{ [showLikesModal]: likesData[showLikesModal] || [] }}
          postId={showLikesModal}
          onClose={() => setShowLikesModal(null)}
          onNavigateToProfile={handleNavigateToProfile}
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          onReport={handleReport}
        />
      )}
    </div>
  );
};

export default CenterContent;
