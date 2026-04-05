import { PostType } from "@/types/post";
import { timeAgo } from "@/utils/timeutil";
import { useState, useRef, useEffect } from "react";

export const CardComponentForPost = ({ post, editCallBack, deleteCallBack, userId }: { post: PostType, editCallBack: (post: PostType) => void, deleteCallBack: (post: PostType) => void, userId: string }) => {
  const [isOptionMenuOpen, setIsOptionMenuOpen] = useState(false);
  const threedotref = useRef<HTMLDivElement>(null);
  const optionMenuref = useRef<HTMLDivElement>(null);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <p className="text-gray-500">पोस्ट नहीं मिली</p>
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
  return (
    <div className="bg-[#f6f6f6] rounded-lg px-2 py-2 relative mb-4">
      <div className="flex gap-3 justify-between">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F0F2F4] flex items-center"><img src="/userpicturesalhuoette.svg" alt="user" className="w-5 h-5 mx-auto my-auto" /></div>
          <div className="flex flex-col items-start gap-[0.5px]">
            <span className="text-sm font-medium leading-5 text-[#1D2530] font-['Noto Sans Devanagari, sans-serif'] align-middle tracking-[0%] py-1">{post.author.name}</span>
            {post.isEdited ? <span className="text-xs text-[#7B899D] font-medium align-middle font-['Noto Sans Devanagari, sans-serif'] postsection-author-time-text">{timeAgo(post.updatedAt)} (edited)</span> : <span className="text-xs text-[#7B899D] font-medium align-middle font-['Noto Sans Devanagari, sans-serif'] postsection-author-time-text">{timeAgo(post.createdAt)}</span>}
          </div>
          {post.constituency && <span className="text-xs font-medium text-[#7B899D] font-['Noto Sans Devanagari, sans-serif'] px-3 py-2 postsection-constituency-area-text">• {post.constituency.area_name}</span>}
        </div>
        {isOptionMenuOpen && <div ref={optionMenuref} className="h-fit w-fit bg-gray-100 rounded-lg border border-gray-300 absolute top-4 right-6 flex flex-col gap-1 p-2 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-medium px-2 py-1 leading-5 text-[#1D2530] font-['Noto Sans Devanagari, sans-serif'] align-middle tracking-[0%] cursor-pointer hover:bg-gray-200 rounded" onClick={() => {
            setIsOptionMenuOpen(false);
            editCallBack(post);
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Edit</span>
          </div>
          {<div className="flex items-center gap-2 text-sm font-medium px-2 py-1 leading-5 text-red-600 font-['Noto Sans Devanagari, sans-serif'] align-middle tracking-[0%] cursor-pointer hover:bg-gray-200 rounded" onClick={() => {
            setIsOptionMenuOpen(false);
            deleteCallBack(post);
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Delete</span>
          </div>}
        </div>
        }
        {post.author._id === userId && <div ref={threedotref} className="my-auto -mx-2 cursor-pointer" onClick={(e) => {
          e.stopPropagation();
          setIsOptionMenuOpen(!isOptionMenuOpen)
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="6" r="2" fill="currentColor" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <circle cx="12" cy="18" r="2" fill="currentColor" />
          </svg>

        </div>
        }
        <div className="absolute -top-4 -right-4 bg-[#D3DADF] rounded-lg border border-[#A5B8C7] flex items-center justify-center px-2 whitespace-nowrap py-1">
          <span className="text-[#176DCF] text-sm font-normal leading-4 font-['Noto_Sans_Devanagari'] block">{post.category.name}</span>
        </div>

        {/* <button className="absolute right-0 flex py-0"><img src='postsectionbutton.svg' className="w-10 h-10" alt="section button" /></button> */}
      </div>
    </div>
  );
};