import React from "react";

const ReportModal = ({ onClose, onReport }: { onClose: () => void, onReport: (reason: string) => void }) => {

    const reportReasons = [
        "I just don't like it",
        "Bullying or unwanted contact",
        "Suicide, self-injury or eating disorders",
        "Violence, hate or exploitation",
        "Selling or promoting restricted items",
        "Nudity or sexual activity",
        "Scam, fraud or spam",
        "False information"
    ];

    const handleReasonSelect = (reason: string) => {
        onReport(reason);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-[9999] flex items-center justify-center">
            <div className="bg-white dark:bg-[#262626] rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-hidden z-10">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                    >
                        ✕
                    </button>
                    <h2 className="text-lg font-semibold">Report</h2>
                    <div className="w-6"></div> {/* Spacer for centering */}
                </div>

                {/* Content */}
                <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        Why are you reporting this post?
                    </p>

                    {/* Report Reasons */}
                    <div className="space-y-1">
                        {reportReasons.map((reason, index) => (
                            <div
                                key={index}
                                onClick={() => handleReasonSelect(reason)}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-lg transition-colors"
                            >
                                <span className="text-sm text-gray-800 dark:text-gray-200">{reason}</span>
                                <svg 
                                    className="w-4 h-4 text-gray-400" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportModal; 