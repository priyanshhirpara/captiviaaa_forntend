// Export all hooks for easy importing
export { useAuth } from './useAuth';
export { usePosts } from './usePosts';
export { useComments } from './useComments';
export { useFavorites } from './useFavorites';
export { useForgotPassword } from './useForgotPassword';
export { useFollowUnfollow } from './useFollowUnfollow';

// Export types
export type {
  User,
  LoginData,
  SignupData,
  PersonalInfoData,
} from './useAuth';

export type {
  Post,
  Comment,
  Like,
  UsePostsReturn,
} from './usePosts';

export type {
  UseCommentsReturn,
} from './useComments';

export type {
  UseFavoritesReturn,
} from './useFavorites';

export type {
  UseForgotPasswordReturn,
} from './useForgotPassword';

export type {
  UseFollowUnfollowReturn,
} from './useFollowUnfollow';
