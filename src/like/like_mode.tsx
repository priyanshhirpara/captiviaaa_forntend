import React from 'react';

const LikesModal = ({ likesData, postId, onClose, onNavigateToProfile }: {
    likesData: Record<string, Array<{
        user_id: string;
        username: string;
        profile_picture: string;
    }>>,
    postId: string,
    onClose: () => void,
    onNavigateToProfile: (username: string) => void
}) => {
    if (!likesData || !postId) return null;

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-[9999] flex items-center justify-center">
            <div className="bg-white dark:bg-[#262626] rounded-lg max-w-md w-full max-h-[70vh] overflow-hidden z-10">
                <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
                    <h2 className="text-xl font-semibold">Likes</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                    >
                        ✕
                    </button>
                </div>
                <div className="overflow-y-auto max-h-[calc(70vh-64px)]">
                    {Array.isArray(likesData[postId]) ? (
                        likesData[postId].map((like) => (
                            <div
                                key={like.user_id}
                                className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700"
                            >
                                <div
                                    className="w-10 h-10 rounded-full overflow-hidden mr-3 cursor-pointer"
                                    onClick={() => onNavigateToProfile(like.username)}
                                >
                                    <img
                                        src={like.profile_picture}
                                        alt={like.username}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p
                                        className="font-semibold cursor-pointer"
                                        onClick={() => onNavigateToProfile(like.username)}
                                    >
                                        {like.username}
                                    </p>
                                </div>
                                <button className="bg-gray-200 dark:bg-gray-700 px-4 py-1 rounded text-sm font-medium">
                                    Following
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="p-4 text-gray-500 dark:text-gray-400">No likes available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LikesModal;