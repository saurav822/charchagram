import { BlogType } from "@/types/blog";
import { timeAgo } from "@/utils/timeutil";
import { useState, useRef, useEffect } from "react";

export const CardComponentForBlog = ({
    blog,
    editCallBack,
    deleteCallBack,
    isAdmin
}: {
    blog: BlogType,
    editCallBack: (blogId: String) => void,
    deleteCallBack: (blogId: String) => void,
    isAdmin: boolean
}) => {
    const [isOptionMenuOpen, setIsOptionMenuOpen] = useState(false);
    const threedotref = useRef<HTMLDivElement>(null);
    const optionMenuref = useRef<HTMLDivElement>(null);

    if (!blog) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <p className="text-gray-500">ब्लॉग नहीं मिला</p>
            </div>
        )
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (threedotref.current && threedotref.current.contains(event.target as Node)) {
                return; // Don't close if clicking on three dots
            }
            if (optionMenuref.current && optionMenuref.current.contains(event.target as Node)) {
                return; // Don't close if clicking on the menu
            }
            setIsOptionMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    const truncateContent = (content: string, maxLength: number = 150) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };
    const handleDeleteBlog = (blogId: string) => {
        deleteCallBack(blogId);
    };
    const handleEditBlog = (blogId: string) => {
        editCallBack(blogId);
    };

    return (
        <div className="bg-[#f6f6f6] rounded-lg px-2 py-1 relative">

            {/* Blog Title */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-[#1D2530] font-['Noto Sans Devanagari, sans-serif'] leading-6">
                    {blog.title}
                </h2>
                {isAdmin && <div className="flex items-center gap-2">

                    <div onClick={(e) => {
                        e.stopPropagation();
                        editCallBack(blog._id);
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBlog(blog._id);
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6h18" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 11v6" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 11v6" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                </div>}

            </div>

            {/* Blog Content Preview */}
            <div className="mb-3">
                <p className="text-sm text-[#1D2530] font-['Noto Sans Devanagari, sans-serif'] leading-5">
                    {truncateContent(blog.preview)}
                </p>
            </div>

            {/* Blog Tags */}
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

            {/* <div className="flex gap-3 justify-between">

                {isOptionMenuOpen && (
                    <div ref={optionMenuref} className="h-fit w-fit bg-gray-100 rounded-lg border border-gray-300 absolute top-4 right-6 flex flex-col gap-1 p-2 shadow-lg">
                        <div className="flex items-center gap-2 text-sm font-medium px-2 py-1 leading-5 text-[#1D2530] font-['Noto Sans Devanagari, sans-serif'] align-middle tracking-[0%] cursor-pointer hover:bg-gray-200 rounded" onClick={() => {
                            setIsOptionMenuOpen(false);
                            editCallBack(blog);
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Edit</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium px-2 py-1 leading-5 text-red-600 font-['Noto Sans Devanagari, sans-serif'] align-middle tracking-[0%] cursor-pointer hover:bg-gray-200 rounded" onClick={() => {
                            setIsOptionMenuOpen(false);
                            deleteCallBack(blog);
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Delete</span>
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F0F2F4] flex items-center">
                        <img src="/userpicturesalhuoette.svg" alt="user" className="w-5 h-5 mx-auto my-auto" />
                    </div>
                    <div className="flex flex-col items-start gap-[0.5px]">
                        <span className="text-sm font-medium leading-5 text-[#1D2530] font-['Noto Sans Devanagari, sans-serif'] align-middle tracking-[0%] py-1">
                            {blog.author || 'Anonymous'}
                        </span>
                        <span className="text-xs text-[#7B899D] font-medium align-middle font-['Noto Sans Devanagari, sans-serif'] postsection-author-time-text">
                            {timeAgo(blog.createdAt)}
                        </span>
                    </div>
                </div>

            </div> */}

            {/* Blog Stats */}
            {/* <div className="flex text-xs text-[#7B899D] font-['Noto Sans Devanagari, sans-serif']">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                        {blog.views} views
                    </span>
                    <span className="flex items-center gap-1">
                        {blog.commentCount} comments
                    </span>
                </div>
            </div> */}
        </div>
    );
};