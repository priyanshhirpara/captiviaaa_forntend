export interface UseSaveReturn {
    savedPosts: Record<string, boolean>;
    isSaved: (postId: string) => boolean;
    toggleSave: (postId: string) => Promise<boolean>;
    addToSaves: (postId: string) => Promise<boolean>;
    removeFromSaves: (postId: string) => Promise<boolean>;
  }