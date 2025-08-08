import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import StorySection from "../story/story_section";
import Post from "../post/post";
import StoryModal from "../story/story_model";
import CommentModal from "../comment/comment_model";
import LikesModal from "../like/like_mode";
import ReportModal from "../report/report_model";
import { usePosts, useComments, useAuth } from "../hooks";

const CenterContent = () => {
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    // Restructured stories data to group by user
    const [userStories, setUserStories] = useState([]);
    const [storyModalOpen, setStoryModalOpen] = useState(false);
    const [currentUserStoryIndex, setCurrentUserStoryIndex] = useState(0);
    const [activeMenuPostId, setActiveMenuPostId] = useState(null);
    const [showLikesModal, setShowLikesModal] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);

    const { currentUser } = useAuth();
    const {
        posts,
        likedPosts,
        savedPosts,
        likesData,
        handleLike,
        handleSave,
        fetchLikesData
    } = usePosts();
    const {
        commentText,
        activeCommentPostId,
        setActiveCommentPostId,
        handleCommentChange,
        handleCommentSubmit
    } = useComments(currentUser || undefined);

    // Fetch stories from API
    useEffect(() => {
        const fetchStories = async () => {
            try {
                const accessToken = Cookies.get("access_token");
                if (!accessToken) {
                    console.error("No access token found. Please log in.");
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/story-list/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch stories");
                }

                const stories = await response.json();
                
                // Group stories by username
                const storiesByUser: Record<string, any> = {};
                stories.forEach((story: any) => {
                    if (!storiesByUser[story.username]) {
                        storiesByUser[story.username] = {
                            username: story.username,
                            profileImage: story.profileImage,
                            latestTime: story.created_at,
                            stories: []
                        };
                    }
                    
                    storiesByUser[story.username].stories.push({
                        image: story.image,
                        postedTime: story.created_at,
                        caption: story.caption || "",
                        id: story.id
                    });
                });

                // Convert to array and sort by latest story time
                const groupedStories = Object.values(storiesByUser);
                setUserStories(groupedStories as any);
            } catch (error) {
                console.error("Error fetching stories:", error);
            }
        };

        fetchStories();
    }, [API_BASE_URL]);

    const handleStoryClick = (userIndex: number) => {
        setCurrentUserStoryIndex(userIndex);
        setStoryModalOpen(true);
    };

    const handleCloseStory = () => {
        setStoryModalOpen(false);
    };

    const handleShowLikes = async (postId: string) => {
        if (!likesData[postId]) {
            await fetchLikesData(postId);
        }
        setShowLikesModal(postId as any);
    };

    const handleNavigateToProfile = (username: string) => {
        window.location.href = `/profile/${username}`;
    };

    const handleCollaborator = async (postId: string) => {
        const accessToken = Cookies.get("access_token");
        if (!accessToken) {
            console.error("No access token found. Please log in.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/post/collaborator/?post_id=${postId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to add collaborator");
            }

            console.log("Collaborator added successfully");
        } catch (error) {
            console.error("Error adding collaborator:", error);
        }
    };

    const handleMenuToggle = (postId: string) => {
        if (activeMenuPostId === postId) {
            setActiveMenuPostId(null);
        } else {
            setActiveMenuPostId(postId as any);
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

    return (
        <div className="flex flex-col items-center min-h-screen py-6 w-full bg-[#FDFAF6] text-black dark:bg-[#0f0e12] dark:text-white">
            {/* Stories Section - now showing user thumbnails */}
            <StorySection userStories={userStories} onStoryClick={handleStoryClick}/>

            {/* Post Section */}
            {posts.map((post, index) => (
                <Post
                    key={index}
                    post={post}
                    isMenuActive={activeMenuPostId === post.id}
                    isLiked={likedPosts[post.id]}
                    isSaved={savedPosts[post.id]}
                    onLike={() => handleLike(post.id)}
                    onSave={() => handleSave(post.id)}
                    onCommentToggle={() => setActiveCommentPostId(post.id)}
                    onMenuToggle={() => handleMenuToggle(post.id)}
                    onCollaborator={() => handleCollaborator(post.id)}
                    onShowLikes={() => handleShowLikes(post.id)}
                    onUsernameClick={handleNavigateToProfile}
                    likesCount={likesData[post.id]?.length || 0}
                    likesData={likesData}
                    setShowReportModal={setShowReportModal}
                    closeMenu={() => setActiveMenuPostId(null)}
                    onGoToPost={handleGoToPost}
                />
            ))}

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
                    post={posts.find(p => p.id === activeCommentPostId)}
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
                    likesData={likesData}
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