'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from 'react-select';
import axios from 'axios';
import { BiharId } from "@/constants/constants";
import { trackPageView, trackFormSubmission } from "@/utils/analytics";
import { isDevanagariText, isEnglishText } from "@/utils/languageutils";
import { ConstituencyListType } from "@/types/constituency";


const NewPostPage = () => {
    const router = useRouter();
    const [postType, setPostType] = useState<'text' | 'poll'>('text'); // 'text' or 'poll'
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<{
        constituency: string;
    }>({
        constituency: ''
    });


    useEffect(() => {
        trackPageView('New Post Page', '/newPost');
        const constituencyFromLocalStorage = JSON.parse(localStorage.getItem('constituency') || 'null');
        if (constituencyFromLocalStorage) {
            setFormData({ constituency: constituencyFromLocalStorage._id });
        }
    }, []);
    const [constituencyAreaList, setConstituencyAreaList] = useState<ConstituencyListType[]>([]);
    // Update the selectedCategory state type to match react-select's expected format
    const [selectedCategory, setSelectedCategory] = useState<{ value: string; label: string } | null>(null);
    const [postContent, setPostContent] = useState<string>('');
    const [tags, setTags] = useState<string>('');
    const [loadingConstituencies, setLoadingConstituencies] = useState(true);
    const [errorConstituencies, setErrorConstituencies] = useState<string | null>(null);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [errorCategories, setErrorCategories] = useState<string | null>(null);
    const [discussionCategories, setDiscussionCategories] = useState<{ _id: string; name: string; createdAt: string; __v: number }[]>([]);
    const [pollOptionState, setPollOptions] = useState<{ id: number, label: string }[]>([{ id: 0, label: '' }, { id: 1, label: '' }]);

    const backendUrl = process.env.NEXT_PUBLIC_API_URL;

    // Discussion categories (can be fetched from API later if needed)
    const constituencyOptions = constituencyAreaList.map((constituency: ConstituencyListType) => ({
        value: constituency._id.toString(),
        english_name: constituency.english_name as string,
        label: constituency.area_name
    }));

    useEffect(() => {
        const fetchConstituencyAreaList = async () => {
            setLoadingConstituencies(true);
            try {
                const response = await axios.get(`/api/constituencies`);
                setLoading(true);
                let data: ConstituencyListType[] = response.data;
                data = data.filter((ele: { _id: string, area_name: string }) => ele._id !== BiharId)
                setConstituencyAreaList(data);
            } catch (err) {
                console.error('Failed to fetch constituencies:', err);
                setErrorConstituencies('निर्वाचन क्षेत्रों को लोड करने में विफल');
            } finally {
                setLoadingConstituencies(false);
                setLoading(false);
            }
        };
        const fetchDiscussionCategories = async () => {
            try {
                // const response = await fetch(`${backendUrl}/api/categories`);
                const response = await axios.get(`/api/categories`)
                // if (!response.ok) {
                //     throw new Error(`HTTP error! status: ${response.status}`);
                // }
                const data: { data: { categories: { _id: string; name: string, createdAt: string, __v: number }[] } } = response.data;
                setDiscussionCategories(data?.data?.categories);
            }
            catch (err) {
                setErrorCategories('चर्चा श्रेणियों को लोड करने में विफल');
            }
            finally {
                setLoadingCategories(false);
            }
        };
        fetchConstituencyAreaList();
        fetchDiscussionCategories();
    }, [backendUrl]);

    const handleClose = () => {
        router.push('/message'); // Navigate back to the message page
    };

    const handleCancel = () => {
        // Optionally clear form fields
        setFormData({ constituency: '' });
        setSelectedCategory(null);
        setPostContent('');
        setTags('');
        handleClose(); // Go back to message page
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        // Validate required fields
        if (postType === 'poll') {
            if (!formData.constituency || !selectedCategory || !postContent.trim() || pollOptionState.some(option => option.label.trim() === '')) {
                alert('कृपया सभी आवश्यक फ़ील्ड भरें');
                return;
            }
        }
        else {
            if (!formData.constituency || !selectedCategory || !postContent.trim()) {
                alert('कृपया सभी आवश्यक फ़ील्ड भरें');
                return;
            }
        }

        try {
            const postData = {
                category: selectedCategory.value,
                content: postContent.trim(),
                author: "dummyvaluetobereplacedlaterinbackend",
                pollOptions: postType === 'poll' ? pollOptionState.map(option => ({ id: option.id, label: option.label })) : [],
                constituency: formData.constituency,
                pollType: 'single',
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
                link: "https://example.com/article" // You can make this dynamic if needed
            };


            await axios.post(`${backendUrl}/api/posts`, postData);

            // Show success message or navigate away
            alert('चर्चा सफलतापूर्वक शुरू की गई!');
            handleClose(); // Navigate back to message page

        } catch (error: any) {
            alert(`तकनीकी त्रुटि, चर्चा शुरू करने में विफल`);
        }
    };

    const customSelectStyles = {
        control: (provided: any) => ({
            ...provided,
            backgroundColor: '#F8FAFB', // Light gray background for input
            border: '1px solid #d1d5db', // Light border
            borderRadius: '0.375rem', // Rounded corners
            padding: '0.25rem', // Padding inside
            minHeight: '44px', // Standard height
            boxShadow: 'none', // No shadow
            '&:hover': {
                borderColor: '#9ca3af', // Darker border on hover
            },
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: '#6b7280', // Gray placeholder text
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: '#1f2937', // Darker text for selected value
        }),
        option: (provided: any, state: { isSelected: boolean; isFocused: boolean }) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#273F4F' : state.isFocused ? '#e5e7eb' : 'white',
            color: state.isSelected ? 'white' : '#1f2937',
            '&:active': {
                backgroundColor: '#273F4F',
            },
        }),
        menu: (provided: any) => ({
            ...provided,
            zIndex: 100, // Ensure dropdown menu appears above other content
        }),
    };
    const handlePollOptionChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        setPollOptions(prev => prev.map(option => option.id === id ? { ...option, label: e.target.value } : option));
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
                {pollOptionState.map((option) => {
                    return (
                        <div key={option.id} className="w-full h-[46px] flex mb-2 mt-2">
                            <input type="text" placeholder={`विकल्प ${option.id + 1}`} value={option.label} onChange={(e) => handlePollOptionChange(e, option.id)} className="w-4/5 bg-white p-1 text-gray-800 text-sm rounded-md"></input>
                            <div className="w-1/5 flex justify-end items-center">
                                {pollOptionState.length > 2 && <button type="button" className="w-[20px] h-[20px] flex justify-center items-center rounded-full border border-gray-300 mr-10" onClick={() => {
                                    const filteredPollOptions = pollOptionState.filter(item => item.id !== option.id);
                                    filteredPollOptions.forEach((item, index) => {
                                        item.id = index;
                                    });
                                    setPollOptions(filteredPollOptions);
                                }}><span className="text-sm font-bold text-red-300">-</span></button>}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    return (
        <div className="min-h-[100vh] bg-[#F6F6F6] flex flex-col items-center py-6 px-4">
            <button onClick={handleClose} className="absolute top-20 right-4 text-gray-400 hover:text-gray-700 z-10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            {/* Main Form Card */}
            <div className="rounded-lg w-full relative h-full mb-14">
                {/* Close Button */}


                {/* Post Type Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1 mb-6 w-full w-full mx-auto gap-2 ">
                    <button
                        className={`flex-1 py-1 px-1 rounded-md max-w-[70px] text-base ${postType === 'text' ? 'bg-[#273F4F] text-white font-bold' : 'text-gray-700 bg-white font-medium'}`}
                        onClick={() => setPostType('text')}
                    >
                        <img
                            src="/text.svg"
                            className={`w-3.5 h-3.5 mr-1 inline-block ${postType === 'text' ? 'brightness-0 invert' : 'brightness-0'}`}
                            alt="text icon"
                        />टेक्स्ट
                    </button>
                    <button
                        className={`flex-1 py-1 px-1 rounded-md max-w-[70px] text-base ${postType === 'poll' ? 'bg-[#273F4F] text-white font-bold' : 'text-gray-700 bg-white font-medium'}`}
                        onClick={() => setPostType('poll')}
                    >
                        <img
                            src="/poll.svg"
                            className={`w-4 h-4 mr-1 inline-block ${postType === 'poll' ? 'brightness-0 invert' : 'brightness-0'}`}
                            alt="poll icon"
                        />पोल
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Constituency Dropdown */}
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
                        {loadingConstituencies ? (
                            <div className="text-center text-gray-500">Loading constituencies...</div>
                        ) : errorConstituencies ? (
                            <div className="text-center text-red-500">{errorConstituencies}</div>
                        ) : (
                            <Select
                                instanceId="constituency-select"
                                placeholder="निर्वाचन क्षेत्र चुनें"
                                value={constituencyOptions.find(option => option.value === formData.constituency)}
                                onChange={(option) => handleInputChange('constituency', option?.value || '')}
                                options={constituencyOptions}
                                isLoading={loading}
                                filterOption={(option: { value: string, label: string, data: { value: string, label: string, english_name: string } }, inputValue) => {
                                    if (!inputValue) return true;
                                    const searchTerm = inputValue.toLowerCase().trim();
                                    const hindiName = option.label.toLowerCase();
                                    const englishName = option.data.english_name.toLowerCase().trim();
                                    const isInputDevanagari = isDevanagariText(inputValue);
                                    const isInputEnglish = isEnglishText(inputValue);
                                    if (isInputDevanagari) {
                                        return hindiName.includes(searchTerm) || englishName.includes(searchTerm);
                                    } else if (isInputEnglish) {
                                        return englishName.length > 0 && englishName.includes(searchTerm);
                                    } else {
                                        // Fallback: search in both
                                        return hindiName.includes(searchTerm) || (englishName.length > 0 && englishName.includes(searchTerm));
                                    }
                                }}
                                className="text-gray-800"
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.5rem',
                                        minHeight: '48px',
                                        '&:hover': {
                                            borderColor: '#273F4F'
                                        }
                                    }),
                                    placeholder: (provided) => ({
                                        ...provided,
                                        color: '#6b7280'
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isSelected ? '#273F4F' : state.isFocused ? '#f3f4f6' : 'white',
                                        color: state.isSelected ? 'white' : '#1f2937'
                                    })
                                }}
                            />
                        )}
                    </div>

                    {/* Discussion Category Dropdown */}
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

                    {/* Discussion Text Area */}
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
                            {postType === 'text' ? 'चर्चा का टेक्स्ट' : 'पोल प्रश्न'}
                        </label>
                        <textarea
                            id="discussion-text"
                            className="w-full p-3 mb-4 border border-gray-300 rounded-md bg-[#F8FAFB] focus:ring-[#273F4F] focus:border-[#273F4F] text-gray-800 text-sm"
                            rows={4}
                            placeholder={postType === "text" ? "अपनी बात साझा करें ..." : "अपना प्रश्न लिखें ..."}
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                        ></textarea>
                        {postType === 'poll' && renderPollOptions()}
                        {postType === 'poll' && <button type="button" className="justify-center items-center flex w-full mx-auto mt-6 p-1 border border-gray-300 rounded-md" onClick={() => setPollOptions(prev => [...prev, { id: prev.length, label: '' }])}><span className="text-xl font-bold mr-1">+ {" "}</span>विकल्प जोड़ें</button>}
                    </div>

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
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-2 px-1">उदाहरण: शिक्षा, स्वास्थ्य, रोजगार</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-10 py-2 border border-gray-300 rounded-md text-[#273F4F] font-medium bg-white hover:bg-gray-50 transition-colors"
                        >
                            रद्द करें
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#273F4F] text-white rounded-md font-medium hover:bg-[#1e2f3a] transition-colors"
                        >
                            चर्चा शुरू करें
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewPostPage;