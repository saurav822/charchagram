'use client'

import { notFound } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { timeAgo } from '@/utils/timeutil'
import { useParams } from 'next/navigation'
import { PostDetailsResponse, PostsResponse, PostType } from '@/types/post'
import { CardComponentForPost } from '@/components/cards/cardComponentForPost'
import { CommentReplyType, CommentType, ReplyDetailsResponse } from '@/types/post'
import { LoadingSpinner } from '@/components/Loadingspinner'
import axios from 'axios'
import NewModalLogin from '@/components/newModalLogin'
import { useUser } from '@/contexts/UserContext'
import Like from '@/components/Like';
import Dislike from '@/components/Dislike';
import { trackPageView } from '@/utils/analytics';
import CharchaManchBanner from '@/components/CharchaManchBanner'
import Share from '@/components/share'
import EditPostPage from '@/components/EditPostPage'
import Footer from '@/components/Footer'

/* ---------- component ---------- */
export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useUser();
    const postId = params.messageID as string;
    const [postDetails, setPostDetails] = useState<PostType | null>(null);

    useEffect(() => {
        trackPageView('Post Detail Page', `/message/${postId}`);
    }, [postId]);
    // const [postId,setPostId] = useState<string>('')

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    const [commentInputs, setCommentInputs] = useState<string>('');
    const [replyInputs, setReplyInputs] = useState<Map<string, string>>(new Map());
    const [loadingCommentButton, setLoadingCommentButton] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalMessage, setAuthModalMessage] = useState('');
    const [likeCommentClicked, setLikeCommentClicked] = useState<{ [key: string]: boolean }>({});
    const [dislikeCommentClicked, setDislikeCommentClicked] = useState<{ [key: string]: boolean }>({});
    const [likePostClicked, setLikePostClicked] = useState(false);
    const [dislikePostClicked, setDislikePostClicked] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [togglePercentage, setTogglePercentage] = useState<boolean>(false);
    const [editingPost, setEditingPost] = useState<PostType | null>(null);
    const [postToDelete, setPostToDelete] = useState<PostType | null>(null);
    const deleteButtonMessage = 'क्या आप सचमुच इस पोस्ट को हटाना चाहते हैं?'
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setUserId(userId);
    }, []);

    useEffect(() => {
        const fetchPostDetails = async () => {
            // setPostId(params.messageID as string);
            const decodedPostId = decodeURIComponent(postId);  // Decodes 'messageId%3D68aacbb57e381985ec9c607e' to 'messageId=68aacbb57e381985ec9c607e'
            const actualPostId = decodedPostId.split('=')[1] || decodedPostId;  // Extracts '68aacbb57e381985ec9c607e' from 'messageId=68aacbb57e381985ec9c607e'
            setLoading(true);
            setError(null);
            let url = `/api/posts/${actualPostId}`;
            try {
                const response = await axios.get(`/api/posts/${actualPostId}`);
                const result: PostDetailsResponse = response.data;
                setPostDetails(result.post);

                // Initialize like/dislike states based on backend data
                if (userId) {
                    if (result.post.comments) {
                        const initialLikeStates: { [key: string]: boolean } = {};
                        const initialDislikeStates: { [key: string]: boolean } = {};

                        result.post.comments.forEach(comment => {
                            // Check if user has liked this comment
                            initialLikeStates[comment._id] = !!comment.like?.find((like: string) => like === userId);
                            // Check if user has disliked this comment
                            initialDislikeStates[comment._id] = !!comment.dislike?.find((dislike: string) => dislike === userId);
                        });

                        setLikeCommentClicked(initialLikeStates);
                        setDislikeCommentClicked(initialDislikeStates);
                    }
                    // Initialize postDetails like/dislike states
                    setLikePostClicked(!!result.post.like?.find((like: string) => like === userId));
                    setDislikePostClicked(!!result.post.dislike?.find((dislike: string) => dislike === userId));
                }
            } catch (err: any) {
                setError(`चर्चाओं को लोड करने में विफल: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchPostDetails();
    }, [postId, userId]); // Add user._id as dependency

    const renderReplies = (replies: string[], commentId: string) => {
        const fetchReplyDetails = async (replyId: string) => {
            try {
                const url = `/api/comments/${replyId}`;
                const response = await axios.get(url);
                const result: ReplyDetailsResponse = response.data;
                setReplyInputs(prev => prev.set(commentId, result.comment.content));
                return result;
            }
            catch (err: any) {
                setError(`टिप्पणियों को लोड करने में विफल: ${err?.message}`);
            }
        };

        return replies.map((reply: string) => (
            <div key={reply} className=" rounded-md p-3">
                <p className="postsection-comment-content-text">{reply}</p>
            </div>
        ));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#273F4F] mx-auto mb-4"></div>
                    <p className="text-gray-600">लोड हो रहा है...</p>
                </div>
            </div>
        )
    }
    if (error) {
        return (
            <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
                <div className="bg-[#f6f6f6] rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-md mx-4">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">त्रुटि</h2>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-[#273F4F] text-white px-6 py-2 rounded-lg hover:bg-[#1e2f3a] transition-colors"
                    >
                        दोबारा कोशिश करें
                    </button>
                </div>
            </div>
        );
    }

    const handleCommentSubmit = async (postId: string) => {
        const commentText = commentInputs.trim();
        if (!commentText) return; // Don't submit empty comments

        // Implement API call to submit comment here
        try {
            setLoadingCommentButton(true);
            const response = await axios.post(`/api/comments/${postId}`, {
                content: commentText,
            });
            // Parse the API response
            const responseData = response.data;
            const newComment: CommentType = {
                _id: responseData.comment._id,
                user: { ...responseData.comment.user },
                post: postId,
                __v: responseData.comment.__v,
                constituency: responseData.comment.constituency,
                parentComment: responseData.comment.parentComment,
                replies: responseData.comment.replies,
                like: responseData.comment.like,
                dislike: responseData.comment.dislike,
                replyCount: responseData.comment.replyCount,
                updatedAt: responseData.comment.updatedAt,
                content: responseData.comment.content,
                createdAt: responseData.comment.createdAt,
            };

            // Update the posts state to include the new comment
            setPostDetails((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    comments: [newComment, ...(prev.comments || [])], // Add new comment at the beginning
                    commentCount: (prev.commentCount || 0) + 1,
                };
            });

        }

        catch (err: any) {
            setError(err.message);
            if (err.response?.status === 401 || err.response?.status === 403) {
                setShowAuthModal(true);
                setAuthModalMessage('आपको लॉगिन करना होगा टिप्पणी करने के लिए।');
            }
        }
        finally {
            setCommentInputs('');
            setLoadingCommentButton(false);
        }
    };

    const handleCommentInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        setCommentInputs(event.target.value);
    };
    const handleLikePost = async (postId: string) => {

        try {

            const response = await axios.post(`/api/posts/like/${postId}`)
            if (dislikePostClicked) {
                setDislikePostClicked(false);
            }
            if (likePostClicked) {
                setLikePostClicked(false);
            }
            else setLikePostClicked(true);
            let responseObject = response.data;
            setPostDetails((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    like: responseObject.likeArray,
                    dislike: responseObject.dislikeArray
                };
            });
        }
        catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setShowAuthModal(true);
                setAuthModalMessage('आपको लॉगिन करना होगा पोस्ट पर प्रतिक्रिया करने के लिए।');
            }
        }
    }
    const handleDislikePost = async (postId: string) => {
        try {
            const response = await axios.post(`/api/posts/dislike/${postId}`)
            if (likePostClicked) {
                setLikePostClicked(false);
            }
            if (dislikePostClicked) {
                setDislikePostClicked(false);
            }
            else setDislikePostClicked(true);
            let responseObject = response.data;
            setPostDetails((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    like: responseObject.likeArray,
                    dislike: responseObject.dislikeArray
                };
            });
        }
        catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setShowAuthModal(true);
                setAuthModalMessage('आपको लॉगिन करना होगा पोस्ट पर प्रतिक्रिया करने के लिए।');
            }
        }
    }

    const handleLikeComment = async (commentId: string) => {

        try {
            const response = await axios.post(`/api/comments/like/${commentId}`)
            if (dislikeCommentClicked[commentId]) {
                setDislikeCommentClicked(prev => ({ ...prev, [commentId]: false })
                )
            }
            setLikeCommentClicked(prev => ({
                ...prev,
                [commentId]: !prev[commentId]
            }));
            let responseObject = response.data;

            setPostDetails((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    comments: prev.comments?.map(comment => comment._id === commentId ? { ...comment, like: responseObject.likeArray, dislike: responseObject.dislikeArray } : comment)
                };
            });
        }
        catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setShowAuthModal(true);
                setAuthModalMessage('आपको लॉगिन करना होगा कमेंट पर प्रतिक्रिया करने के लिए।');
            }
        }
    }
    const handleDislikeComment = async (commentId: string) => {

        try {
            const response = await axios.post(`/api/comments/dislike/${commentId}`)
            if (likeCommentClicked[commentId]) {
                setLikeCommentClicked(prev => ({ ...prev, [commentId]: false })
                )
            }
            setDislikeCommentClicked(prev => ({
                ...prev,
                [commentId]: !prev[commentId]
            }));
            let responseObject = response.data;
            setPostDetails((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    comments: prev.comments?.map(comment => comment._id === commentId ? { ...comment, like: responseObject.likeArray, dislike: responseObject.dislikeArray } : comment)
                };
            });
        }
        catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setShowAuthModal(true);
                setAuthModalMessage('आपको लॉगिन करना होगा कमेंट पर प्रतिक्रिया करने के लिए।');
            }
        }
    }
    const handlePollOptionClick = async (postId: string, optionId: number) => {
        try {
            const res = await axios.post(`/api/posts/poll/${postId}`, {
                optionId: optionId
            });
            setTogglePercentage(true)
            const responseObject = res.data
            setPostDetails((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    pollOptions: responseObject.post.pollOptions,
                    totalVotes: responseObject.post.totalVotes
                };
            })
            console.log('responseObject ', responseObject);
        }
        catch (err: any) {
            if (err.response?.status === 401) {
                setShowAuthModal(true);
                setAuthModalMessage('आपको लॉगिन करना होगा पोल विकल्प को चुनने के लिए।');
            }
        }
    }

    const hideEditPostPage = (success?: boolean) => {
        setEditingPost(null)
        if (success) {
            window.location.reload();
        }
    }
    if (editingPost) {
        return <EditPostPage postDataProp={editingPost} onBackClick={hideEditPostPage} />;
    }

    const handleEditPost = (post: PostType) => setEditingPost(post)
    const handleDeletePost = async (post: PostType) => {
        try {
            const res = await axios.delete(`/api/posts/${postToDelete?._id}`)
            alert('चर्चा हटाई गई');
            setPostToDelete(null);
            // Refresh the posts list
            router.push(`/message`);
        } catch (err: any) {
            console.log('err', err)
            alert('चर्चा हटाने में विफल');
        }
    }
    const handleDeletePostClick = (post: PostType) => {
        setPostToDelete(post);
    }
    return (
        <div className="min-h-screen bg-[#939cab] "> {/* pb-20 for fixed nav bar */}
            <main className={`p-4 ${showAuthModal ? 'blur-sm' : ''} px-4 lg: max-w-screen-md mx-auto`}>
                {/* Charcha Manch Banner */}
                <CharchaManchBanner showBackButton={true} backpageUrl={'/message'} />
                {/* Posts List */}
                <div className={`space-y-4 'mb-4'} lg: max-w-screen-md mx-auto`}>
                    {postDetails === null ? (
                        <div className="text-center text-gray-600 py-8">कोई चर्चा नहीं मिली।</div>
                    ) : (

                        <div key={postDetails._id} className="bg-[#f6f6f6] rounded-lg shadow-sm p-4">
                            {/* Post Header */}
                            <CardComponentForPost post={postDetails as PostType} editCallBack={handleEditPost} deleteCallBack={handleDeletePostClick} userId={userId as string} />
                            {/* Post Content */}
                            {/* <h3 className="text-lg font-bold text-[#273F4F] mb-2">{postDetails.title}</h3> */}
                            {/* <p className="text-sm text-gray-700 mb-3">{postDetails.description}</p> */}
                            {postDetails.content && <div
                                className="mb-3 px-2 postsection-postDetails-content-text"
                                style={{
                                    fontFamily: 'Noto Sans Devanagari, sans-serif',
                                    fontWeight: 400,
                                    fontSize: '1rem',
                                    lineHeight: '1.625rem',
                                    letterSpacing: '0%',
                                    verticalAlign: 'middle',
                                    color: '#1D2530',
                                    textAlign: 'justify'
                                }}
                            ><span>{postDetails.content}</span>
                                {postDetails.pollOptions && postDetails.pollOptions.length > 0 && (
                                    <div className="flex flex-col w-full gap-3 mb-3 mt-3">
                                        {postDetails.pollOptions.map((option: { label: string, votes: string[], percentage: number }, index: number) => (
                                            <div key={index}
                                                className={` px-2 py-1 border border-gray-300 w-full rounded-[8px] flex justify-between items-center h-[46px] relative`}
                                                onClick={() => handlePollOptionClick(postDetails._id, index)}>
                                                <div
                                                    className="absolute left-0 top-0 h-full bg-[#45688233] transition-all duration-300"
                                                    style={{ width: `${option.percentage}%` }}
                                                />
                                                <span>{option.label}</span>
                                                {togglePercentage && option.percentage && <span>{option.percentage + '%'}</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>}
                            <span className="p-2" style={{
                                fontFamily: 'Noto Sans Devanagari, sans-serif',
                                fontWeight: 400,
                                fontSize: '1rem',
                                lineHeight: '1.625rem',
                                letterSpacing: '0%',
                                verticalAlign: 'middle',
                                color: '#1D2530',
                                textAlign: 'justify',
                                maxWidth: '100%',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                whiteSpace: 'pre-wrap',
                            }}>{postDetails.pollOptions && postDetails.pollOptions.length > 0 ? postDetails.totalVotes ? 'कुल वोट: ' + postDetails.totalVotes : '' : ''}</span>

                            {/* Tags */}
                            {postDetails.tags && postDetails.tags.length > 0 && (
                                <div className="flex flex-wrap gap-0 mb-3">
                                    {postDetails.tags.map((tag: string, index: number) => (
                                        <span key={index} className="px-2 py-1 rounded-full postsection-tag-text">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Interaction Buttons */}
                            <div className="flex px-2">
                                <div className="flex justify-between space-x-4 gap-2 text-gray-600 w-full">
                                    <div className="flex gap-2 ">
                                        <div className="flex items-center ">
                                            <Like
                                                isLiked={likePostClicked}
                                                onClick={() => handleLikePost(postDetails._id)}
                                                count={postDetails.like.length}
                                                countShow={postDetails.like?.length === 0 ? false : true}
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <Dislike
                                                isDisliked={dislikePostClicked}
                                                onClick={() => handleDislikePost(postDetails._id)}
                                                count={postDetails.dislike.length}
                                                countShow={postDetails.dislike?.length === 0 ? false : true}
                                            />
                                        </div>
                                    </div>
                                    <div className="rounded-md p-2">
                                        <Share
                                            url={window.location.href}
                                            pathname="../shareicon.svg"
                                        />
                                    </div>
                                </div>
                            </div>


                            {/* Comment Section */}
                            <div className="pt-4 space-y-3">
                                {/* Write a comment */}
                                <div className="flex flex-col items-center w-full px-2 gap-2">
                                    <textarea
                                        placeholder="अपनी टिप्पणी लिखें..."
                                        className={`flex-1 p-2 border rounded-md w-full h-[120px] text-sm focus:outline-none focus:ring-1 focus:ring-[#273F4F] bg-[#F8FAFB] ${error ? 'border-red-500 shake-effect' : 'border-gray-200'}`}
                                        value={commentInputs}
                                        onChange={(e) => handleCommentInputChange(e)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                                                handleCommentSubmit(postDetails._id);
                                                e.currentTarget.value = ''; // Clear input
                                            }
                                        }}
                                    />
                                    <div className="w-full flex justify-items-start mt-1">
                                        <button
                                            className="bg-[#273F4F] text-white px-4 py-2 rounded-md w-fit flex items-center gap-2 item-center hover:bg-[#1e2f3a] transition-colors disabled:opacity-50"
                                            onClick={() => handleCommentSubmit(postDetails._id)}
                                        >
                                            {loadingCommentButton && <LoadingSpinner />}
                                            <span className="postsection-comment-button">{'टिप्पणी करें'}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Existing Comments */}
                                {postDetails.comments && postDetails.comments.length > 0 && (
                                    <div className="space-y-2">
                                        {
                                            postDetails.comments
                                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Sort 
                                                .map(comment => ( // Show first comment
                                                    <div key={comment._id} className=" rounded-md p-3">
                                                        <div className="flex items-center space-x-2 mb-1 flex-shrink-0">
                                                            <div className="w-8 h-8 rounded-full bg-[#F0F2F4] flex items-center"><img src="/userpicturesalhuoette.svg" alt="user" className="w-4 h-4 mx-auto my-auto" /></div>
                                                            <p className="postsection-comment-author-name-text">{comment?.user?.name}</p>
                                                            {/* <span>{comment.user.area_name}</span> */}
                                                            <div className="flex items-center gap-[5px]">
                                                                <span className="postsection-constituency-area-text">•</span>
                                                                <span className="postsection-constituency-area-text min-w-10 break-words hyphens-auto"> {comment?.user?.constituency?.area_name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-[5px]  min-w-15">
                                                                <span className="postsection-constituency-area-text">•</span>
                                                                <span className="postsection-constituency-area-text break-words hyphens-auto text-xs">{timeAgo(comment.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                        <p
                                                            className="postsection-comment-content-text mb-1"
                                                            style={{
                                                                overflowWrap: 'break-word',
                                                                wordWrap: 'break-word',
                                                                whiteSpace: 'pre-wrap',
                                                                maxWidth: '100%',
                                                                textAlign: 'justify',
                                                                fontFamily: 'Noto Sans Devanagari, sans-serif',
                                                                fontSize: '1rem',
                                                                lineHeight: '1.625rem'
                                                            }}
                                                        >{comment.content}</p>
                                                        <div className="flex items-center space-x-4 gap-2">
                                                            <Like
                                                                isLiked={likeCommentClicked[comment._id]}
                                                                onClick={() => handleLikeComment(comment._id)}
                                                                count={comment.like?.length || 0}
                                                                countShow={comment.like?.length === 0 ? false : true}
                                                            />
                                                            <Dislike
                                                                isDisliked={dislikeCommentClicked[comment._id]}
                                                                onClick={() => handleDislikeComment(comment._id)}
                                                                count={comment.dislike?.length || 0}
                                                                countShow={comment.dislike?.length === 0 ? false : true}
                                                            />
                                                        </div>
                                                        {/* <span className="postsection-comment-reply-button">टिप्पणी दें</span> */}
                                                    </div>
                                                ))}

                                        {/* {postDetails.comments.length > 1 && (
                                            <button className="postsection-comment-more-comments-button w-full mx-auto" onClick={() => router.push(`/message/messageId=${postDetails._id}`)}>
                                                और टिप्पणियां देखें ({postDetails.comments.length - 1})
                                            </button>
                                        )} */}
                                    </div>
                                )}
                            </div>

                        </div>

                    )}
                </div>
                {/* {hasNextPage && (
          <div className="flex justify-center mb-6">
            <button
              className="bg-[#7B8B95] px-4 rounded-md py-2 postsection-comment-more-posts-button"
              onClick={() => fetchPosts(currentPage + 1, pagelimit)}
            >
              {seemorePostsLoading ? <LoadingSpinner /> : 'और पोस्ट देखे'}
            </button>
          </div>
        )}
         */}
            </main>

            <NewModalLogin
                isOpen={showAuthModal}
                message={authModalMessage}
                onClose={() => setShowAuthModal(false)}
            />
            <NewModalLogin
                isOpen={!!postToDelete}
                message={deleteButtonMessage}
                showButtons={true}
                successModal={false}
                onClose={() => { setPostToDelete(null) }}
                primaryButtonText={'डिलीट करें'}
                primaryButtonOnClick={() => handleDeletePost(postToDelete as PostType)}
                secondaryButtonText="रद्द करें"
                secondaryButtonLink="/"
            />
            <Footer />
        </div>
    );
}