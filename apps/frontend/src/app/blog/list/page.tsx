'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BlogType, BlogResponse } from '@/types/blog';
import { LoadingSpinner } from '@/components/Loadingspinner';
import { timeAgo } from '@/utils/timeutil';
import CharchaManchBanner from '@/components/CharchaManchBanner';
import { CardComponentForBlog } from '@/components/cards/cardComponentForBlog';
import CommunityRuleSection from '@/components/CommunityRuleSection';
import NewModalLogin from '@/components/newModalLogin';
import Share from '@/components/share';
import Dislike from '@/components/Dislike';
import Like from '@/components/Like';

export default function BlogListPage() {
    const router = useRouter();
    const [blogs, setBlogs] = useState<BlogType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const deleteButtonActionMessage = "Are you sure you want to delete this blog?"
    const [deleteBlogResultMessage, setDeleteBlogResultMessage] = useState<string>("");
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [likeBlogClicked, setLikeBlogClicked] = useState<{ [key: string]: boolean }>({});
    const [dislikeBlogClicked, setDislikeBlogClicked] = useState<{ [key: string]: boolean }>({});
    const [authModalMessage, setAuthModalMessage] = useState<string>("");

    const [blogToDelete, setBlogToDelete] = useState<String | null>(null);
    
    const fetchBlogs = async (page: number = 1, append: boolean = false) => {
        const userId: any = localStorage.getItem('userId');
        try {
            if (!append) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);

            const response = await axios.get(`/api/blogs?page=${page}&limit=10`);
            console.log('response ', response);
            const data: BlogResponse = response.data;

            if (append) {
                setBlogs(prev => [...prev, ...data.blogs]);
                data.blogs.forEach((blog: BlogType) => {
                    setLikeBlogClicked(prev => ({ ...prev, [blog._id]: blog.like.includes(userId) }))
                    setDislikeBlogClicked(prev => ({ ...prev, [blog._id]: blog.dislike.includes(userId) }))
                })
            } else {
                setBlogs(data.blogs);
                data.blogs.forEach((blog: BlogType) => {
                    setLikeBlogClicked(prev => ({ ...prev, [blog._id]: blog.like.includes(userId) }))
                    setDislikeBlogClicked(prev => ({ ...prev, [blog._id]: blog.dislike.includes(userId) }))
                })
            }

            setCurrentPage(data.pagination.currentPage);
            setTotalPages(data.pagination.totalPages);
            setHasNextPage(data.pagination.hasNextPage);
            setHasPrevPage(data.pagination.hasPrevPage);
        } catch (err: any) {
            console.error('Error fetching blogs:', err);
            setError(err.response?.data?.message || 'Failed to fetch blogs');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };


    const handleLikeBlog = async (blogId: string) => {
        try {
            const response = await axios.post(`/api/blogs/like/${blogId}`)
            if (dislikeBlogClicked[blogId]) {
                setDislikeBlogClicked(prev => ({ ...prev, [blogId]: false }))
            }
            setLikeBlogClicked(prev => ({ ...prev, [blogId]: !likeBlogClicked[blogId] }))
            let responseObject = response.data;
            setBlogs((prevBlogs: BlogType[]) =>
                prevBlogs.map((blog: BlogType) => {
                    if(blog._id === blogId) {
                        return {
                            ...blog,
                            like: responseObject.likeArray                            
                        }
                    }
                    return blog;   
                })
            )
        }
        catch (err: any) {
            if (err.response?.status === 401) {
                setShowAuthModal(true);
                setAuthModalMessage('आपको लॉगिन करना होगा पोस्ट पर प्रतिक्रिया करने के लिए।');
            }
        }
    }
    const handleDislikeBlog = async (blogId: string) => {
        try {
            const response = await axios.post(`/api/blogs/dislike/${blogId}`)
            if (likeBlogClicked[blogId]) {
                setLikeBlogClicked(prev => ({ ...prev, [blogId]: false }))
            }
            setDislikeBlogClicked(prev => ({ ...prev, [blogId]: !dislikeBlogClicked[blogId] }))
            let responseObject = response.data;
            setBlogs((prevBlogs: BlogType[]) =>
                prevBlogs.map((blog: BlogType) => {
                    if(blog._id === blogId) {
                        return {
                            ...blog,
                            dislike: responseObject.dislikeArray
                        }
                    }
                    return blog;
                })
            )
        }
        catch (err: any) {
            if (err.response?.status === 401) {
                setShowAuthModal(true);
                setAuthModalMessage('आपको लॉगिन करना होगा पोस्ट पर प्रतिक्रिया करने के लिए।');
            }
        }
    }
    useEffect(() => {
        fetchBlogs(1);
        const user: any = localStorage.getItem('userData')
        if (JSON.parse(user)?.role === 'admin') {
            setIsAdmin(true);
        }
    }, []);

    const handleLoadMore = () => {
        if (hasNextPage && !loadingMore) {
            fetchBlogs(currentPage + 1, true);
        }
    };

    const handleBlogClick = (blogId: string) => {
        router.push(`/blog/${blogId}`);
    };

    const handleEditBlog = (blogId: String) => {
        router.push(`/blog/${blogId}?edit=true`);
    };

    const handleDeleteBlogClick = (blogId: String) => {
        setBlogToDelete(blogId);
    };

    const handleDeleteBlog = async (blogId: String) => {
        try {
            await axios.delete(`/api/blogs/${blogId}`);
            setBlogs(prev => prev.filter(blog => blog._id !== blogId));
            setDeleteBlogResultMessage('Blog deleted successfully');
            setShowDeleteSuccess(true);
        } catch (err: any) {
            console.error('Error deleting blog:', err);
            setDeleteBlogResultMessage(err.response?.data?.message || 'Failed to delete blog');
            setShowDeleteSuccess(true);
        } finally {
            setBlogToDelete(null);
            setShowDeleteSuccess(false);
        }
    };

    const truncateContent = (content: string, maxLength: number = 200) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    console.log('blogs ', blogs);

    return (
        <div className={`min-h-screen bg-[#c1cbd1] flex flex-col`}>
            <div className="space-y-2.5 w-full px-4 py-2.5 lg:max-w-screen-md mx-auto">
                <CharchaManchBanner blog={true}/>
                <div className={`flex-grow w-full ${showAuthModal || blogToDelete ? 'blur-sm' : ''} mb-4 lg: max-w-screen-md mx-auto`}>
                    <main className="w-full">
                        <div className="w-full">
                            {/* Blogs List */}
                            {loading ? (
                                <div className="flex w-full">
                                    <div className="flex flex-col w-full mx-auto text-center min-h-[80vh] bg-white rounded-lg shadow-sm">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#273F4F] mx-auto mb-4 mt-10"></div>
                                        <p className="text-gray-600">लोड हो रहा है...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className={`space-y-2.5 ${!hasNextPage ? 'mb-10' : 'mb-2.5'}`}>
                                    {blogs.length === 0 ? (
                                        <div className="text-center text-gray-600 py-8 flex items-center justify-center min-h-[40vh]">
                                            कोई ब्लॉग नहीं मिला।
                                        </div>
                                    ) : (
                                        blogs.map((blog: BlogType) => (
                                            <div key={blog._id} className="bg-[#f6f6f6] rounded-lg shadow-sm p-4">
                                                <div onClick={() => handleBlogClick(blog._id)} className="cursor-pointer">
                                                    <CardComponentForBlog
                                                        blog={blog}
                                                        editCallBack={handleEditBlog}
                                                        deleteCallBack={handleDeleteBlogClick}
                                                        isAdmin={isAdmin}
                                                    />
                                                </div>
                                                <div className="flex px-2">
                                                    <div className="flex justify-between space-x-4 gap-2 text-gray-600 w-full">
                                                        <div className="flex gap-2 ">
                                                            <div className="flex items-center">
                                                                <Like
                                                                    isLiked={likeBlogClicked[blog._id]}
                                                                    onClick={() => handleLikeBlog(blog._id)}
                                                                    count={blog.like?.length || 0}
                                                                    countShow={blog.like?.length === 0 ? false : true}
                                                                />
                                                            </div>
                                                            <div className="flex items-center ">
                                                                <Dislike
                                                                    isDisliked={dislikeBlogClicked[blog._id]}
                                                                    onClick={() => {                                                                                                                                            
                                                                        handleDislikeBlog(blog._id);
                                                                    }}
                                                                    count={blog.dislike?.length || 0}
                                                                    countShow={blog.dislike?.length === 0 ? false : true}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="rounded-md p-2 cursor-pointer">
                                                            <Share
                                                                url={window.location.href + `/${blog._id}`}
                                                                pathname="../shareicon.svg"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                            {!loading && blogs.length > 0 && hasNextPage && (
                                <div className="flex justify-center mb-2.5">
                                    <button
                                        className="bg-[#7B8B95] px-4 rounded-md py-2 postsection-comment-more-posts-button"
                                        onClick={handleLoadMore}
                                    >
                                        {loadingMore ? <LoadingSpinner /> : 'और ब्लॉग देखे'}
                                    </button>
                                </div>
                            )}
                            {/* {!loading && <CommunityRuleSection />} */}
                        </div>
                    </main>

                    {/* Fixed "नया ब्लॉग" button */}
                    {isAdmin && <button onClick={() => router.push('/blog/create')} className="bg-[#273F4F] text-white px-5 py-3 rounded-3xl flex items-center justify-center z-10 shadow-lg fixed bottom-18 right-1 gap-2 text-lg font-medium hover:bg-[#1e2f3a] transition-colors">
                        <span className="text-xl font-bold">+</span> <span style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>नया ब्लॉग</span>
                    </button>}
                </div>
            </div>
            <NewModalLogin
                isOpen={showAuthModal}
                message={authModalMessage}
                onClose={() => setShowAuthModal(false)}
                showButtons={true}
                successModal={false}
                primaryButtonText='लॉगिन करें'
                primaryButtonLink='/login'
                primaryButtonOnClick={() => router.push('/login')}
                secondaryButtonText="बंद करें"
                secondaryButtonLink="/"
            />
            {<NewModalLogin
                isOpen={showDeleteSuccess}
                message={deleteBlogResultMessage}
                onClose={() => setShowDeleteSuccess(false)}
                showButtons={false}
                successModal={true}
            />}
            <NewModalLogin
                isOpen={blogToDelete !== null}
                message={deleteButtonActionMessage}
                onClose={() => setBlogToDelete(null)}
                primaryButtonText='delete'
                primaryButtonOnClick={() => handleDeleteBlog(blogToDelete as String)}
                secondaryButtonText="cancel"
            />
        </div>
    );
}