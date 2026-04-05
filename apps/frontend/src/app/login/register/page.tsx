'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from 'react-select';
import axios from "axios";
import NewModalLogin from "@/components/newModalLogin";
import { BiharId } from "@/constants/constants";
import { trackPageView, trackFormSubmission } from "@/utils/analytics";
import { ConstituencyListType } from "@/types/constituency";
import { isDevanagariText, isEnglishText } from "@/utils/languageutils";

export interface FormData {
    phoneNumber: string;
    gender: string;
    constituency: string;
    ageBracket: string;
}

const decryptMobileNumber = (encryptedMobile: string): string => {
    try {
        // Decode base64 and remove salt
        const salt = 'charchamanch2024';
        const decoded = atob(encryptedMobile);
        return decoded.replace(salt, '');
    } catch (error) {
        console.error('Failed to decrypt mobile number:', error);
        return '';
    }
};

const randomUserNameFetch = async () => {
    try {
        const response = await axios.get('/api/users/randomUserName');
        return response.data.userName;
    }
    catch (err: any) {
        alert(err.message)
    }
}

export default function RegisterPage() {
    const router = useRouter();
    const [constituencyAreaList, setConstituencyAreaList] = useState<ConstituencyListType[]>([]);
    const [loading, setLoading] = useState(false);
    const [successRegisterModal, setSuccessRegisterModal] = useState(false);
    const [tncstate, setTncState] = useState(true);
    useEffect(() => {
        trackPageView('Register Page', '/login/register');
    }, []);
    const [formData, setFormData] = useState<FormData>({
        phoneNumber: '',
        gender: '',
        constituency: '',
        ageBracket: '',    
    });
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalMessage, setAuthModalMessage] = useState('');
    const [primaryButtonText, setPrimaryButtonText] = useState('आगे बढ़ें');
    const [primaryButtonLink, setPrimaryButtonLink] = useState('/');

    // Fetch constituencies
    useEffect(() => {
        const fetchConstituencies = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/constituencies');
                let data: ConstituencyListType[] = response.data;
                data = data.filter((ele: ConstituencyListType) => ele._id !== BiharId)
                setConstituencyAreaList(data);
            } catch (error) {
                console.error('Failed to fetch constituencies:', error);
            } finally {
                setLoading(false);
            }
        };
        const fetchMobileNumberFromParams = async () => {

            const urlParams = new URLSearchParams(window.location.search);
            const encryptedMobile = urlParams.get('user');

            if (encryptedMobile) {
                const decryptedMobile = decryptMobileNumber(encryptedMobile);
                if (decryptedMobile) {
                    setFormData(prev => ({
                        ...prev,
                        phoneNumber: decryptedMobile
                    }));
                }
            }
        };

        const restoreFormData = () => {
            const savedFormData = localStorage.getItem('registerFormData');
            if (savedFormData) {
                try {
                    const parsedData = JSON.parse(savedFormData);
                    setFormData(parsedData);
                } catch (error) {
                    console.error('Failed to parse saved form data:', error);
                }
            }
        };

        fetchMobileNumberFromParams();
        restoreFormData();
        fetchConstituencies();
    }, []);

    const genderOptions = [
        { value: 'male', label: 'पुरुष' },
        { value: 'female', label: 'महिला' },
        { value: 'other', label: 'अन्य' },
        { value: 'prefer_not_to_say', label: 'प्रियवाद नहीं' }
    ];

    const ageGroupOptions = ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'].map(age => ({
        value: age,
        label: age + ' वर्ष'
    }));

    const constituencyOptions = constituencyAreaList.map((constituency: ConstituencyListType) => ({
        value: constituency._id.toString(),
        english_name: constituency.english_name as string,
        label: constituency.area_name
    }));

    const handleInputChange = (field: keyof FormData, value: string) => {
        const newFormData = {
            ...formData,
            [field]: value
        };
        setFormData(newFormData);
        // Save to localStorage for persistence
        localStorage.setItem('registerFormData', JSON.stringify(newFormData));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        if (!tncstate) {
            alert('कृपया टर्म्स ऑफ़ सर्विस और डिस्क्लेमर पॉलिसी से सहमत हों');
            return;
        }
        if (!formData.gender || !formData.constituency || !formData.ageBracket) {
            alert('कृपया सभी फ़ील्ड भरें');
            return;
        }
        try {
            trackFormSubmission('register_form', true);
            const getUniqueUserName = await randomUserNameFetch();
            const payload = { ...formData, name: getUniqueUserName }
            const response = await axios.post('/api/users/create', payload);
            localStorage.setItem('userId', response.data.user._id)
            localStorage.setItem('jwtToken', response.data.token)
            localStorage.setItem('constituency', JSON.stringify(response.data.user.constituency))
            // Clear saved form data after successful registration
            localStorage.removeItem('registerFormData');
            setSuccessRegisterModal(true);
            setTimeout(() => {
                setSuccessRegisterModal(false);
                router.push('/');
            }, 2000);
        } catch (error) {
            console.error('Failed to register:', error);
            setAuthModalMessage('पंजीकरण असफल हुआ है।')
            setPrimaryButtonText('दोबारा कोशिश करें');
            setPrimaryButtonLink('/login');
            setShowAuthModal(true);
        }
        // You can add API call here to register the user
    };

    const handleClose = () => {
        // Clear saved form data when user closes the form
        localStorage.removeItem('registerFormData');
        router.push('/');
    };

    const handleSecondaryButtonClick = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('registerFormData');
        router.push('/');
    };

    return (
        <div className="min-h-screen relative bg-[#F6F6F6] flex justify-center px-2" >
            <div className={`bg-white rounded-lg w-full p-4  ${showAuthModal || successRegisterModal ? 'blur-sm' : ''}`}>
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header Section */}
                <div className="text-center pt-8 pb-6 px-6">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-[#273F4F] rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.26c-.3.4-.47.88-.47 1.4V20h6z" />
                        </svg>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        आपका चुनावी साथी
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-600 text-sm">
                        लोकतंत्र में भागीदारी का नया तरीका
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
                    {/* Mobile Number */}
                    <div>
                        <label className="block text-gray-800 text-sm font-medium mb-2">
                            मोबाइल नंबर
                        </label>
                        <input
                            type="tel"
                            value={formData.phoneNumber.replace(/./g, '*')}
                            readOnly
                            //   onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                            //   placeholder="**********"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#273F4F] focus:border-transparent"
                            maxLength={10}
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-gray-800 text-sm font-medium mb-2">
                            लिंग
                        </label>
                        <Select
                            instanceId="gender-select"
                            placeholder="लिंग चुनें"
                            value={genderOptions.find(option => option.value === formData.gender)}
                            onChange={(option) => handleInputChange('gender', option?.value || '')}
                            options={genderOptions}
                            isSearchable={false}
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
                    </div>

                    {/* Constituency */}
                    <div>
                        <label className="block text-gray-800 text-sm font-medium mb-2">
                            निर्वाचन क्षेत्र
                        </label>
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
                    </div>

                    {/* Age Group */}
                    <div>
                        <label className="block text-gray-800 text-sm font-medium mb-2">
                            आयु समूह
                        </label>
                        <Select
                            instanceId="age-group-select"
                            placeholder="आयु समूह चुनें"
                            value={ageGroupOptions.find(option => option.value === formData.ageBracket)}
                            onChange={(option) => handleInputChange('ageBracket', option?.value || '')}
                            options={ageGroupOptions}
                            isSearchable={false}
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
                    </div>
                    <div className="flex justify-center items-center gap-2">
                        <input type="checkbox" checked={tncstate} onChange={(e) => setTncState(e.target.checked)} />
                        <span className="text-sm text-gray-600">
                            मैं <a href="/terms" className="text-indigo-600 ">टर्म्स ऑफ़ सर्विस</a> और <a href="/privacy" className="text-indigo-600">डिस्क्लेमर पॉलिसी</a> से सहमत हूँ।
                        </span>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#273F4F] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1e2f3a] transition-colors mt-6"
                    >
                        आगे बढ़ें
                    </button>
                </form>
            </div>
            <NewModalLogin
                isOpen={successRegisterModal}
                message={'पंजीकरण सफल हुआ है।'}
                onClose={() => setSuccessRegisterModal(false)}
                successModal={true}
                showButtons={false}
            />
            <NewModalLogin
                isOpen={showAuthModal}
                message={authModalMessage}
                onClose={handleSecondaryButtonClick}
                primaryButtonText={primaryButtonText}
                primaryButtonLink={primaryButtonLink}
                secondaryButtonText="बंद करें"
                secondaryButtonLink="/"
            />
        </div >
    );
}