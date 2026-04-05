'use client'
import React, { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, User, MapPin, Calendar } from "lucide-react";
import { useState, useEffect } from 'react';
import type { User as UserType } from "@/interface/User";
import { ConstituencyListType } from '@/types/constituency';
import { BiharId } from "@/constants/constants";
import axios from 'axios';
import Select from 'react-select';
import { isDevanagariText, isEnglishText } from "@/utils/languageutils";
import Footer from '@/components/Footer';
import { useConstituencies } from "@/contexts/ConstituencyContext";

interface EditUserProfileProps {
    userprop: UserType;
    onUpdateUser: (updatedUser: UserType) => void;
    onBackClick: () => void;
}

const EditUserProfile = ({ userprop, onUpdateUser, onBackClick }: EditUserProfileProps) => {
    const router = useRouter()
    const { constituencyAreaList: constituencyAreaListType, loading: loadingConstituencies, error: errorConstituencies } = useConstituencies();
    const [userState, setUserState] = useState<UserType>(userprop)
    const [loading, setLoading] = useState(false);
    const [successRegisterModal, setSuccessRegisterModal] = useState(false);
    const [formData, setFormData] = useState<{
        gender: string;
        constituency: string;
        ageBracket: string;
    }>({
        gender: userprop.gender || '',
        constituency: userprop.constituency?._id || '',
        ageBracket: userprop.ageBracket || ''
    });
    // Fetch constituencies

    const genderOptions = [
        { value: 'male', label: 'पुरुष' },
        { value: 'female', label: 'महिला' },
        { value: 'other', label: 'अन्य' },
        { value: 'prefer_not_to_say', label: 'प्रियवाद नहीं' }
    ];

    const ageGroupOptions: { value: string; label: string }[] = ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'].map(age => ({
        value: age,
        label: age + ' वर्ष'
    }));

    const constituencyOptions: { value: string; label: string; english_name: string }[] = constituencyAreaListType.map((constituency: ConstituencyListType) => ({
        value: constituency._id.toString(),
        english_name: constituency.english_name as string,
        label: constituency.area_name
    }));
    const handleInputChange = (field: keyof {
        gender: string;
        constituency: string;
        ageBracket: string;
    }, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedUser = {
                ...userprop,
                gender: formData.gender,
                constituency: constituencyAreaListType.find(c => c._id === formData.constituency),
                ageBracket: formData.ageBracket
            };                        
            onUpdateUser(updatedUser);
            onBackClick();
        } catch (error) {
            console.error('Failed to update user:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className='min-h-screen bg-white flex flex-col '>
            <header className="bg-[#1E3A4C] px-4 py-4 text-white">
                <div className="flex items-center">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-white/10 rounded-full"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <h1 className="ml-4 text-xl font-medium">नागरिक प्रोफ़ाइल</h1>
                </div>
            </header>
            {/* Profile Section */}
            <div className="w-full bg-[#1E3A4C] text-white flex flex-col items-center py-6 ">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl text-gray-600">
                    <User size={40} />
                </div>
                <p className="mt-3 font-semibold tracking-widest">
                    {userState?.name || "उपलब्ध नहीं"}
                </p>
            </div>
            <form onSubmit={handleSubmit} className="w-full bg-[#C1CAD1] flex flex-col relative justify-center py-6 px-4">
                <div className="w-full flex flex-col bg-white rounded-2xl shadow-md p-4">
                    <h2 className="text-lg font-semibold mb-4 px-4">व्यक्तिगत जानकारी</h2>
                    <div className="space-y-4 px-6">
                        {/* Phone */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Phone className="text-gray-600" size={20} />
                                 <span>{userprop.phoneNumber || "उपलब्ध नहीं"}</span>
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="flex items-center w-full justify-between">
                            <div className="flex items-center gap-3 w-full">
                                <User className="text-gray-600" size={20} />
                                <Select
                                    instanceId="gender-select"
                                    placeholder="लिंग चुनें"
                                    value={genderOptions.find(option => option.value === formData.gender)}
                                    onChange={(option) => handleInputChange('gender', option?.value || '')}
                                    options={genderOptions}
                                    isSearchable={false}
                                    className="text-gray-800 w-full"
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
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3 w-full">
                                <MapPin className="text-gray-600" size={20} />
                                <Select
                                    instanceId="constituency-select"
                                    placeholder="निर्वाचन क्षेत्र चुनें"
                                    value={constituencyOptions.find(option => option.value === formData.constituency)}
                                    onChange={(option) => handleInputChange('constituency', option?.value || '')}
                                    options={constituencyOptions}                                    
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
                                    className="text-gray-800 w-full"
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
                            </div>
                            {/* <Pencil size={18} className="text-gray-500 cursor-pointer" /> */}
                        </div>

                        {/* Age */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 w-full">
                                <Calendar className="text-gray-600" size={20} />
                                <Select
                                    instanceId="age-group-select"
                                    placeholder="आयु समूह चुनें"
                                    value={ageGroupOptions.find(option => option.value === formData.ageBracket)}
                                    onChange={(option) => handleInputChange('ageBracket', option?.value || '')}
                                    options={ageGroupOptions}
                                    isSearchable={false}
                                    className="text-gray-800 w-full"
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
                            </div>
                            {/* <Pencil size={18} className="text-gray-500 cursor-pointer" /> */}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => onBackClick()}
                        className="px-10 py-2 border border-gray-300 rounded-md text-[#273F4F] font-medium bg-white hover:bg-gray-50 transition-colors"
                    >
                        रद्द करें
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 bg-[#273F4F] text-white rounded-md font-medium hover:bg-[#1e2f3a] transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'सेव हो रहा है...' : 'सेव करें'}
                    </button>
                </div>
            </form>
            <Footer />
        </div>
    )
}

export default EditUserProfile
