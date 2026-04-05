'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { CreateBlogRequest } from '@/types/blog';
import { useUser } from '@/contexts/UserContext';
import { LoadingSpinner } from '@/components/Loadingspinner';
import NewModalLogin from '@/components/newModalLogin';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import CharchaManchBanner from '@/components/CharchaManchBanner';

export default function CreateBlogPage() {
    const { user } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        blogContent: '',
        preview: '',
        place: '',
        createdAt: '',
        tags: '',
        authorName: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // if (!user) {
        //     setShowAuthModal(true);
        //     return;
        // }

         if (!formData.title.trim() || !formData.blogContent.trim() || !formData.authorName.trim()) {
             setError('Title, content, and author name are required');
             return;
         }

        setLoading(true);
        setError(null);

        try {
            const blogData: CreateBlogRequest = {
                title: formData.title.trim(),
                content: formData.blogContent.trim(),
                place: formData.place.trim(),
                createdAt: formData.createdAt.trim(),
                preview: formData.preview.trim(),
                author: formData.authorName.trim(),
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
            };

            const response = await axios.post('/api/blogs', blogData);

            if (response.data.message === 'Blog created successfully') {
                router.push(`/blog/${response.data.blog._id}`);
            } else {
                setError('Failed to create blog');
            }
        } catch (err: any) {
            console.error('Error creating blog:', err);
            if (err.response?.status === 401) {
                setShowAuthModal(true);
            } else {
                setError(err.response?.data?.message || 'Failed to create blog');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAuthModalClose = () => {
        setShowAuthModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <CharchaManchBanner blog={true}/>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Blog Post</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter blog title"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="blogContent" className="block text-sm font-medium text-gray-700 mb-2">
                                Content *
                            </label>
                            <MarkdownEditor
                                value={formData.blogContent}
                                onChange={(value) => setFormData(prev => ({ ...prev, blogContent: value || '' }))}
                                placeholder="Write your blog content in Markdown format..."
                            />
                        </div>
                        <div>
                            <label htmlFor="preview" className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                            <div className="prose prose-lg max-w-none markdown-content">
                                <input type="text" id="preview" name="preview" value={formData.preview} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Preview" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-2">Place</label>
                            <input type="text" id="place" name="place" value={formData.place} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Place" />
                        </div>

                        <div>
                            <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-2">
                                Author name
                            </label>
                            <input
                                type="text"
                                id="authorName"
                                name="authorName"
                                value={formData.authorName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="author"
                            />
                        </div>
                        <div>
                            <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700 mb-2">
                                Date
                            </label>
                            <input 
                                type="date" 
                                id="createdAt" 
                                name="createdAt" 
                                value={formData.createdAt} 
                                onChange={handleInputChange} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                Tags (comma-separated)
                            </label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., technology, programming, web development"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {loading ? (
                                    <>
                                        <LoadingSpinner />
                                        <span className="ml-2">Creating...</span>
                                    </>
                                ) : (
                                    'Create Blog'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showAuthModal && (
                <NewModalLogin
                    isOpen={showAuthModal}
                    onClose={handleAuthModalClose}
                    message="Please login to create a blog post"
                />
            )}
        </div>
    );
}