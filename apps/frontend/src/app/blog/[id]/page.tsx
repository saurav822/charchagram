'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { BlogType, BlogDetailsResponse } from '@/types/blog';
import { LoadingSpinner } from '@/components/Loadingspinner';
import { timeAgo } from '@/utils/timeutil';
import CharchaManchBanner from '@/components/CharchaManchBanner';
import Share from "@/components/share";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MarkdownEditor } from '@/components/MarkdownEditor';


const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

export default function BlogDetailPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const blogId = params.id as string;
    const isEditMode = searchParams.get('edit') === 'true';

    const [blog, setBlog] = useState<BlogType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBlog = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`/api/blogs/${blogId}`);
            const data: BlogDetailsResponse = response.data;

            setBlog(data.blog);
        } catch (err: any) {
            console.error('Error fetching blog:', err);
            if (err.response?.status === 404) {
                setError('Blog not found');
            } else {
                setError(err.response?.data?.message || 'Failed to fetch blog');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (blogId) {
            fetchBlog();
        }
    }, [blogId, isEditMode]);

    const handleBackClick = () => {
        router.back();
    };

    const handleEditClick = () => {
        router.push(`/blog/edit/${blogId}`);
    };

    if (loading) {
        return (
            <div className={`min-h-screen bg-[#c1cbd1] flex flex-col`}>
                <div className="space-y-2.5 w-full px-4 py-2.5 lg:max-w-screen-md mx-auto">
                    <CharchaManchBanner blog={true}/>
                    <div className="flex w-full">
                        <div className="flex flex-col w-full mx-auto text-center min-h-[80vh] bg-white rounded-lg shadow-sm">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#273F4F] mx-auto mb-4 mt-10"></div>
                            <p className="text-gray-600">लोड हो रहा है...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen bg-[#c1cbd1] flex flex-col`}>
                <div className="space-y-2.5 w-full px-4 py-2.5 lg:max-w-screen-md mx-auto">
                    <CharchaManchBanner blog={true}/>
                    <div className="flex w-full">
                        <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md mx-auto">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <button
                                onClick={handleBackClick}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className={`min-h-screen bg-[#c1cbd1] flex flex-col`}>
                <div className="space-y-2.5 w-full px-4 py-2.5 lg:max-w-screen-md mx-auto">
                    <CharchaManchBanner blog={true}/>
                    <div className="flex w-full">
                        <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md mx-auto">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h2>
                            <p className="text-gray-600 mb-6">The blog you're looking for doesn't exist.</p>
                            <button
                                onClick={handleBackClick}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const ReadBlogComponent = ({ blog }: { blog: BlogType }) => {
        return (
            <div className="flex-grow w-full mb-4 lg:max-w-screen-md mx-auto">
                <main className="w-full">
                    <div className="bg-white h-full shadow-lg rounded-lg overflow-hidden px-4">
                        {/* Header */}
                        <div className=" py-2">

                            <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                                {blog.title}
                            </h1>

                            <div className="flex items-center justify-between text-gray-600">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                            {blog.author?.charAt(0).toUpperCase() || 'A'}
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-xs text-gray-900">
                                                {blog.author || 'Anonymous'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(blog.createdAt)}
                                            </p>
                                            <p>
                                                {blog.place}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Share
                                        url={window.location.href}
                                        pathname="../shareicon.svg"
                                    />

                                    {/* <div className="flex items-center space-x-4 text-sm">
                                            {blog.views && (
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    {blog.views} views
                                                </span>
                                            )}
                                        </div> */}

                                </div>


                            </div>
                        </div>

                        {/* Content */}
                        <div className=" py-4">
                            <div className="prose prose-lg max-w-none markdown-content">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {blog.content}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap">
                                {blog.tags && blog.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-0 mb-3">
                                        {blog.tags.map((tag, index) => (
                                            <span key={index} className=" px-1 postsection-tag-text">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        );
    };
    const EditBlogComponent = ({ blog }: { blog: BlogType }) => {
        const initialFormData = {
            title: blog.title,
            content: blog.content,
            author: blog.author,
            preview: blog.preview,
            place: blog.place,
            createdAt: blog.createdAt,
            tags: blog.tags?.join(', ') || '',
        }
        const [editFormData, setEditFormData] = useState(initialFormData);
        const [editLoading, setEditLoading] = useState(false);
        const [editError, setEditError] = useState<string | null>(null);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setEditFormData(prev => ({
                ...prev,
                [name]: value
            }));
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            setEditLoading(true);
            setEditError(null);

            try {
                const blogData = {
                    title: editFormData.title.trim(),
                    content: editFormData.content.trim(),
                    author: editFormData.author.trim(),
                    place: editFormData.place.trim(),
                    preview: editFormData.preview.trim(),
                    createdAt: editFormData.createdAt,
                    isUpdated: true,
                    tags: editFormData.tags ? editFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
                };

                const response = await axios.put(`/api/blogs/${blogId}`, blogData);

                if (response.data) {
                    router.push(`/blog/${blogId}`);
                }
            } catch (err: any) {
                console.error('Error updating blog:', err);
                setEditError(err.response?.data?.message || 'Failed to update blog');
            } finally {
                setEditLoading(false);

            }
        };

        return (
            <div className="flex-grow w-full mb-4 lg:max-w-screen-md mx-auto">
                <main className="w-full">
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Blog Post</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={editFormData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="preview" className="block text-sm font-medium text-gray-700 mb-2">
                                    Preview/Summary
                                </label>
                                <textarea
                                    id="preview"
                                    name="preview"
                                    value={editFormData.preview}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter a preview/summary..."
                                />
                            </div>

                            <div>
                                <label htmlFor="blogContent" className="block text-sm font-medium text-gray-700 mb-2">
                                    Content *
                                </label>
                                <div className="bg-gray-50 border border-gray-300 rounded-md p-4 min-h-[200px]">
                                    <MarkdownEditor value={editFormData.content} onChange={(value) => setEditFormData(prev => ({ ...prev, content: value || '' }))} />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700 mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    id="createdAt"
                                    name="createdAt"
                                    value={editFormData.createdAt.split('T')[0]}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    value={editFormData.tags}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., technology, programming, web development"
                                />
                            </div>

                            <div>
                                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                                    Author name
                                </label>
                                <input
                                    type="text"
                                    id="author"
                                    name="author"
                                    value={editFormData.author}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="author"
                                />
                            </div>

                            {editError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    {editError}
                                </div>
                            )}

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => router.push(`/blog/${blogId}`)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editLoading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {editLoading ? (
                                        <>
                                            <LoadingSpinner />
                                            <span className="ml-2">Updating...</span>
                                        </>
                                    ) : (
                                        'Update Blog'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        );
    }
    return (
        <div className={`min-h-screen bg-[#c1cbd1] flex flex-col`}>
            <div className="space-y-2.5 w-full px-4 py-2.5 lg:max-w-screen-md mx-auto">
                <CharchaManchBanner showBackButton={true} backpageUrl={'/blog/list'} blog={true} />
                {isEditMode ? <EditBlogComponent blog={blog as BlogType} /> : <ReadBlogComponent blog={blog as BlogType} />}

            </div>
        </div>
    );
}
