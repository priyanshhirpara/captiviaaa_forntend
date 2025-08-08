import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


const StoryModal = ({ allStories, initialUserIndex, onClose }) => {
    const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [replyText, setReplyText] = useState("");
    const [swipeDirection, setSwipeDirection] = useState(null);
    const [touchStart, setTouchStart] = useState(null);
    const progressInterval = useRef(null);
    const navigate = useNavigate();

    // Get current user and their stories
    const currentUser = allStories[currentUserIndex];
    const currentUserStories = currentUser?.stories || [];
    const currentStory = currentUserStories[currentStoryIndex];

    // Calculate previous and next user indices
    const prevUserIndex = currentUserIndex > 0 ? currentUserIndex - 1 : null;
    const nextUserIndex = currentUserIndex < allStories.length - 1 ? currentUserIndex + 1 : null;

    // Get previous and next users
    const prevUser = prevUserIndex !== null ? allStories[prevUserIndex] : null;
    const nextUser = nextUserIndex !== null ? allStories[nextUserIndex] : null;

    // Handle progress bar
    useEffect(() => {
        if (!isPaused) {
            setProgress(0);
            clearInterval(progressInterval.current);

            progressInterval.current = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval.current);
                        handleNext();
                        return 0;
                    }
                    return prev + 0.5;
                });
            }, 25); // 25ms * 200 steps = ~5 seconds
        }

        return () => clearInterval(progressInterval.current);
    }, [currentUserIndex, currentStoryIndex, isPaused]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowLeft") {
                handlePrevious();
            } else if (e.key === "ArrowRight") {
                handleNext();
            } else if (e.key === " ") { // Space bar
                togglePause();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentUserIndex, currentStoryIndex]);

    // Handle body scroll lock
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    const handlePrevious = () => {
        setSwipeDirection('right');
        setTimeout(() => setSwipeDirection(null), 300);

        // If there are previous stories in the current user's collection
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(currentStoryIndex - 1);
        }
        // Otherwise go to the previous user's last story
        else if (prevUserIndex !== null) {
            setCurrentUserIndex(prevUserIndex);
            setCurrentStoryIndex(allStories[prevUserIndex].stories.length - 1);
        }
    };

    const handleNext = () => {
        setSwipeDirection('left');
        setTimeout(() => setSwipeDirection(null), 300);

        // If there are more stories in the current user's collection
        if (currentStoryIndex < currentUserStories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
        }
        // Otherwise go to the next user's first story
        else if (nextUserIndex !== null) {
            setCurrentUserIndex(nextUserIndex);
            setCurrentStoryIndex(0);
        } else {
            // If no more users, close the modal
            onClose();
        }
    };

    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    const handleReplySubmit = () => {
        // Add reply functionality here
        console.log(`Reply to ${currentUser.username}: ${replyText}`);
        setReplyText("");
    };

    const jumpToUser = (userIndex) => {
        if (userIndex < currentUserIndex) {
            setSwipeDirection('right');
        } else {
            setSwipeDirection('left');
        }
        setTimeout(() => setSwipeDirection(null), 300);

        setCurrentUserIndex(userIndex);
        setCurrentStoryIndex(0);
    };

    // Touch event handlers for swipe
    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        if (!touchStart) return;

        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;

        // Threshold of 50px for swipe
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe left, go to next
                handleNext();
            } else {
                // Swipe right, go to previous
                handlePrevious();
            }
        }

        setTouchStart(null);
    };

    // Long press handler for pausing
    const handleTouchMove = (e) => {
        e.preventDefault(); // Prevent screen from scrolling
    };
    const handleInstagramClick = () => {
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 bg-[#0f0e12] text-white z-[9999] flex flex-col items-center justify-center">
            <h1
                className="text-2xl h-20 w-36 font-bold cursor-pointer flex items-center justify-center font-serif"
                onClick={handleInstagramClick}
            >
                New-social
            </h1>
            <div
                className="relative w-full h-full md:w-[400px] md:h-[90vh] max-w-md"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
            >
                {/* Story progress bar */}
                <div className="absolute top-0 left-0 right-0 z-10 p-2 flex gap-1">
                    {currentUserStories.map((_, idx) => (
                        <div key={idx} className="h-1 bg-gray-500 bg-opacity-50 flex-grow rounded-full overflow-hidden">
                            {idx === currentStoryIndex && (
                                <div
                                    className="h-full bg-white rounded-full"
                                    style={{
                                        width: `${progress}%`,
                                        transition: isPaused ? 'none' : 'width linear'
                                    }}
                                />
                            )}
                            {idx < currentStoryIndex && (
                                <div className="h-full bg-white rounded-full w-full" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Header with user info */}
                <div className="absolute top-4 left-0 right-0 z-10 px-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white">
                            <img
                                src={currentUser.profileImage || "https://via.placeholder.com/40"}
                                alt={currentUser.username}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold">{currentUser.username}</p>
                            <p className="text-xs opacity-80">{currentStory.postedTime}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={togglePause}
                            className="text-white focus:outline-none"
                            aria-label={isPaused ? "Play story" : "Pause story"}
                        >
                            {isPaused ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="text-white focus:outline-none"
                            aria-label="Close stories"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Story Content */}
                <div className="w-full h-full overflow-hidden rounded-lg">
                    <div className={`w-full h-full ${swipeDirection ? `swipe-${swipeDirection}` : 'story-appear'}`}>
                        <img
                            src={currentStory.image}
                            alt="Story content"
                            className="w-full h-full object-cover"
                        />
                        {currentStory.caption && (
                            <div className="absolute bottom-20 left-0 right-0 p-4 text-white text-center">
                                <p className="text-lg">{currentStory.caption}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Touch areas for navigation (invisible but functional) */}
                <button
                    onClick={handlePrevious}
                    className="absolute left-0 top-0 bottom-0 w-1/3 opacity-0"
                    aria-label="Previous story"
                />

                <button
                    onClick={handleNext}
                    className="absolute right-0 top-0 bottom-0 w-1/3 opacity-0"
                    aria-label="Next story"
                />

                {/* Visual indication of adjacent stories on mobile */}
                {prevUser && (
                    <div className="absolute left-0 top-1/2 h-12 w-4 -translate-y-1/2 bg-white bg-opacity-10 rounded-r md:hidden">
                        <span className="absolute inset-0 flex items-center justify-center text-white text-lg">
                            &lsaquo;
                        </span>
                    </div>
                )}

                {nextUser && (
                    <div className="absolute right-0 top-1/2 h-12 w-4 -translate-y-1/2 bg-white bg-opacity-10 rounded-l md:hidden">
                        <span className="absolute inset-0 flex items-center justify-center text-white text-lg">
                            &rsaquo;
                        </span>
                    </div>
                )}

                {/* Reply Input */}
                <div className="absolute bottom-5    left-0 right-0 px-4">
                    <div className="flex bg-[#FDFAF6] text-black dark:bg-[#0f0e12] dark:text-white bg-opacity-10 rounded-full overflow-hidden backdrop-blur-sm">
                        <input
                            type="text"
                            placeholder={`Reply to ${currentUser.username}...`}
                            value={replyText}
                            onChange={handleReplyChange}
                            className="flex-grow bg-transparent px-4 py-3 text-white outline-none"
                        />
                        <button
                            onClick={handleReplySubmit}
                            className="px-4 text-white font-bold"
                            aria-label="Send reply"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile indicator of position in sequence */}
                <div className="absolute bottom-4 left-0 right-0 md:hidden">
                    <div className="flex justify-center gap-1">
                        {allStories.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full ${idx === currentUserIndex ? 'bg-white' : 'bg-white bg-opacity-30'}`}
                                onClick={() => jumpToUser(idx)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoryModal;