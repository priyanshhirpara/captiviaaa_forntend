// Post Types - Consolidated from all post-related components and hooks

// Main Post Interface
export interface Post {
  id: number | string;
  username: string;
  post_type: string;
  image_url: string;
  created_at: number | string;
  time?: string;
  location: string | null;
  likes: number;
  user_profile_picture?: string;
  caption: string | null;
  comments: Comment[];
  saves?: number;
  collaborators?: string[];
  created_by?: string;
}

// Comment Interface
export interface Comment {
  id: string | number;
  text: string;
  content?: string;
  username: string;
  user_profile_picture: string;
  created_at: string;
  user_id?: string;
  post_id?: string;
}

// Story Interface
export interface Story {
  image: string;
  postedTime: string;
  caption: string;
  id: string;
}

// User Stories Interface
export interface UserStories {
  username: string;
  profileImage: string;
  latestTime: string;
  stories: Story[];
}

// Post Grid Props Interface
export interface PostGridProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

// Post Grid Item Props Interface
export interface PostGridItemProps {
  post: Post;
  onClick: () => void;
}

// Post Props Interface
export interface PostProps {
  post: Post;
}

// Use Posts Return Interface
export interface UsePostsReturn {
  posts: Post[];
  isLoading: boolean;
  hasMore: boolean;
  likedPosts: Record<string, boolean>;
  savedPosts: Record<string, boolean>;
  likesData: Record<string, any[]>;
  fetchUserPosts: (reset?: boolean) => Promise<void>;
  fetchMorePosts: () => Promise<void>;
  handleLike: (postId: string) => Promise<void>;
  handleSave: (postId: string) => Promise<void>;
  handleCollaborator: (postId: string) => Promise<void>;
  fetchLikesData: (postId: string) => Promise<void>;
}

// Use Comments Return Interface
export interface UseCommentsReturn {
  commentText: string;
  activeCommentPostId: string | null;
  setActiveCommentPostId: (postId: string | null) => void;
  handleCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCommentSubmit: (postId: string) => Promise<Comment | null>;
  postComment: (postId: string, commentText: string, username: string, profilePicture: string) => Promise<Comment | null>;
}

// Use Story Return Interface
export interface UseStoryReturn {
  userStories: UserStories[];
  fetchStories: () => Promise<void>;
}

// API Post Data Interface (for transformation)
export interface ApiPostData {
  id: number;
  username: string;
  post_type?: string;
  image_url: string;
  created_at?: string;
  location?: string;
  likes?: number;
  user_profile_picture?: string;
  caption?: string;
  saves?: number;
  created_by?: string;
  comments?: Array<{
    id: number;
    text: string;
    username: string;
    user_profile_picture: string;
    created_at: string;
  }>;
}

// Story API Data Interface
export interface StoryApiData {
  username: string;
  profileImage: string;
  created_at: string;
  image: string;
  caption?: string;
  id: string;
}

// Post Detail Props Interface
export interface PostDetailProps {
  post: Post;
  onClose: () => void;
  API_BASE_URL: string;
}

// Current User Interface (for post detail)
export interface CurrentUser {
  id: string;
  username: string;
  fullname: string;
  email: string;
  phone_number: string | null;
  is_admin: boolean;
  is_active: boolean;
  is_banned: boolean;
  personal_information: {
    id: string;
    user_id: string;
    user_info: string | null;
    profile_picture: string;
    bio: string | null;
    website: string | null;
    gender: string;
    date_of_birth: string | null;
    is_private: boolean;
  };
}
