'use client'
import { PostType } from "@/types/post";
import { useEffect, useState } from "react";
import Select from 'react-select';
import axios from "axios";

import { trackPageView } from "@/utils/analytics";
import CharchaManchBanner from "@/components/CharchaManchBanner";

import { v4 as uuidv4 } from 'uuid';

// Helper function to find specific differences
const checkTags = (oldPost: string[], newPost: string[]) => {
    return JSON.stringify(oldPost) !== JSON.stringify(newPost);
}
const checkCategory = (oldCategory: string, newCategory: string) => {
    return oldCategory !== newCategory;
}
const findDifferences = (oldPost: PostType, newPost: PostType) => {
    const checkContent = () => {
        return oldPost.content !== newPost.content;
    }

    const checkPollOptions = () => {
        const checkLabel = () => {
            return oldPost.pollOptions?.map(option => option.label).join(',') !== newPost.pollOptions?.map(option => option.label).join(',');
        }
        const checkOrder = () => {
            return oldPost.pollOptions?.map(option => option._id).join(',') !== newPost.pollOptions?.map(option => option._id).join(',');
        }
        return checkLabel() || checkOrder();
    }

    return checkContent() || checkPollOptions();
}

interface EditPostPageProps {
    postDataProp: PostType;
    onBackClick: (success?: boolean) => void;
}
const EditPostPage = ({ postDataProp, onBackClick }: EditPostPageProps) => {
    useEffect(() => {
        trackPageView('Edit Post Page', `/editPost/${postDataProp._id}`);
    }, [postDataProp._id]);
    const [tagState, setTagState] = useState<string>(postDataProp.tags?.join(',') || '');
    const [postDataState, setPostDataState] = useState<PostType>(postDataProp);
    const [discussionCategories, setDiscussionCategories] = useState<{ _id: string; name: string; createdAt: string; __v: number }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<{ value: string; label: string } | null>(postDataProp.category ? { value: postDataProp.category._id, label: postDataProp.category.name } : null);
    const customSelectStyles = {
        control: (provided: any) => ({
            ...provided,
            backgroundColor: '#F8FAFB',
            borderColor: '#D1D5DB',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#D1D5DB',
            },
        }),
    };
    useEffect(() => {
        const fetchDiscussionCategories = async () => {
            try {
                const response = await axios.get('/api/categories');
                setDiscussionCategories(response.data.data.categories);
            } catch (err) {
                console.log('err', err);
            }
        }
        fetchDiscussionCategories();
    }, []);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const postDataUpdatePayload = { ...postDataState, tags: tagState.split(',').map(tag => tag.trim()).filter(tag => tag !== ''), category: { _id: selectedCategory?.value, name: selectedCategory?.label } };
            const res = await axios.put(`/api/posts/${postDataProp._id}`, { postData: postDataUpdatePayload });
            alert('चर्चा संपादित करने में सफल');
            onBackClick(true);
        } catch (err: any) {
            console.log('err', err);
            alert('चर्चा संपादित करने में विफल');
        }
    }
    const renderPollOptions = () => {
        return (
            <div>
                <label htmlFor="poll-options"
                    className="block mb-3 px-1"
                    style={{
                        fontFamily: 'Noto Sans Devanagari, sans-serif',
                        fontWeight: 600,
                        fontSize: '1rem',
                        lineHeight: '1',
                        letterSpacing: '0%',
                        color: '#1D2530'
                    }}>पोल विकल्प</label>
                {postDataState.pollOptions && postDataState.pollOptions.map((option, id) => {
                    return (
                        <div key={option._id} className="w-full h-[46px] flex mb-2 mt-2">
                            <input type="text" placeholder={`विकल्प ${id + 1}`} value={option.label} onChange={(e) => handlePollOptionChange(e, option._id)} className="w-4/5 bg-white p-1 text-gray-800 text-sm rounded-md"></input>
                            <div className="w-1/5 flex justify-end items-center">
                                {postDataState.pollOptions && postDataState.pollOptions.length > 2 && <button type="button" className="w-[20px] h-[20px] flex justify-center items-center rounded-full border border-gray-300 mr-10" onClick={() => {
                                    const filteredPollOptions = postDataState.pollOptions && postDataState.pollOptions.filter(item => item._id !== option._id);
                                    // filteredPollOptions && filteredPollOptions.forEach((item, index) => {
                                    //     item._id = index;
                                    // });
                                    setPostDataState({ ...postDataState, pollOptions: filteredPollOptions });
                                }}><span className="text-sm font-bold text-red-300">-</span></button>}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
    const handlePollOptionChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setPostDataState({ ...postDataState, pollOptions: postDataState.pollOptions?.map(item => item._id === id ? { ...item, label: e.target.value } : item) });
    }
    return (
        <div className="min-h-[100vh] bg-[#F6F6F6] flex flex-col items-center py-6 space-y-6">
            <main className={`w-full px-4`}>
                <CharchaManchBanner showBackButton={true} backpageUrl='/message' onBackClick={onBackClick} />
                <form onSubmit={handleSubmit} className="space-y-6 h-full mb-14">
                    <div>
                        <label
                            htmlFor="constituency-select"
                            className="block mb-3 px-1"
                            style={{
                                fontFamily: 'Noto Sans Devanagari, sans-serif',
                                fontWeight: 600,
                                fontSize: '1rem',
                                lineHeight: '1',
                                letterSpacing: '0%',
                                color: '#1D2530'
                            }}>
                            विधानसभा क्षेत्र
                        </label>
                        <Select
                            instanceId="constituency-select"
                            placeholder="निर्वाचन क्षेत्र चुनें"
                            isDisabled={true}
                            value={{ value: postDataState.constituency._id, label: postDataState.constituency.area_name }}
                            className="text-gray-800"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="category-select"
                            className="block mb-3 px-1"
                            style={{
                                fontFamily: 'Noto Sans Devanagari, sans-serif',
                                fontWeight: 600,
                                fontSize: '1rem',
                                lineHeight: '1',
                                letterSpacing: '0%',
                                color: '#1D2530'
                            }}>
                            चर्चा श्रेणी
                        </label>
                        <Select
                            id="category-select"
                            options={discussionCategories.map(c => ({
                                value: c._id,
                                label: c.name
                            }))}
                            value={selectedCategory}
                            onChange={(option) => setSelectedCategory(option)}
                            placeholder="एक श्रेणी चुनें"
                            isClearable={true}
                            styles={customSelectStyles}
                            instanceId="category-select-instance"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="discussion-text"
                            className="block mb-3 px-1"
                            style={{
                                fontFamily: 'Noto Sans Devanagari, sans-serif',
                                fontWeight: 600,
                                fontSize: '1rem',
                                lineHeight: '1',
                                letterSpacing: '0%',
                                color: '#1D2530'
                            }}>
                            {postDataProp.pollOptions && postDataProp.pollOptions.length > 0 ? 'पोल प्रश्न' : 'चर्चा का टेक्स्ट'}
                        </label>
                        <textarea
                            id="discussion-text"
                            className="w-full h-[140px] p-3 mb-4 border border-gray-300 rounded-md bg-[#F8FAFB] text-gray-800 text-sm"
                            rows={4}
                            value={postDataState.content}
                            onChange={(e) => setPostDataState({ ...postDataState, content: e.target.value })}
                        ></textarea>
                        {postDataState.pollOptions && postDataState.pollOptions.length > 0 && (
                            renderPollOptions()
                        )}
                        {postDataState.pollOptions && postDataState.pollOptions.length > 0 && <button type="button" className="justify-center items-center flex w-full mx-auto mt-6 p-1 border border-gray-300 rounded-md" onClick={() => {
                            let newPollOptions = [...postDataState.pollOptions || [], { _id: uuidv4(), label: '', votes: [], percentage: 0 }];
                            setPostDataState({ ...postDataState, pollOptions: newPollOptions });
                        }}><span className="text-xl font-bold mr-1">+ {" "}</span>विकल्प जोड़ें</button>}
                    </div>

                    {/* Poll Options */}


                    {/* Tags Input (Optional) */}
                    <div>
                        <label
                            htmlFor="tags-input"
                            className="block mb-3 px-1"
                            style={{
                                fontFamily: 'Noto Sans Devanagari, sans-serif',
                                fontWeight: 600,
                                fontSize: '1rem',
                                lineHeight: '1',
                                letterSpacing: '0%',
                                color: '#1D2530'
                            }}>
                            टैग्स (वैकल्पिक)
                        </label>
                        <input
                            type="text"
                            id="tags-input"
                            className="w-full p-3 border border-gray-300 rounded-md bg-[#F8FAFB] focus:ring-[#273F4F] focus:border-[#273F4F] text-gray-800 text-sm"
                            placeholder="टैग्स को कॉमा से अलग करें"
                            value={tagState}
                            onChange={(e) => setTagState(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-2 px-1">उदाहरण: शिक्षा, स्वास्थ्य, रोजगार</p>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => onBackClick()}
                            className="px-10 py-2 border border-gray-300 rounded-md text-[#273F4F] font-medium bg-white hover:bg-gray-50 transition-colors"
                        >
                            रद्द करें
                        </button>
                        <button
                            type="submit"
                            className={`px-6 py-2 bg-[#273F4F] text-white rounded-md font-medium hover:bg-[#1e2f3a] transition-colors ${findDifferences(postDataProp, postDataState) || checkTags(postDataState.tags as string[], tagState.split(',')) || checkCategory(postDataProp.category._id, selectedCategory?.value as string) ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`}
                        >
                            आगे बढ़ें
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EditPostPage;
