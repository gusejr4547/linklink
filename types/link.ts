export interface Link {
  id: string;
  user_id: string;
  url: string;
  title: string;
  thumbnail_url: string | null;
  description: string | null;
  tags: string[];
  memo: string | null;
  is_read: boolean;
  is_favorite: boolean;
  created_at: string;
}

export interface CreateLinkInput {
  url: string;
  title: string;
  thumbnail_url?: string | null;
  description?: string | null;
  tags?: string[];
  memo?: string | null;
}

export interface LinkMetadata {
  title: string;
  description: string | null;
  thumbnail_url: string | null;
}

export interface LinkFilter {
  searchQuery?: string;
  selectedTags?: string[];
  readStatus?: "all" | "read" | "unread";
  favoriteOnly?: boolean;
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
