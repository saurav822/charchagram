/**
 * Post and Comment domain types.
 *
 * Posts are the primary content unit — citizens raise concerns, share
 * news, or create polls within their constituency.  Comments create
 * threaded discussion beneath each post.
 */

import type { CategoryInfo } from './category';
import type { ConstituencyInfo } from './constituency';
import type { UserInfo, UserInfoWithConstituency } from './user';

/** A single poll option within a post. */
export interface PollOption {
  _id: string;
  label: string;
  /** Array of user IDs who voted for this option. */
  votes: string[];
  percentage: number;
}

/** Full post shape as returned by the API. */
export interface PostType {
  _id: string;
  title: string;
  description: string;
  content: string;
  author: UserInfo;
  views: number;
  comments: CommentType[];
  commentCount: number;
  link?: string;
  /** Array of user IDs who liked the post. */
  like: string[];
  /** Array of user IDs who disliked the post. */
  dislike: string[];
  constituency: ConstituencyInfo;
  category: CategoryInfo;
  createdAt: string;
  isEdited: boolean;
  updatedAt: string;
  __v: number;
  tags?: string[];
  pollOptions?: PollOption[];
  totalVotes?: number;
}

/** Paginated posts list response from GET /api/posts */
export interface PostsResponse {
  message: string;
  data: {
    paginatedPosts: PostType[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalPosts: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
    };
  };
}

/** Single post fetch response from GET /api/posts/:id */
export interface PostDetailsResponse {
  message: string;
  post: PostType;
}

/** A comment on a post (top-level or nested). */
export interface CommentType {
  _id: string;
  post: string;
  user: UserInfoWithConstituency;
  constituency?: string;
  parentComment?: string | null;
  replies?: string[];
  content: string;
  like?: string[];
  dislike?: string[];
  replyCount?: number;
  createdAt: string;
  updatedAt?: string;
  __v: number;
}

/** A comment with its populated replies array. */
export interface CommentReplyType {
  _id: string;
  post: string;
  user: UserInfo;
  constituency: string;
  parentComment: string | null;
  replies: CommentType[];
  content: string;
  like: string[];
  dislike: string[];
  replyCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/** Single comment/reply fetch response. */
export interface ReplyDetailsResponse {
  message: string;
  comment: CommentReplyType;
}
