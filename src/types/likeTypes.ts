export interface LikeUser {
    id: string;
    username: string;
    fullname: string;
    profile_picture?: string;
}

export interface UseLikeReturn {
    isLiked: boolean;
    likesCount: number;
    likedByUsers: LikeUser[];
    loadingLikedBy: boolean;
    showLikedBy: boolean;
    setIsLiked: (liked: boolean) => void;
    setLikesCount: (count: number) => void;
    setShowLikedBy: (show: boolean) => void;
    handleLikeToggle: () => Promise<void>;
    fetchLikedByUsers: () => Promise<void>;
    toggleLikedBy: () => void;
}