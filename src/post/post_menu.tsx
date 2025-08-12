import React, { useEffect, useRef } from "react";
import useFavorites from "../hooks/useFavorites";
import { useFollowUnfollow } from "../hooks/useFollowUnfollow";

const PostMenu = ({ setShowReportModal, post, closeMenu, onGoToPost }: { setShowReportModal: (show: boolean) => void, post: any, closeMenu: () => void, onGoToPost: (postId: string) => void }) => {
    const { toggleFavorite, isFavorite } = useFavorites();
    const { unfollowUser } = useFollowUnfollow();
    const menuRef = useRef(null);

    // Handle click outside to close menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !(menuRef.current as HTMLElement).contains(event.target as Node)) {
                closeMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeMenu]);

    const handleUnfollow = async () => {
        unfollowUser(post.created_by);
        closeMenu();
    };

    const handleFavoriteToggle = async () => {
        await toggleFavorite(post.id);
        closeMenu();
    };

    const handleCancel = () => {
        closeMenu();
    };

    const handleGoToPost = () => {
        if (onGoToPost) {
            onGoToPost(post.id);
        }
        closeMenu();
    };

    const isPostFavorite = isFavorite(post.id);

    return (
        <div ref={menuRef} className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#1a1922] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto transform -translate-y-1">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-300">
                <li onClick={() => setShowReportModal(true)} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Report</li>
                <li onClick={handleUnfollow} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Unfollow</li>
                <li onClick={async () => {
                    await handleFavoriteToggle();
                    window.location.reload();
                }} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    {isPostFavorite ? "Remove from favorites" : "Add to favorites"}
                </li>
                <li onClick={handleGoToPost} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Go to post</li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Share to...</li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Copy link</li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Embed</li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">About this account</li>
                <li onClick={handleCancel} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Cancel</li>
            </ul>
        </div>
    );
};

export default PostMenu;