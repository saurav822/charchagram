/**
 * Blog domain types.
 *
 * Blogs are long-form editorial content written by citizens or admins.
 * Unlike Posts (which are constituency-scoped), blogs are platform-wide
 * and support rich markdown content.
 */

/** Full blog shape as returned by the API. */
export interface BlogType {
  _id: string;
  title: string;
  content: string;
  author: string;
  place: string;
  comments: unknown[];
  commentCount: number;
  views: number;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  preview: string;
  slug: string;
  __v: number;
  like: string[];
  dislike: string[];
}

/** Paginated blog list response from GET /api/blogs */
export interface BlogResponse {
  blogs: BlogType[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

/** Single blog fetch response from GET /api/blogs/:id */
export interface BlogDetailsResponse {
  message: string;
  blog: BlogType;
}

/** Request body for POST /api/blogs */
export interface CreateBlogRequest {
  title: string;
  content: string;
  preview: string;
  createdAt: string;
  place: string;
  /** MongoDB ObjectId of the authoring user */
  author: string;
  tags?: string[];
}
