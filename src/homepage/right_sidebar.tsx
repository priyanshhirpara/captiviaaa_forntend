import React, { memo } from 'react';

const RightSidebar: React.FC = memo(() => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Suggested for you
      </h3>
      <div className="space-y-4">
        {/* Placeholder content */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">suggested_user_1</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Followed by user123</p>
          </div>
          <button className="text-xs text-blue-500 font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
            Follow
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">suggested_user_2</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Followed by user456</p>
          </div>
          <button className="text-xs text-blue-500 font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
            Follow
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">suggested_user_3</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">New to Instagram</p>
          </div>
          <button className="text-xs text-blue-500 font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
});

RightSidebar.displayName = 'RightSidebar';

export default RightSidebar;
