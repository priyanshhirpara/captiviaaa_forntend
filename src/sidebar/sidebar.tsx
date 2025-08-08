import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    FaHome,
    FaSearch,
    FaComments,
    FaBell,
    FaPlusCircle,
    FaUser,
} from "react-icons/fa";
import { MdOutlineMoreVert, MdOutlineWbSunny } from "react-icons/md";
import { FaAngleLeft } from "react-icons/fa6";
import {
    FiSettings,
    FiActivity,
    FiBookmark,
    FiAlertCircle,
    FiMessageCircle,
    FiLogOut,
} from "react-icons/fi";
import { Compass } from "lucide-react";
import { Switch } from "@headlessui/react";
import Cookies from "js-cookie";

const Sidebar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
    const [showInstagramText, setShowInstagramText] = useState(true);
    const [isAppearanceBoxOpen, setIsAppearanceBoxOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const navigate = useNavigate();
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const darkModeSetting = localStorage.getItem("darkMode") === "true";
        setDarkMode(darkModeSetting);
        document.documentElement.classList.toggle("dark", darkModeSetting);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("darkMode", darkMode.toString());
    }, [darkMode]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
                setIsNotificationOpen(false);
                setIsMoreOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchNotifications = async () => {
        setIsLoadingNotifications(true);
        setError(null);

        const accessToken = Cookies.get("access_token");
        if (!accessToken) {
            console.error("No access token found. Please log in.");
            setError("Authentication required. Please log in.");
            setIsLoadingNotifications(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/notification/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            // Parse the JSON response correctly
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setError("Failed to load notifications. Please try again later.");
        } finally {
            setIsLoadingNotifications(false);
        }
    };

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() === "") {
            setSearchResults([]);
            return;
        }

        setIsLoadingSearch(true);
        setSearchError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/search-user/?query=${query}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            if (Array.isArray(data.suggestions)) {
                setSearchResults(data.suggestions.map((username: string) => ({ username })));
            } else if (data.username) {
                setSearchResults([data]); // Full user information
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchError("Failed to fetch search results. Please try again.");
        } finally {
            setIsLoadingSearch(false);
        }
    };

    const navigateToProfile = (username: string) => {
        navigate(`/profile/${username}`);
        setIsSearchOpen(false);
        setSearchQuery("");
    };

    const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode);

    const handleLogout = () => {
        Cookies.remove("access_token");
        navigate("/");
    };

    const handleCreateClick = () => {
        setIsCreateMenuOpen(!isCreateMenuOpen);
        setIsSearchOpen(false);
        setIsNotificationOpen(false);
        setIsMoreOpen(false);
    };

    const handleCreatePost = () => {
        navigate('/create');
        setIsCreateMenuOpen(false);
    };

    const handleCreateStory = () => {
        navigate('/create/story');
        setIsCreateMenuOpen(false);
    };

    const menuItems = [
        { icon: <FaHome className="w-9 h-9 my-2" />, label: "Home", path: "/homepage" },
        { icon: <FaSearch className="w-9 h-9 my-2" />, label: "Search", action: () => handleSearchClick() },
        { icon: <Compass className="w-9 h-9 my-2" />, label: "Explore", path: "/explore" },
        // { icon: <FaVideo className="w-9 h-9 my-2" />, label: "Reels", path: "/reels" },
        { icon: <FaComments className="w-9 h-9 my-2" />, label: "Messages", path: "/messages" },
        { icon: <FaBell className="w-9 h-9 my-2" />, label: "Notifications", action: () => handleNotificationClick() },
        { icon: <FaPlusCircle className="w-9 h-9" />, label: "Create", action: () => handleCreateClick() },
        { icon: <FaUser className="w-9 h-9" />, label: "Profile", path: "/profile" },
        { icon: <MdOutlineMoreVert className="w-9 h-9 my-2 mx-auto" />, label: "More", action: () => handleMoreClick() },
    ];

    const handleNavigation = (item: any) => navigate(item.path || "/homepage");

    const handleInstagramClick = () => navigate("/homepage");

    const handleSearchClick = () => {
        setShowInstagramText(false);
        setIsSearchOpen(!isSearchOpen);
        setIsNotificationOpen(false);
        setIsMoreOpen(false);
    };

    const handleNotificationClick = () => {
        setShowInstagramText(false);
        setIsNotificationOpen(!isNotificationOpen);
        setIsSearchOpen(false);
        setIsMoreOpen(false);

        // Fetch notifications when the notifications panel is opened
        if (!isNotificationOpen) {
            fetchNotifications();
        }
    };

    const handleMoreClick = () => {
        setIsMoreOpen(!isMoreOpen);
        setIsSearchOpen(false);
        setIsNotificationOpen(false);
    };

    const handleCloseMenu = () => setIsMoreOpen(false);

    // Format date for better readability
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-[#FDFAF6] text-black dark:bg-[#161519] dark:text-white">
            <div
                ref={sidebarRef}
                className={`hidden md:block ${isSearchOpen || isNotificationOpen ? "w-[80px]" : "w-[240px]"} h-full pl-4 pr-16 shadow-md fixed top-0 left-0 bg-[#FDFAF6] text-black dark:bg-[#101013] dark:text-white z-50`}
            >
                {showInstagramText ? (
                    <h1
                        className="text-2xl h-20 w-36 font-bold cursor-pointer flex items-center justify-center font-serif"
                        onClick={handleInstagramClick}
                    >
                        New-social
                    </h1>
                ) : (
                    <FaUser className="w-8 h-8 cursor-pointer mb-3" onClick={handleInstagramClick} />
                )}

                <ul className="space-y-4">
                    {menuItems.map((item, index) => (
                        <li
                            key={index}
                            onClick={item.action || (() => handleNavigation(item))}
                            className="flex items-center text-lg space-x-2 hover:text-blue-500 cursor-pointer"
                        >
                            <span>{item.icon}</span>
                            {!isSearchOpen && !isNotificationOpen && <span>{item.label}</span>}
                        </li>
                    ))}
                </ul>

                {isSearchOpen && (
                    <div className="absolute top-0 left-full w-96 h-full shadow-2xl flex flex-col p-4 z-10 bg-white text-black dark:bg-[#121212] dark:text-white">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Search</h2>
                            <button className="text-red-500 text-sm" onClick={() => setIsSearchOpen(false)}>
                                ✖
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Search usernames"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full p-2 text-lg rounded-xl bg-[#FDFAF6] text-black dark:bg-[#31363F] dark:text-white"
                        />
                        {isLoadingSearch ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"></div>
                            </div>
                        ) : searchError ? (
                            <div className="text-red-500 p-4 text-center">{searchError}</div>
                        ) : (
                            <ul className="space-y-4 mt-4">
                                {searchResults.length > 0 ? (
                                    searchResults.map((result, index) => (
                                        <li
                                            key={index}
                                            className="p-3 rounded-lg bg-gray-100 dark:bg-[#1e1e1e] cursor-pointer hover:bg-gray-200 dark:hover:bg-[#2a2a2a]"
                                            onClick={() => navigateToProfile(result.username)}
                                        >
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center mr-3">
                                                    {result.username ? result.username.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{result.username}</p>
                                                    {result.fullname && <p className="text-sm text-gray-500 dark:text-gray-400">{result.fullname}</p>}
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ) : searchQuery.trim() !== "" ? (
                                    <p className="text-gray-500 text-center py-4">No results found.</p>
                                ) : null}
                            </ul>
                        )}
                    </div>
                )}

                {isNotificationOpen && (
                    <div className="absolute top-0 left-full w-96 h-full shadow-2xl flex flex-col p-4 z-10 bg-white text-black dark:bg-[#121212] dark:text-white">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Notifications</h2>
                            <button className="text-red-500 text-sm font-bold" onClick={() => setIsNotificationOpen(false)}>
                                ✖
                            </button>
                        </div>

                        {isLoadingNotifications ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"></div>
                            </div>
                        ) : error ? (
                            <div className="text-red-500 p-4 text-center">{error}</div>
                        ) : (
                            <ul className="space-y-4">
                                {notifications && notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <li
                                            key={notification.id}
                                            className={`p-3 rounded-lg ${notification.is_read ? "bg-gray-100 dark:bg-[#1e1e1e]" : ""
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center mr-3">
                                                    {notification.sender_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">
                                                        <span
                                                            className="font-bold cursor-pointer hover:underline"
                                                            onClick={() => {
                                                                navigateToProfile(notification.sender_name);
                                                                setIsNotificationOpen(false);
                                                            }}
                                                        >
                                                            {notification.sender_name}
                                                        </span> {notification.action}
                                                    </p>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {formatDate(notification.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No notifications available.</p>
                                )}
                            </ul>
                        )}
                    </div>
                )}

                {isMoreOpen && (
                    <div className="absolute bottom-0 ml-5 w-60 h-[575px] shadow-2xl border-2 rounded-2xl flex flex-col p-4 z-10 bg-white text-black dark:bg-[#161519] dark:text-white">
                        <ul className="space-y-4">
                            <li className="flex items-center hover:text-blue-500 cursor-pointer" onClick={handleCloseMenu}>
                                <Link to="/settings" className="flex items-center w-full">
                                    <FiSettings className="w-6 h-6 mr-3 my-2" /> <span>Settings</span>
                                </Link>
                            </li>
                            <li className="flex items-center hover:text-blue-500 cursor-pointer" onClick={handleCloseMenu}>
                                <FiActivity className="w-6 h-6 mr-3 my-2" /> <span>Your Activity</span>
                            </li>
                            <li className="flex items-center hover:text-blue-500 cursor-pointer" onClick={handleCloseMenu}>
                                <FiBookmark className="w-6 h-6 mr-3 my-2" /> <span>Saved</span>
                            </li>
                            <li className="flex items-center hover:text-blue-500 cursor-pointer" onClick={() => {
                                setIsAppearanceBoxOpen(true);
                                handleCloseMenu();
                            }}>
                                <MdOutlineWbSunny className="w-6 h-6 mr-3 my-2" /> <span>Switch Appearance</span>
                            </li>
                            <li className="flex items-center hover:text-blue-500 cursor-pointer" onClick={handleCloseMenu}>
                                <FiAlertCircle className="w-6 h-6 mr-3 my-2" /> <span>Report a Problem</span>
                            </li>
                            <li className="flex items-center hover:text-blue-500 cursor-pointer" onClick={handleCloseMenu}>
                                <FiMessageCircle className="w-6 h-6 mr-3 my-4" /> <span>Threads</span>
                            </li>
                            <li className="flex items-center hover:text-blue-500 cursor-pointer" onClick={handleCloseMenu}>
                                <FiSettings className="w-6 h-6 mr-3 my-4" /> <span>Switch Accounts</span>
                            </li>
                            <li
                                className="flex items-center hover:text-blue-500 cursor-pointer"
                                onClick={() => {
                                    handleLogout();
                                    handleCloseMenu();
                                }}
                            >
                                <FiLogOut className="w-6 h-6 mr-3 my-4" /> <span>Log Out</span>
                            </li>
                        </ul>
                    </div>
                )}

                {isAppearanceBoxOpen && (
                    <div className={`absolute bottom-0 ml-1 ${darkMode ? "bg-[#161519]" : "bg-white"} w-64 shadow-2xl border-2 rounded-2xl flex flex-col my-14 p-4 z-10`}>
                        <div className="flex flex-row mt-1 items-center justify-between font-bold text-xl mb-4">
                            <FaAngleLeft className="p-1 hover:bg-gray-200 hover:dark:bg-gray-700 rounded-full cursor-pointer" onClick={() => setIsAppearanceBoxOpen(false)} />
                            <span className="text-base mr-8 font-semibold">Switch Appearance</span>
                            <MdOutlineWbSunny className="w-6 h-6" />
                        </div>
                        <hr className="mt-2 dark:border-gray-700" />
                        <div className="flex items-center mt-5 justify-between">
                            <span>Dark Mode</span>
                            <Switch
                                checked={darkMode}
                                onChange={toggleDarkMode}
                                className={`${darkMode ? "bg-blue-600" : "bg-gray-200"} relative inline-flex items-center h-6 rounded-full w-11`}
                            >
                                <span className="sr-only">Enable dark mode</span>
                                <span
                                    className={`${darkMode ? "translate-x-6" : "translate-x-1"} inline-block w-4 h-4 transform bg-white rounded-full`}
                                />
                            </Switch>
                        </div>
                    </div>
                )}

                {isCreateMenuOpen && (
                    <div className="absolute bottom-0 ml-5 w-60 shadow-2xl border-2 rounded-2xl flex flex-col p-4 z-10 bg-white text-black dark:bg-[#161519] dark:text-white">
                        <ul className="space-y-4">
                            <li
                                className="flex items-center hover:text-blue-500 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                onClick={handleCreatePost}
                            >
                                <span className="mr-3">📝</span>
                                <span>Create Post</span>
                            </li>
                            <li
                                className="flex items-center hover:text-blue-500 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                onClick={handleCreateStory}
                            >
                                <span className="mr-3">📱</span>
                                <span>Create Story</span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#161519] shadow-md p-2">
                <ul className="flex justify-around">
                    {menuItems.map((item, index) => (
                        <li
                            key={index}
                            onClick={item.action || (() => handleNavigation(item))}
                            className="flex items-center text-lg hover:text-blue-500 cursor-pointer"
                        >
                            <span>{item.icon}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;