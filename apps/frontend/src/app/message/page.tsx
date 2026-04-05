'use client'
import { CardComponentForPost } from "@/components/cards/cardComponentForPost";
import CommunityRuleSection from "@/components/CommunityRuleSection";
import { LoadingSpinner } from "@/components/Loadingspinner";
import Footer from "@/components/Footer";
import { ConstituencyListType } from "@/types/constituency";
import { CommentType, PostsResponse, PostType } from "@/types/post";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Select from 'react-select';
import { components } from 'react-select';
import axios from "axios";
import NewModalLogin from "@/components/newModalLogin";
import { BiharId } from "@/constants/constants";
import Like from "@/components/Like";
import Dislike from "@/components/Dislike";
import { useUser } from "@/contexts/UserContext";
import { trackPageView } from "@/utils/analytics";
import CharchaManchBanner from "@/components/CharchaManchBanner";
import Share from "@/components/share";
import { MultiValue } from "react-select";
import { isDevanagariText, isEnglishText } from "@/utils/languageutils";
import EditPostPage from "@/components/EditPostPage";
import { timeAgo } from "@/utils/timeutil";
import { useConstituencies } from "@/contexts/ConstituencyContext";
// Helper function to format date


export default function MessagePage() {
  const { user } = useUser();
  const router = useRouter();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [errorPosts, setErrorPosts] = useState<string | null>(null);
  const [constituencyParam, setConstituencyParam] = useState<string | null>(null);
  const deleteButtonMessage = 'क्या आप सचमुच इस पोस्ट को हटाना चाहते हैं?'
  const { constituencyAreaList: constituencyAreaListType, loading: loadingConstituencies, error: errorConstituencies } = useConstituencies();
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  const [commentInputs, setCommentInputs] = useState<Map<string, string>>(new Map());
  const [loadingCommentInput, setLoadingCommentInput] = useState<Map<string, boolean>>(new Map());
  const [errorCommentInput, setErrorCommentInput] = useState<Map<string, string>>(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [seemorePostsLoading, setSeemorePostsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');
  const [likePostClicked, setLikePostClicked] = useState<{ [key: string]: boolean }>({});
  const [dislikePostClicked, setDislikePostClicked] = useState<{ [key: string]: boolean }>({});
  const [likeCommentClicked, setLikeCommentClicked] = useState<{ [key: string]: boolean }>({});
  const [dislikeCommentClicked, setDislikeCommentClicked] = useState<{ [key: string]: boolean }>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [togglePercentage, setTogglePercentage] = useState<{ [key: string]: boolean }>({});
  const [editingPost, setEditingPost] = useState<PostType | null>(null);
  const [postToDelete, setPostToDelete] = useState<PostType | null>(null);
  const pagelimit = 20;
  const MINIMUM_POSTS_THRESHOLD = 5;
  const [selectedConstituency, setSelectedConstituency] = useState<{ value: string; label: string, english_name: string }[] | null>(null);
  const [filterState, setFilterState] = useState<string>('latest')
  const [flag, setFlag] = useState(false)
  useEffect(() => {
    trackPageView('Message Page', '/message');
    const userId = localStorage.getItem('userId');
    setUserId(userId);
    fetchPosts(1, pagelimit, true, filterState);
  }, []);

  useEffect(() => {
    const checkConstituencyValueSetFromPropAndFilterOutFromData = async (data: ConstituencyListType[], constituencyParamVar: string) => {
      const constituencyData = data.filter(item => item._id === constituencyParamVar);
      setSelectedConstituency([{
        value: constituencyData[0]._id, label: constituencyData[0].area_name, english_name: constituencyData[0].english_name || ''
      }]);
    }

    // Handle constituency parameter from URL when constituency data is available
    if (constituencyAreaListType.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const constituencyParamVar = urlParams.get('constituency');
      setConstituencyParam(constituencyParamVar);

      if (constituencyParamVar) {
        checkConstituencyValueSetFromPropAndFilterOutFromData(constituencyAreaListType, constituencyParamVar);
      }
    }
    // fetchPosts(1, pagelimit, true);
  }, [constituencyAreaListType]);
  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach(post => {
        if (post.comments && post.comments.length > 1) {
          // Prefetch all routes
          router.prefetch(`/api/posts/${post._id}`);
        }
      });
    }
  }, [posts, router]);

  const handleCommentInputChange = (postId: string, event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const value = event.target.value;
    setCommentInputs(prev => {
      const newState = new Map(prev);
      newState.set(postId, value);
      return newState;
    });
  };
  // Fetch posts based on selected constituency or all posts
  const fetchPosts = useCallback(async (page: number, limit: number, reset: boolean = false, filter: string = filterState) => {
    if (page === 1 || reset) {
      setLoadingPosts(true);
    } else {
      setSeemorePostsLoading(true);
    }
    setErrorPosts(null);
    let response: any;
    let url: string;
    const urlParams = new URLSearchParams(window.location.search);
    const constituencyParamVar = urlParams.get('constituency');
    try {
      if (constituencyParamVar || (selectedConstituency && selectedConstituency.length > 0)) {
        const selectedConstituencyValue = selectedConstituency?.map(item => item.value);
        url = `/api/posts/constituency`
        if (!flag && !selectedConstituency) { return }
        response = await axios.post(url, {
          constituencyIdArray: selectedConstituencyValue && selectedConstituencyValue?.length > 0 ? selectedConstituencyValue : [],
          page: page,
          limit: limit,
          sortBy: filter === 'latest' ? 'createdAt' : 'engagement',
          sortOrder: 'desc',
          userIdd: filter === 'yourpost' ? userId : ''
        })
      }
      else {
        url = `/api/posts?page=${page}&limit=${limit}&sortBy=${filter === 'latest' ? 'createdAt' : 'engagement'}&sortOrder=desc&userIdd=${filter === 'yourpost' ? userId : ''}`;
        response = await axios.get(url)
      }

      const result: PostsResponse = response.data;
      if (page === 1 || reset) {
        // Reset posts and states for first page or constituency change
        setPosts(result.data.paginatedPosts);
        setCurrentPage(1);

        // Initialize like/dislike states for posts and comments
        if (userId) {
          const initialPostLikeStates: { [key: string]: boolean } = {};
          const initialPostDislikeStates: { [key: string]: boolean } = {};
          const initialCommentLikeStates: { [key: string]: boolean } = {};
          const initialCommentDislikeStates: { [key: string]: boolean } = {};

          result.data.paginatedPosts.forEach(post => {
            // Check if user has liked/disliked this post
            initialPostLikeStates[post._id] = !!post.like?.find((like: string) => like === userId);
            initialPostDislikeStates[post._id] = !!post.dislike?.find((dislike: string) => dislike === userId);

            // Check if user has liked/disliked comments in this post
            post.comments?.forEach(comment => {
              initialCommentLikeStates[comment._id] = !!comment.like?.find((like: string) => like === userId);
              initialCommentDislikeStates[comment._id] = !!comment.dislike?.find((dislike: string) => dislike === userId);
            });
          });

          setLikePostClicked(initialPostLikeStates);
          setDislikePostClicked(initialPostDislikeStates);
          setLikeCommentClicked(initialCommentLikeStates);
          setDislikeCommentClicked(initialCommentDislikeStates);
        }
      } else {
        // Append posts for pagination
        setPosts(prev => [...prev, ...result.data.paginatedPosts]);

        // Initialize states for new posts
        if (userId) {
          const newPostLikeStates: { [key: string]: boolean } = {};
          const newPostDislikeStates: { [key: string]: boolean } = {};
          const newCommentLikeStates: { [key: string]: boolean } = {};
          const newCommentDislikeStates: { [key: string]: boolean } = {};

          result.data.paginatedPosts.forEach(post => {
            newPostLikeStates[post._id] = !!post.like?.find((like: string) => like === userId);
            newPostDislikeStates[post._id] = !!post.dislike?.find((dislike: string) => dislike === userId);

            post.comments?.forEach(comment => {
              newCommentLikeStates[comment._id] = !!comment.like?.find((like: string) => like === userId);
              newCommentDislikeStates[comment._id] = !!comment.dislike?.find((dislike: string) => dislike === userId);
            });
          });

          // Merge new states with existing ones
          setLikePostClicked(prev => ({ ...prev, ...newPostLikeStates }));
          setDislikePostClicked(prev => ({ ...prev, ...newPostDislikeStates }));
          setLikeCommentClicked(prev => ({ ...prev, ...newCommentLikeStates }));
          setDislikeCommentClicked(prev => ({ ...prev, ...newCommentDislikeStates }));
        }
      }

      setCurrentPage(result.data.pagination.currentPage);
      setHasNextPage(result.data.pagination.hasNextPage);
    } catch (err: any) {
      console.error('Failed to fetch posts:', err);
      setErrorPosts(`चर्चाओं को लोड करने में विफल: ${err.message}`);
    } finally {
      if (page === 1 || reset) {
        setLoadingPosts(false);
      } else {
        setSeemorePostsLoading(false);
      }
    }
  }, [selectedConstituency, filterState]);

  // Update the useEffect to handle constituency changes
  useEffect(() => {
    // Only fetch posts when constituency data is available and selectedConstituency is properly initialized
    if (constituencyAreaListType.length > 0) {
      fetchPosts(1, pagelimit, true);
    }
  }, [selectedConstituency, fetchPosts]);

  // Function to handle pagination (load more posts)
  const handleLoadMore = () => {
    if (hasNextPage && !seemorePostsLoading) {
      fetchPosts(currentPage + 1, pagelimit, false);
    }
  };
  const handleConstituencyFilterChange = (optionArray: MultiValue<{ value: string; label: string, english_name: string }> | null) => {
    setFlag(true)
    setSelectedConstituency(optionArray ? [...optionArray] as { value: string; label: string, english_name: string }[] : null);
  };
  const handleCommentSubmit = async (postId: string) => {
    const commentText = commentInputs.get(postId)?.trim();
    if (!commentText) return; // Don't submit empty comments
    // Implement API call to submit comment here
    try {
      setLoadingCommentInput(prev => {
        const newState = new Map(prev);
        newState.set(postId, true);
        return newState;
      });
      const response = await axios.post(`/api/comments/${postId}`, {
        user: "68a733a6ea0064119890ac1d",
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
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? {
              ...post,
              comments: [...post.comments, newComment], // Append the new comment
              commentCount: post.commentCount + 1, // Increment comment count
            }
            : post
        )
      );
    }

    catch (err: any) {
      if (err.response?.status === 401) {
        setShowAuthModal(true);
        setAuthModalMessage('आपको लॉगिन करना होगा टिप्पणी करने के लिए।');
      } else {
        setErrorCommentInput(prev => {
          const newState = new Map(prev);
          newState.set(postId, 'टिप्पणी जोड़ने में विफल: ' + err.message);
          return newState;
        });
      }
      setErrorCommentInput(prev => {
        const newState = new Map(prev);
        newState.set(postId, 'टिप्पणी जोड़ने में विफल: ' + err.message);
        return newState;
      });
    }
    finally {
      setCommentInputs(prev => {
        const newState = new Map(prev);
        newState.set(postId, '');
        return newState;
      });
      setLoadingCommentInput(prev => {
        const newState = new Map(prev);
        newState.set(postId, false);
        return newState;
      });
    }
  };

  const CustomControl = ({ children, ...props }: any) => {
    return (
      <components.Control {...props}>
        <img src="/arealocation.svg" alt="Location" className="w-5 h-5 ml-4" /> {/* Increased left margin */}
        {children}
      </components.Control>
    );
  };

  if (errorConstituencies || errorPosts) {
    return (
      <div className="min-h-screen bg-[#c1cbd1] flex flex-col px-4 space-y-6">
        <main className="py-2.5 lg: max-w-screen-md mx-auto">
          <div className="space-y-2.5">
            {/* Charcha Manch Banner */}
            <CharchaManchBanner />
            <div className="relative mb-2.5">
              <div>
                {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
              </span> */}
                <Select
                  id="constituency-filter"
                  options={constituencyAreaListType.map(c => ({ value: c._id, label: c.area_name, english_name: c.english_name as string }))}
                  value={selectedConstituency}
                  placeholder="सभी निर्वाचन क्षेत्र"
                  isDisabled={true}
                  instanceId="message-page-constituency-select"
                />
              </div>
              {userId && <div className="flex items-end justify-end mt-2 gap-2 p-1">
                <button onClick={() => { fetchPosts(1, pagelimit, true, 'yourpost'); setFilterState('yourpost') }}><span className={`text-xs border border-gray-200 rounded-lg p-2 ${filterState === 'yourpost' ? 'bg-blue-900 text-white' : 'bg-white'}`}>आपकी चर्चा</span> </button>
                <button onClick={() => { fetchPosts(1, pagelimit, true, 'popular'); setFilterState('popular') }}><span className={`text-xs border border-gray-200 rounded-lg p-2 ${filterState === 'popular' ? 'bg-blue-900 text-white' : 'bg-white'}`}>लोकप्रिय चर्चा</span> </button>
                <button onClick={() => { fetchPosts(1, pagelimit, true, 'latest'); setFilterState('latest') }}><span className={`text-xs border border-gray-200 rounded-lg p-2 ${filterState === 'latest' ? 'bg-blue-900 text-white' : 'bg-white'}`}>नई चर्चा</span> </button></div>}
            </div>

          </div>
        </main>

        <div className="min-h-[80vh] bg-[#f6f6f6] rounded-lg shadow-sm p-4 mx-auto w-full lg: max-w-screen-md">
          <div className="bg-[#f6f6f6] rounded-lg shadow-sm border border-gray-200 p-8 text-center w-full mt-20 w-full flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">त्रुटि</h2>
            <p className="text-gray-600 mb-4">{errorConstituencies || errorPosts}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#273F4F] text-white px-6 py-2 rounded-lg hover:bg-[#1e2f3a] transition-colors"
            >
              दोबारा कोशिश करें
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLikePost = async (postId: string) => {
    try {
      const response = await axios.post(`/api/posts/like/${postId}`)
      if (dislikePostClicked[postId]) {
        setDislikePostClicked(prev => ({ ...prev, [postId]: false }))
      }
      setLikePostClicked(prev => ({ ...prev, [postId]: !likePostClicked[postId] }))
      let responseObject = response.data;
      setPosts((prevPosts: PostType[]) =>
        prevPosts.map((post: PostType) => ({
          ...post,
          like: responseObject.likeArray,
          dislike: responseObject.dislikeArray
        }))
      )
    }
    catch (err: any) {
      if (err.response?.status === 401) {
        setShowAuthModal(true);
        setAuthModalMessage('आपको लॉगिन करना होगा पोस्ट पर प्रतिक्रिया करने के लिए।');
      }
    }
  }
  const handleDislikePost = async (postId: string) => {

    try {
      const response = await axios.post(`/api/posts/dislike/${postId}`)
      if (likePostClicked[postId]) {
        setLikePostClicked(prev => ({ ...prev, [postId]: false }))
      }
      setDislikePostClicked(prev => ({ ...prev, [postId]: !dislikePostClicked[postId] }))
      let responseObject = response.data;
      setPosts((prevPosts: PostType[]) =>
        prevPosts.map((post: PostType) => ({
          ...post,
          like: responseObject.likeArray,
          dislike: responseObject.dislikeArray
        }))
      )
    }
    catch (err: any) {
      if (err.response?.status === 401) {
        setShowAuthModal(true);
        setAuthModalMessage('आपको लॉगिन करना होगा पोस्ट पर प्रतिक्रिया करने के लिए।');
      }
    }
  }
  const handleLikeComment = async (commentId: string) => {

    try {
      const response = await axios.post(`/api/comments/like/${commentId}`)
      const newLikeState = !likeCommentClicked[commentId];
      if (dislikeCommentClicked[commentId]) {
        setDislikeCommentClicked(prev => ({ ...prev, [commentId]: false }))
      }
      setLikeCommentClicked(prev => ({ ...prev, [commentId]: newLikeState }))
      let responseObject = response.data;
      setPosts((prevPosts: PostType[]) =>
        prevPosts.map((post: PostType) => ({
          ...post,
          comments: post.comments?.map(comment =>
            comment._id === commentId
              ? { ...comment, like: responseObject.likeArray, dislike: responseObject.dislikeArray }
              : comment
          ) || []
        }))
      )
    }
    catch (err: any) {
      if (err.response?.status === 401) {
        setShowAuthModal(true);
        setAuthModalMessage('आपको लॉगिन करना होगा कमेंट पर प्रतिक्रिया करने के लिए।');
      }

    }
  }
  const handleDislikeComment = async (commentId: string) => {

    try {
      const response = await axios.post(`/api/comments/dislike/${commentId}`)
      if (likeCommentClicked[commentId]) {
        setLikeCommentClicked(prev => ({ ...prev, [commentId]: false }))
      }

      setDislikeCommentClicked(prev => ({ ...prev, [commentId]: !dislikeCommentClicked[commentId] }))

      let responseObject = response.data;
      setPosts((prevPosts: PostType[]) =>
        prevPosts.map((post: PostType) => ({
          ...post,
          comments: post.comments?.map(comment =>
            comment._id === commentId
              ? { ...comment, like: responseObject.likeArray, dislike: responseObject.dislikeArray }
              : comment
          ) || []
        }))
      )
    }
    catch (err: any) {
      if (err.response?.status === 401) {
        setShowAuthModal(true);
        setAuthModalMessage('आपको लॉगिन करना होगा कमेंट पर प्रतिक्रिया करने के लिए।');
      }
    }
  }
  const updatePostsListWithResponseObject = (responseObject: any, postId: string) => {
    const updatedPosts = posts.map((post, index) => {
      if (post._id === postId) {
        post.pollOptions = responseObject.post.pollOptions.map((option: any) => ({
          _id: option.id,
          label: option.label,
          votes: option.votes,
          percentage: option.percentage
        }))
        post.totalVotes = responseObject.post.totalVotes
      }
      return post
    })
    setPosts(updatedPosts)
  }
  const handlePollOptionClick = async (postId: string, optionId: number) => {
    try {
      const res = await axios.post(`/api/posts/poll/${postId}`, {
        optionId: optionId
      });
      setTogglePercentage(prev => ({ ...prev, [postId]: true }))
      const responseObject = res.data

      updatePostsListWithResponseObject(responseObject, postId)
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
      fetchPosts(1, pagelimit, true, filterState);
    }
  }
  // If editing a post, show the EditPostPage component
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
      window.location.reload();
    } catch (err: any) {
      console.log('err', err)
      alert('चर्चा हटाने में विफल');
    }
  }

  const handleDeletePostClick = (post: PostType) => {
    setPostToDelete(post);
  }
  return (
    <div className={`min-h-screen bg-[#c1cbd1] flex flex-col`}>
      <div className="space-y-2.5 w-full px-4 py-2.5 lg:max-w-screen-md mx-auto">
        {/* Charcha Manch Banner */}
        <CharchaManchBanner />
        {/* Constituency Filter */}
        <div className="mb-2.5">
          <label htmlFor="constituency-filter " className="sr-only postsection-dropdown-text"
          >सभी निर्वाचन क्षेत्र</label>

          <div className="relative">
            {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
              </span> */}
            <Select
              id="constituency-filter"
              options={constituencyAreaListType.map(c => ({ value: c._id, label: c.area_name, english_name: c.english_name as string }))}
              value={selectedConstituency}
              isMulti={true}
              onChange={handleConstituencyFilterChange}
              placeholder="सभी निर्वाचन क्षेत्र"
              isClearable={true}
              filterOption={(option: { value: string, label: string, data: { value: string, label: string, english_name: string } }, inputValue) => {
                if (!inputValue) return true;
                const searchTerm = inputValue.toLowerCase().trim();
                const hindiName = option.label.toLowerCase();
                const isInputDevanagari = isDevanagariText(inputValue);
                const isInputEnglish = isEnglishText(inputValue);
                let englishName = '';
                if (option.data.english_name) { englishName = option.data.english_name.toLowerCase().trim(); }
                if (isInputDevanagari) {
                  return hindiName.includes(searchTerm);
                } else if (isInputEnglish) {
                  return englishName.length > 0 && englishName.includes(searchTerm);
                } else {
                  // Fallback: search in both
                  return hindiName.includes(searchTerm) || (englishName.length > 0 && englishName.includes(searchTerm));
                }
              }}
              components={{ Control: CustomControl }} // Use the CustomControl component here
              styles={{
                control: (provided) => ({
                  ...provided,
                  paddingLeft: '0', // Reset padding as we're handling it in CustomControl
                  borderRadius: '0.5rem',
                  borderColor: '#e5e7eb',
                  boxShadow: 'none',
                  backgroundColor: '#f6f6f6',
                  '&:hover': {
                    borderColor: '#d1d5db',
                  },
                  display: 'flex', // Ensure flex layout for children (icon, value/placeholder)
                  alignItems: 'center', // Vertically center content
                  minHeight: '2.5rem', // Consistent height
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: '#1D2530', // Styled placeholder text color
                  paddingLeft: '0.75rem', // Space between icon and text
                  lineHeight: '3',
                  fontWeight: 500,
                  fontSize: '1 rem', // 16px
                  fontFamily: 'Noto Sans Devanagari, sans-serif'
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: '#1D2530',
                  paddingLeft: '0.75rem', // Space between icon and selected value
                  lineHeight: '3',
                  fontWeight: 550,
                  fontSize: '1 rem', // 16px
                  fontFamily: 'Noto Sans Devanagari, sans-serif'
                }),
                multiValue: (provided) => ({
                  ...provided,
                  backgroundColor: '#273F4F',
                  borderRadius: '0.25rem',
                }),
                multiValueLabel: (provided) => ({
                  ...provided,
                  color: 'white',
                  fontSize: '0.875rem',
                  fontFamily: 'Noto Sans Devanagari, sans-serif'
                }),
                multiValueRemove: (provided) => ({
                  ...provided,
                  color: 'white',
                  ':hover': {
                    backgroundColor: '#1e2f3a',
                    color: 'white',
                  },
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? '#273F4F' : state.isFocused ? '#f3f4f6' : 'white',
                  color: state.isSelected ? 'white' : '#1f2937'
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  padding: '0', // Reset default padding if necessary to control spacing with icon
                }),
              }}
              instanceId="message-page-constituency-select"
            />
          </div>
          {userId && <div className="flex items-end justify-end mt-2 gap-2 p-1">
            <button onClick={() => { fetchPosts(1, pagelimit, true, 'yourpost'); setFilterState('yourpost') }}><span className={`text-xs border border-gray-200 rounded-lg p-2 ${filterState === 'yourpost' ? 'bg-blue-900 text-white' : 'bg-white'}`}>आपकी चर्चा</span> </button>
            <button onClick={() => { fetchPosts(1, pagelimit, true, 'popular'); setFilterState('popular') }}><span className={`text-xs border border-gray-200 rounded-lg p-2 ${filterState === 'popular' ? 'bg-blue-900 text-white' : 'bg-white'}`}>लोकप्रिय चर्चा</span> </button>
            <button onClick={() => { fetchPosts(1, pagelimit, true, 'latest'); setFilterState('latest') }}><span className={`text-xs border border-gray-200 rounded-lg p-2 ${filterState === 'latest' ? 'bg-blue-900 text-white' : 'bg-white'}`}>नई चर्चा</span> </button></div>}
        </div>
      </div>
      <div className={`flex-grow w-full px-4 ${showAuthModal || postToDelete ? 'blur-sm' : ''} mb-4 lg: max-w-screen-md mx-auto`}> {/* pb-20 for fixed nav bar */}
        <main className="w-full">
          <div className="w-full">
            {/* Posts List */}
            {loadingPosts ? (
              <div className="flex w-full">
                <div className="flex flex-col w-full mx-auto text-center min-h-[80vh] bg-white rounded-lg shadow-sm">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#273F4F] mx-auto mb-4 mt-10"></div>
                  <p className="text-gray-600">लोड हो रहा है...</p>
                </div>
              </div>
            ) : (
              <div className={`space-y-2.5 ${!hasNextPage ? 'mb-10' : 'mb-2.5'}`}>
                {posts.length === 0 ? (
                  <></>
                  // <div className="text-center text-gray-600 py-8 flex items-center justify-center min-h-[40vh]">कोई चर्चा नहीं मिली।</div>
                ) : (
                  posts.map((post: PostType) => (
                    <div key={post._id} className="bg-[#f6f6f6] rounded-lg shadow-sm p-4">
                      {/* Post Header */}
                      <CardComponentForPost post={post as PostType} editCallBack={handleEditPost} deleteCallBack={handleDeletePostClick} userId={userId as string} />
                      {post.content && <div
                        className="mb-3 px-2 postsection-post-content-text"
                        style={{
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
                        }}
                      >
                        <span>{post.content}</span>
                        {post.pollOptions && post.pollOptions.length > 0 && (
                          <div className="flex flex-col w-full gap-3 mb-3 mt-3">
                            {post.pollOptions.map((option, index) => (
                              <div key={index}
                                className={` px-2 py-1 border border-gray-300 w-full rounded-[8px] flex justify-between items-center h-[46px] relative`}
                                onClick={() => handlePollOptionClick(post._id, index)}>
                                <div
                                  className="absolute left-0 top-0 h-full bg-[#45688233] transition-all duration-300"
                                  style={{ width: `${option.percentage}%` }}
                                />
                                <span>{option.label}</span>
                                {togglePercentage[post._id] && option.percentage && <span>{option.percentage + '%'}</span>}
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
                      }}>{post.pollOptions && post.pollOptions.length > 0 ? post.totalVotes ? 'कुल वोट: ' + post.totalVotes : '' : ''}</span>
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-0 mb-3">
                          {post.tags.map((tag, index) => (
                            <span key={index} className=" px-2 py-1 rounded-full postsection-tag-text">
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
                                isLiked={likePostClicked[post._id]}
                                onClick={() => handleLikePost(post._id)}
                                count={post.like?.length || 0}
                                countShow={post.like?.length === 0 ? false : true}
                              />
                            </div>
                            <div className="flex items-center">
                              <Dislike
                                isDisliked={dislikePostClicked[post._id]}
                                onClick={() => handleDislikePost(post._id)}
                                count={post.dislike?.length || 0}
                                countShow={post.dislike?.length === 0 ? false : true}
                              />
                            </div>
                          </div>
                          <div className="rounded-md p-2">
                            <Share
                              url={window.location.href + `/${post._id}`}
                              pathname="shareicon.svg"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Comment Section */}
                      <div className="pt-4 space-y-3">
                        {/* Write a comment */}
                        <div className="flex flex-col items-center w-full px-2 gap-2">
                          <textarea // This is your input area
                            placeholder="अपनी टिप्पणी लिखें..."
                            className={`flex-1 p-2 border rounded-md w-full h-[120px] text-sm focus:outline-none focus:ring-1 focus:ring-[#273F4F] bg-[#F8FAFB] ${errorCommentInput.get(post._id) ? 'border-red-500 shake-effect' : 'border-gray-200'}`}
                            value={commentInputs.get(post._id)}
                            onChange={(e) => handleCommentInputChange(post._id, e)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                                handleCommentSubmit(post._id);
                                e.currentTarget.value = ''; // Clear input
                              }
                            }}
                          />
                          <div className="w-full flex justify-items-start mt-1">
                            <button
                              className="bg-[#273F4F] text-white px-4 py-2 rounded-md w-fit flex items-center gap-2 item-center hover:bg-[#1e2f3a] transition-colors disabled:opacity-50"
                              onClick={() => handleCommentSubmit(post._id)} // Simplified for example
                            >
                              {loadingCommentInput.get(post._id) && <LoadingSpinner />}
                              <span className="postsection-comment-button">{'टिप्पणी करें'}</span>
                            </button>
                          </div>

                        </div>

                        {/* Existing Comments */}
                        {post.comments && post.comments.length > 0 && (
                          <div className="space-y-2">
                            {
                              post.comments
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Sort 
                                .slice(0, 1).map(comment => ( // Show first comment
                                  <div key={comment._id} className=" rounded-md p-3">
                                    <div className="flex items-center space-x-2 mb-1 flex-shrink-0">
                                      <div className="w-8 h-8 rounded-full bg-[#F0F2F4] flex items-center"><img src="/userpicturesalhuoette.svg" alt="user" className="w-4 h-4 mx-auto my-auto" /></div>
                                      <p className="postsection-comment-author-name-text font-['Noto Sans Devanagari, sans-serif']">{comment?.user?.name}</p>
                                      {/* <span>{comment.user.area_name}</span> */}
                                      <div className="flex items-center gap-[5px] min-w-10">
                                        <span className="postsection-constituency-area-text">•</span>
                                        <span className="postsection-constituency-area-text min-w-10 break-words hyphens-auto"> {comment?.user?.constituency?.area_name}</span>
                                      </div>
                                      <div className="flex items-center gap-[5px] min-w-15">
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
                                        fontSize: '0.9rem',
                                        lineHeight: '1.625rem'
                                      }}
                                    >{comment.content}</p>
                                    <div className="flex items-center space-x-4 gap-2">
                                      <div className="flex items-center space-x-1">
                                        <Like
                                          isLiked={likeCommentClicked[comment._id]}
                                          onClick={() => handleLikeComment(comment._id)}
                                          count={comment.like?.length || 0}
                                          countShow={comment.like?.length === 0 ? false : true}
                                        />
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Dislike
                                          isDisliked={dislikeCommentClicked[comment._id]}
                                          onClick={() => handleDislikeComment(comment._id)}
                                          count={comment.dislike?.length || 0}
                                          countShow={comment.dislike?.length === 0 ? false : true}
                                        />
                                      </div>
                                      {/* <span className="postsection-comment-reply-button">टिप्पणी दें</span> */}
                                    </div>
                                  </div>
                                ))}

                            {post.comments.length > 1 && (
                              <button className="postsection-comment-more-comments-button w-full mx-auto" onClick={() => router.push(`/message/messageId=${post._id}`)}
                                onFocus={() => {
                                  // Both: preload on focus
                                  router.prefetch(`/api/posts/${post._id}`);
                                }}>
                                और टिप्पणियां देखें ({post.comments.length - 1})
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {!hasNextPage && (posts.length <= MINIMUM_POSTS_THRESHOLD &&
                  <div className="flex flex-col gap-2 items-center justify-center p-4 px-8 w-full mx-auto border border-gray-300 bg-blue-100 rounded-md">
                    <h2 className="text-blue-900 font-semibold text-md ">चयनित निर्वाचन क्षेत्र में सीमित पोस्ट</h2>
                    <p className="text-sm text-center text-gray-500">{`अधिक चर्चाओं के लिए सभी निर्वाचन क्षेत्रों के पोस्ट देखें `}</p>
                    <button className='bg-[#273F4F] text-white mt-2 text-md px-4 py-2 rounded-md w-fit flex items-center item-center hover:bg-[#1e2f3a] transition-colors disabled:opacity-50' onClick={() => { setFlag(true); setSelectedConstituency(null); }}>सभी निर्वाचन क्षेत्र</button>
                  </div>)}
              </div>
            )}
            {!loadingPosts && posts.length > 0 && hasNextPage && (
              <div className="flex justify-center mb-2.5">
                <button
                  className="bg-[#7B8B95] px-4 rounded-md py-2 postsection-comment-more-posts-button"
                  onClick={() => fetchPosts(currentPage + 1, pagelimit)}
                >
                  {seemorePostsLoading ? <LoadingSpinner /> : 'और पोस्ट देखे'}
                </button>
              </div>
            )}
            {!loadingPosts && <CommunityRuleSection />}
          </div>
        </main>

        {/* Fixed "नई चर्चा" button */}
        <button onClick={() => router.push('/newPost')} className="bg-[#273F4F] text-white px-5 py-3 rounded-3xl flex items-center justify-center z-10 shadow-lg fixed bottom-18 right-1 gap-2 text-lg font-medium hover:bg-[#1e2f3a] transition-colors">
          <span className="text-xl font-bold">+</span> <span style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>नई चर्चा</span>
        </button>
      </div>
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
  )
}
