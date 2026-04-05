import { UserInfo } from "./user";

export interface BlogType {
    _id: string;
    title: string;
    content: string;
    author: string;
    place: string;
    comments: any[];
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

export interface BlogDetailsResponse {
    message: string;
    blog: BlogType;
}

export interface CreateBlogRequest {
    title: string;
    content: string;
    preview: string;
    createdAt: string;
    place: string;
    author: string; // author ID
    tags?: string[];
}
