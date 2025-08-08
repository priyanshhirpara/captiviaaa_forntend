import React from "react";

const StorySection = ({ userStories, onStoryClick }) => {
  // If no stories, don't render the section
  if (!userStories || userStories.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-xl mb-4 overflow-hidden">
      <div className="flex overflow-x-auto py-3 px-2 scrollbar-hide gap-4">
        {userStories.map((user, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center min-w-[80px]"
            onClick={() => onStoryClick(index)}
          >
            <div className="relative cursor-pointer">
              {/* Gradient border for story ring */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px] flex items-center justify-center">
                {/* Profile image */}
                <div className="w-[58px] h-[58px] rounded-full overflow-hidden bg-white">
                  <img 
                    src={user.profileImage} 
                    alt={user.username} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Time indicator - small dot below image if story is new */}
              {user.latestTime && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            
            {/* Username with time */}
            <div className="text-xs mt-1 truncate w-full text-center">
              {user.username}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {user.latestTime || ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorySection;