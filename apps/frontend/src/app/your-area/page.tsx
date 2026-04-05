'use client'
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { useEffect, useState, Suspense, useRef } from "react";
import Select, { type SelectInstance } from 'react-select';
import axios from 'axios';
import NewModalLogin from "@/components/newModalLogin";
import { useUser } from "@/contexts/UserContext";
import { BiharId } from "@/constants/constants";
import { trackPageView } from "@/utils/analytics";
import { ConstituencyListType } from "@/types/constituency";
import { isDevanagariText, isEnglishText } from "@/utils/languageutils";

interface ConstituencyInfoType {
  area_name: string;
  vidhayak_info: {
    name: string;
    image_url: string;
    age: number;
    last_election_vote_percentage: string;
    experience: number;
    party_name: string;
    party_icon_url: string;
    manifesto_link: string;
    manifestore_score: number;
    metadata: {
      education: string;
      net_worth: string;
      criminal_cases: number;
      attendance: string;
      questions_asked: string;
      funds_utilisation: string;
    };
    survey_score: SurveyObjectVidhayakInfoType[];
  };
  dept_info: {
    id: string;
    dept_name: string;
    work_info: string[];
    average_score: number;
    survey_score: SurveyObjectType[];
  }[];
  other_candidates: {
    id: number;
    candidate_name: string;
    candidate_image_url: string;
    candidate_party: string;
    vote_share: string;
  }[];
  latest_news: Array<{
    title: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}
interface constituencyListType {
  _id: number;
  area_name: string;
}

interface SurveyObjectType {
  question: string;
  ratings: {
    "1": string[];
    "2": string[];
    "3": string[];
    "4": string[];
    "5": string[];
  };
  score: number;
}
interface SurveyObjectVidhayakInfoType {
  question: string;
  yes_votes: string[];
  no_votes: string[];
  score: number;
}
// Create a wrapper component that uses useSearchParams
function YourAreaPageContent({ setShowAuthModal, setAuthModalMessage }: { showAuthModal: boolean, setShowAuthModal: (showAuthModal: boolean) => void, authModalMessage: string, setAuthModalMessage: (authModalMessage: string) => void }) {
  useEffect(() => {
    trackPageView('Your Area Page', '/your-area');
  }, []);
  const router = useRouter();
  const selectRef = useRef<any>(null);
  const messageRef = useRef<HTMLSpanElement>(null);
  const [constituency, setConstituency] = useState<string | null>(null);
  const [constituencyInfo, setConstituencyInfo] = useState<ConstituencyInfoType | null>(null);
  const [loading, setLoading] = useState(false);
  const [constituencyButtonStates, setConstituencyButtonStates] = useState<{ [key: string]: 'yes' | 'no' }>({});
  const [selectedConstituency, setSelectedConstituency] = useState<ConstituencyListType | null>(null);
  const [constituencyAreaList, setConstituencyAreaList] = useState<ConstituencyListType[]>([]);
  const [deptRatings, setDeptRatings] = useState<{ [key: string]: number }>({});
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  const { user } = useUser();
  const [updatedPollScore, setUpdatedPollScore] = useState<number>(0);
  const [canEditStarRating, setCanEditStarRating] = useState<{ [key: string]: boolean }>({});
  const [showIconInfoMessage, setShowIconInfoMessage] = useState<{ [key: string]: boolean }>({});
  const [showExperienceInfo, setShowExperienceInfo] = useState(false);
  const experienceRef = useRef<HTMLDivElement>(null);
  // Get constituency from URL on client side
  useEffect(() => {
    const fetchConstituencyData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const constituencyParam = urlParams.get('constituency');

      if (!constituencyParam) {
        const constituencyFromLocalStorage: ConstituencyListType | null = JSON.parse(localStorage.getItem('constituency') || 'null');
        if (constituencyFromLocalStorage) {
          setConstituency(constituencyFromLocalStorage.area_name);
          setSelectedConstituency(constituencyFromLocalStorage);
        }
      } else {
        setConstituency(constituencyParam);
        const response = await axios.get(`/api/constituencies`);
        let data: ConstituencyListType[] = response.data;
        data = data.filter((ele: ConstituencyListType) => ele._id !== BiharId);
        const datavalue = data.find((c: ConstituencyListType) => c.area_name === constituencyParam)
        setSelectedConstituency(datavalue || null);
      }
    };
    fetchConstituencyData();

  }, []);

  useEffect(() => {
    const fetchConstituencyAreaList = async () => {
      setLoading(true);

      try {
        const response = await axios.get(`/api/constituencies`);
        let data: ConstituencyListType[] = response.data;
        data = data.filter((ele: ConstituencyListType) => ele._id !== BiharId)
        setConstituencyAreaList(data);
      } catch (err) {
        setError('Failed to load constituencies');
      } finally {
        setLoading(false);
      }
    }

    fetchConstituencyAreaList();
  }, [backendUrl])

  const [error, setError] = useState<string | null>(null);

  const handleConstituencySelect = async (constituencyProp: ConstituencyListType) => {
    setConstituency(constituencyProp?.area_name);
    setSelectedConstituency(constituencyProp);
    // router.push(`/your-area?constituency=${constituencyProp?.area_name}`);
  }

  const updateRatings = (constituencyInfoData: ConstituencyInfoType, userId: string) => {
    const deptRatingsTempObject: { [key: string]: number } = {};

    for (const dept of constituencyInfoData.dept_info) {
      let found = false;

      for (const survey of dept.survey_score) {
        for (const rating of Object.keys(survey.ratings)) {
          if (survey.ratings[rating as keyof typeof survey.ratings].includes(userId as string)) {
            deptRatingsTempObject[dept.id] = Number(rating);
            setCanEditStarRating(prev => ({
              ...prev,
              [dept.id]: false
            }));
            found = true;
            break; // This will break out of the rating loop
          }
        }
        if (found) break; // This will break out of the survey loop
      }

      if (!found) {
        setCanEditStarRating(prev => ({
          ...prev,
          [dept.id]: true
        }));
      }
    }

    setDeptRatings(deptRatingsTempObject);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
        setShowIconInfoMessage({});
      }
    };
    const handleClickOutsideExperience = (event: MouseEvent) => {
      if (experienceRef.current && !experienceRef.current.contains(event.target as Node)) {
        setShowExperienceInfo(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutsideExperience);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutsideExperience);
    };
  }, []);

  const updateYesNoVotes = (constituencyInfoData: ConstituencyInfoType, userId: string) => {
    const yesNoVotes: any = constituencyInfoData.vidhayak_info.survey_score.map((survey: SurveyObjectVidhayakInfoType) => {
      if (survey.yes_votes.includes(userId as string)) {
        return 'yes';
      }
      else if (survey.no_votes.includes(userId as string)) {
        return 'no';
      }
      return null;
    })
    setConstituencyButtonStates(prev => ({
      ...prev,
      [constituencyInfoData.area_name]: yesNoVotes[0]
    }));
  }
  useEffect(() => {
    if (constituency) {
      const fetchConstituencyInfo = async () => {
        setLoading(true);
        try {

          const response = await axios.get(`/api/constituencies/${constituency}`);
          setConstituencyInfo(response.data);
          const userId = localStorage.getItem('userId');
          if (userId) {
            updateRatings(response.data, userId);
            updateYesNoVotes(response.data, userId);
          }
          else {
            for (const dept of response.data.dept_info) {
              setCanEditStarRating(prev => ({
                ...prev,
                [dept.id]: true
              }));
            }
          }
        } catch (err) {
          setError('Failed to fetch constituency information');
        } finally {
          setLoading(false);
        }
      }
      fetchConstituencyInfo();
    }
  }, [constituency]);


  if (!constituency) {

    return (
      <div className="bg-[#c1cbd1]">
        {/* Header Container - Full Width */}
        <div className="bg-[#273F4F] shadow-sm border-b border-gray-200 text-center relative overflow-hidden">
          {/* Background PNG Image */}
          <img
            src="/flyer-charcha-mach-your-area/aapke-shetra-flyer.PNG"
            alt="Aapke Shetra Flyer"
            className="absolute -top-6 left-0 right-0 w-[150%] h-[210%] object-cover opacity-100"
          />

          {/* Content with higher z-index */}
          <div className="relative z-10 pt-8 pb-12">
            <p className="aapke-kshetra-ki"
              style={{
                fontWeight: 600,
                fontSize: '1.5rem',
                letterSpacing: '0'
              }}
            >
              <span style={{ color: '#a4abb6ff' }}>आपके क्षेत्र की</span><br />
              <span style={{ color: '#DC3C22' }}>जानकारी</span>
            </p>
          </div>
        </div>

        {/* Content Section - Centered */}
        <div className="flex flex-col items-center justify-center px-4 py-6">
          <div className="mb-6 w-full mx-auto p-4">
            <Select
              placeholder="अपना निर्वाचन क्षेत्र खोजें..."
              value={selectedConstituency ? {
                value: selectedConstituency._id,
                label: selectedConstituency.area_name,
                english_name: selectedConstituency.english_name || ''
              } : null}
              onChange={(option) => {
                if (option && option.value) {
                  const constituencyValue = constituencyAreaList.find(c => c._id === option.value);
                  if (constituencyValue && constituencyValue._id) {
                    handleConstituencySelect(constituencyValue);
                  }
                }
                else {
                  setTimeout(() => {
                    selectRef.current?.focus();
                    selectRef.current?.onMenuOpen();
                  }, 100);
                }
              }}
              options={constituencyAreaList.map(c => ({ value: c._id, label: c.area_name, english_name: c.english_name as string }))}
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
              isSearchable={true}
              isClearable={true}
              className="text-gray-800 z-30"
              instanceId="constituency-select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: '#e5e7eb',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  minHeight: 'auto'
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: '#6b7280'
                }),
                input: (provided) => ({
                  ...provided,
                  color: '#1f2937'
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? '#273F4F' : state.isFocused ? '#f3f4f6' : 'white',
                  color: state.isSelected ? 'white' : '#1f2937',
                  '&:hover': {
                    backgroundColor: state.isSelected ? '#273F4F' : '#f3f4f6'
                  }
                }),
                menu: (provided) => ({
                  ...provided,
                  zIndex: 50
                })
              }}
            />
          </div>
          <div className="bg-[#f6f6f6] rounded-lg shadow-sm p-8 text-center max-w-md mx-4 mb-2">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#273F4F] mb-2">कृपया निर्वाचन क्षेत्र चुनें</h2>
            <p className="text-gray-600 mb-4">देखने के लिए किसी निर्वाचन क्षेत्र का चयन करें</p>
            <button
              onClick={() => router.push('/')}
              className="bg-[#273F4F] text-white px-6 py-2 rounded-lg hover:bg-[#1e2f3a] transition-colors"
            >
              होम पेज पर जाएं
            </button>
          </div>
        </div>
      </div>
    );
  }


  async function handlePollSubmit(constituencyAreaName: string, poll_category: string = 'vidhayak', poll_response: string, question_id: number, dept_id?: string) {
    try {


      const response = await axios.post(`/api/constituencies/poll/${constituencyAreaName}`, {
        poll_response: poll_response,
        poll_category: poll_category,
        question_id: question_id,
        dept_id: dept_id
      });
      setConstituencyButtonStates(prev => ({
        ...prev,
        [constituencyAreaName]: poll_response as 'yes' | 'no'
      }));
      const data = response.data;
      // setConstituencyInfo((prev)=>{
      //   ...prev,
      //   vidhayak_info:{
      //     ...prev.vidhayak_info,

      //   }
      // })
      setConstituencyInfo((prev: ConstituencyInfoType | null) => {
        if (!prev) return prev;

        return {
          ...prev,
          vidhayak_info: {
            ...prev?.vidhayak_info,
            survey_score: prev?.vidhayak_info.survey_score.map(survey => ({ ...survey, score: data.updated_scores.question_score }))
          }
        }
      })
      setUpdatedPollScore(data.updated_scores.question_score);
    }
    catch (err: any) {
      // console.error('Failed to submit poll:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setShowAuthModal(true);
        setAuthModalMessage('आपको लॉगिन करना होगा वोट देने के लिए।');
      }
    }
    finally {
      // console.log('Poll submitted successfully');
    }
  }
  const handleStarRatingPoll = async (deptId: string, rating: number) => {

    try {
      const response = await axios.post(`/api/constituencies/poll/${constituency}`, {
        poll_response: rating.toString(),
        poll_category: 'dept',
        question_id: 0,
        dept_id: deptId
      });
      const data = response.data;

      setDeptRatings(prev => ({
        ...prev,
        [deptId]: rating
      }));
      // Properly update constituencyInfo state
      setConstituencyInfo(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          dept_info: prev.dept_info.map(dept => {
            if (dept.id === deptId) {
              return {
                ...dept,
                survey_score: dept.survey_score.map((score, index) => {
                  if (index === 0) {
                    return {
                      ...score,
                      score: data.updated_scores.question_score
                    };
                  }
                  return score;
                })
              };
            }
            return dept;
          })
        };
      });

    } catch (err: any) {
      // console.error('Failed to submit star rating poll:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setShowAuthModal(true);
        setAuthModalMessage('आपको रेटिंग देने के लिए लॉगिन करना होगा।');
      }
    }
    finally {
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#273F4F] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading constituency information...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Not able to get data due to {error} </p>
        </div>
      </div>
    );
  }
  // Add these variables to get button states for this constituency


  const isYesSelected = constituencyButtonStates[constituencyInfo?.area_name as string] === 'yes';
  const isNoSelected = constituencyButtonStates[constituencyInfo?.area_name as string] === 'no';
  const experienceInfoMessage = `पद धारण की संख्या- विधानसभा चुनाव/उपचुनाव में किसी निर्वाचन क्षेत्र से विधायक के रूप में चुने जाने की संख्या
स्रोत - बिहार विधानसभा. (2020), Member- Member-Dt of Birth-Term, उपलब्ध: https://vidhansabha.bihar.gov.in/`;
  return (
    <div className="bg-[#c1cbd1]">
      {/* Main content */}
      <main className="px-4 py-2.5">
        <div className="space-y-2.5">
          <div className="w-full mx-auto">
            <Select
              ref={selectRef}
              placeholder="अपना निर्वाचन क्षेत्र खोजें..."
              value={selectedConstituency ? {
                value: selectedConstituency._id,
                label: selectedConstituency.area_name,
                english_name: selectedConstituency.english_name || ''
              } : null}
              onChange={(option) => {
                if (option) {
                  const constituency = constituencyAreaList.find(c => c._id === option.value);
                  if (constituency) {
                    handleConstituencySelect(constituency);
                  }
                } else {
                  // When cleared, open the dropdown
                  setConstituency(null);
                  setSelectedConstituency(null);
                  setTimeout(() => {
                    selectRef.current?.focus();
                    selectRef.current?.onMenuOpen();
                  }, 100);
                  router.push('/your-area');
                }
              }}
              options={constituencyAreaList.map(c => ({
                value: c._id,
                label: c.area_name,
                english_name: c.english_name || ''
              }))}
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
              isSearchable={true}
              isClearable={true}
              className="text-gray-800"
              instanceId="constituency-select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: '#e5e7eb',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  minHeight: 'auto'
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: '#6b7280'
                }),
                input: (provided) => ({
                  ...provided,
                  color: '#1f2937'
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? '#273F4F' : state.isFocused ? '#f3f4f6' : 'white',
                  color: state.isSelected ? 'white' : '#1f2937',
                  '&:hover': {
                    backgroundColor: state.isSelected ? '#273F4F' : '#f3f4f6'
                  }
                }),
                clearIndicator: (provided) => ({
                  ...provided,
                  cursor: 'pointer',
                  padding: '6px',
                  color: '#6b7280',
                  '&:hover': {
                    color: '#1f2937'
                  }
                }),
                menu: (provided) => ({
                  ...provided,
                  zIndex: 50
                })
              }}
            />
          </div>
          {/* Constituency Information */}
          <div className="bg-[#273F4F] rounded-lg shadow-sm text-center relative overflow-hidden">
            {/* Background PNG Image */}
            <img
              src="/flyer-charcha-mach-your-area/aapke-shetra-flyer.PNG"
              alt="Aapke Shetra Flyer"
              className="absolute -top-12 left-0 right-0 w-full h-[250%] object-cover opacity-100"
            />

            {/* Content with higher z-index */}
            <div className="relative z-10 pt-6 pb-12">
              <p className=" mb-2 candidate-profile-main-heading-area-name"
                style={{
                  fontFamily: 'Noto Sans Devanagari, sans-serif',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '0'
                }}
              >{constituencyInfo?.area_name}</p>
              <p className="aapke-kshetra-ki"
                style={{
                  fontWeight: 600,
                  letterSpacing: '0'
                }}
              >
                <span style={{ color: '#a4abb6ff' }}>आपके क्षेत्र की </span>
                <span style={{ color: '#DC3C22' }}>जानकारी</span>
              </p>
            </div>
          </div>

          <div className="relative flex flex-col bg-[#f6f6f6] rounded-lg shadow-sm p-6 items-start space-x-3">
            {/* Profile Picture */}
            <div className="absolute top-0.5 right-[-10px] bg-[#D3DADF] px-4.5 py-1.5 rounded-md">
              <div className="text-center">
                <span
                  className="font-bold font-[Noto_Sans_Devanagari] text-[#273F4F]"
                  style={{ fontFamily: 'Noto Sans Devanagari, sans-serif', fontWeight: 700, letterSpacing: '0' }}
                >
                  विधायक
                </span>
              </div>
            </div>
            <div className="flex items-start space-x-4 mt-4">
              <div className="w-20 h-20 aspect-square overflow-hidden flex-shrink-0">
                <img
                  src={constituencyInfo?.vidhayak_info.image_url}
                  alt={constituencyInfo?.vidhayak_info.name}
                  className="w-full h-full rounded-full object-cover border-2 border-gray-300"
                />
              </div>
              {/* <img
                src={constituencyInfo?.vidhayak_info.image_url}
                alt={constituencyInfo?.vidhayak_info.name}
                className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover opacity-100"
              /> */}
              {/* Candidate Info */}
              <div className="flex-1">
                <div className="candidate-profile-heading">
                  <span
                    className="font-bold text-xl text-[#1D2530] block"
                    style={{
                      fontFamily: 'Noto Sans Devanagari, sans-serif',
                      fontWeight: 700,
                      letterSpacing: '0'
                    }}
                  >
                    {constituencyInfo?.vidhayak_info.name}
                  </span>
                </div>
                <div
                  className="font-normal text-base text-[#7B899D] candidate-profile-subheading"
                  style={{
                    fontFamily: 'Noto Sans Devanagari',
                    fontWeight: 500,
                    letterSpacing: '0',
                  }}
                >
                  उम्र: {constituencyInfo?.vidhayak_info.age} वर्ष
                </div>
                {/* Party Button */}
                <div className="flex items-center gap-2 mb-2 mt-2 -ml-1">
                  <button className="bg-[#008040] text-white px-2.5 py-1.5 rounded-full text-sm font-medium whitespace-normal min-w-fit max-w-[200px]"
                    style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0' }}
                  >
                    {constituencyInfo?.vidhayak_info.party_name}
                  </button>
                  <div className="w-12 h-12rounded-full flex-shrink-0 flex items-center justify-center p-2">
                    <img
                      src={constituencyInfo?.vidhayak_info.party_icon_url}
                      alt={constituencyInfo?.vidhayak_info.party_name}
                      className="w-full h-full rounded-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 flex justify-between w-full">
              <p className=" mt-1 bg-[#E2EBF3] my-auto rounded-lg px-3 py-1 font-semibold text-9xl candidate-profile-subheading-text-last-election"
                style={{ fontFamily: 'Noto Sans Devanagari', fontWeight: 600, letterSpacing: '0', color: '#303D50' }}
              >अंतिम चुनाव: {constituencyInfo?.vidhayak_info.last_election_vote_percentage} वोट शेयर</p>
              <div className="flex flex-col items-center relative">
                <div className="flex w-full justify-end gap-2 relative">
                  <p className="text-sm text-gray-600">{constituencyInfo?.vidhayak_info.experience}</p>
                  <button 
                    className={`w-4 h-4 rounded-full align-top text-blue-500 border ${showExperienceInfo ? 'border-gray-400' : 'border-blue-400'} relative`}
                    onClick={() => setShowExperienceInfo(!showExperienceInfo)}
                    // disabled={showExperienceInfo}
                  >
                    <span className={`text-sm absolute top-[-3px] right-[5px] ${showExperienceInfo ? 'text-gray-400' : 'text-blue-500'}`}>i</span>
                  </button>
                  {showExperienceInfo && (
                    <span ref={experienceRef} className="info-message-box text-sm absolute top-[-30px] right-0 bg-gray-100 shadow-sm w-48 h-auto min-w-[140px] border border-gray-500 block overflow-y-auto scroll-y items-center rounded-lg z-50">
                        <span className="pl-2 pr-1 pb-1 block" dangerouslySetInnerHTML={{
                            __html: experienceInfoMessage.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">$1</a>')
                          }}></span>
                    </span>
                  )}
                </div>
                <p className="candidate-profile-subheading-text-experience">बार निर्वाचित</p>

              </div>

            </div>

          </div>

          {/* Public Satisfaction Poll */}
          <div className="relative flex flex-col bg-[#f6f6f6] rounded-lg shadow-sm p-6 items-start space-x-3">
            <div className="text-lg leading-7 font-semibold text-center mx-auto mb-3"
              style={{
                fontFamily: 'Noto Sans Devanagari, sans-serif',
                fontWeight: 600,
                letterSpacing: '0',
                color: '#1D2530',
                lineHeight: '1.75rem'
              }}>
              {constituencyInfo?.vidhayak_info.survey_score && constituencyInfo?.vidhayak_info.survey_score.length > 0
                ? constituencyInfo?.vidhayak_info.survey_score[0].question
                : 'क्या आप पिछले पाँच साल के कार्यकाल से संतुष्ट है?'}
            </div>

            <div className="flex items-center justify-between w-full">
              {/* Response Buttons */}
              <div className="flex bg-[#f6f6f6] w-[90px] h-[40px] pt-[3px] pb-[10px] pr-[6px] pl-[3px] rounded-full gap-0" style={{ boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.15), 0px 2px 4px 0px rgba(0, 0, 0, 0.1)' }}>
                <button
                  className={`text-center w-[40px]  h-[34px] pl-[10px] pr-[10px] rounded-full text-base font-medium mx-auto transition-colors ${isYesSelected
                    ? 'bg-[#004030] text-white'
                    : 'bg-[#f6f6f6] text-[#026A00]'
                    }`}
                  onClick={() => constituencyInfo?.area_name && handlePollSubmit(constituencyInfo.area_name, 'vidhayak', 'yes', 0)}
                >
                  हाँ
                </button>
                <button
                  className={`text-center w-[40px] h-[34px] rounded-full text-base pr-[9px] pl-[3px] font-medium transition-colors ${isNoSelected
                    ? 'bg-[#CA3C26] text-white'
                    : 'bg-[#f6f6f6] text-[#026A00]'
                    }`}
                  onClick={() => constituencyInfo?.area_name && handlePollSubmit(constituencyInfo.area_name, 'vidhayak', 'no', 0)}
                >
                  ना
                </button>
              </div>

              {/* Satisfaction Percentage */}
              {<div className="text-2xl font-bold text-green-600 candidate-profile-percentage-text flex flex-col">
                <span className="candidate-profile-percentage-text-subheading text-center my-1 text-xl">जनता की संतुष्टि</span>
                <span className={`text-center ${isYesSelected || isNoSelected ? '' : 'blur-sm'}`}>
                  {constituencyInfo?.vidhayak_info.survey_score && constituencyInfo?.vidhayak_info.survey_score.length > 0
                    ? `${constituencyInfo?.vidhayak_info.survey_score[0].score}%`
                    : '78%'}
                  {/* {updatedPollScore.toString()} */}
                </span>

              </div>}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {constituencyInfo?.vidhayak_info.metadata && Object.keys(constituencyInfo.vidhayak_info.metadata).map((key, index) => {
              const iconMap: { [key: string]: { iconSrc: string; bgColor: string; label: string; message: string } } = {
                education: {
                  iconSrc: '/your_area_vectors/education.svg',
                  bgColor: 'bg-blue-100',
                  label: 'शिक्षा स्तर',
                  message: 'शिक्षा श्रेणी (एडीआर आधारित)\nस्रोत - एसोसिएशन फॉर डेमोक्रेटिक रिफॉर्म्स (एडीआर). (2020), बिहार 2020 के विजेताओं की सूची, उपलब्ध:\nhttps://www.myneta.info'
                },
                net_worth: {
                  iconSrc: '/your_area_vectors/asset.svg',
                  bgColor: 'bg-green-100',
                  label: 'संपत्ति',
                  message: 'स्रोत - एसोसिएशन फॉर डेमोक्रेटिक रिफॉर्म्स (एडीआर). (2020), बिहार 2020 के विजेताओं की सूची, उपलब्ध:\nhttps://www.myneta.info'
                },
                criminal_cases: {
                  iconSrc: '/your_area_vectors/svg.svg',
                  bgColor: 'bg-red-100',
                  label: 'आपराधिक मामले',
                  message: 'स्रोत - एसोसिएशन फॉर डेमोक्रेटिक रिफॉर्म्स (एडीआर). (2020), बिहार 2020 के विजेताओं की सूची, उपलब्ध:\nhttps://www.myneta.info'
                },
                attendance: {
                  iconSrc: '/your_area_vectors/upastithi.svg',
                  bgColor: 'bg-purple-100',
                  label: 'विधानसभा उपस्थिति',
                  message: ''
                },
                questions_asked: {
                  iconSrc: '/your_area_vectors/questions.svg',
                  bgColor: 'bg-orange-100',
                  label: 'सवाल पूछे',
                  message: 'विधान सभा के पंचदश सत्र, चतुर्दश सत्र एवं त्रयोदश सत्र में उठाए गए कुल प्रश्न\nस्रोत - बिहार विधान सभा (2025). प्रश्न, उपलब्ध: https://bla.neva.gov.in'
                },
                funds_utilisation: {
                  iconSrc: '/your_area_vectors/nidhi.svg',
                  bgColor: 'bg-green-100',
                  label: 'चुनाव खर्च',
                  message: 'स्रोत - एसोसिएशन फॉर डेमोक्रेटिक रिफॉर्म्स (एडीआर). (2020), बिहार 2020 विजेताओं का चुनाव खर्च, एसोसिएशन\nफॉर डेमोक्रेटिक रिफॉर्म्स वेबसाइट से उपलब्ध:\nhttps://www.myneta.info'
                }
              };

              const iconInfo = iconMap[key];
              const value = constituencyInfo.vidhayak_info.metadata[key as keyof typeof constituencyInfo.vidhayak_info.metadata];

              return (
                <div key={key} className="bg-[#f6f6f6] rounded-lg shadow-sm relative">
                  <div className="flex items-center justify-between px-2">
                    <div className={`w-6 h-7 rounded-lg flex items-center `}>
                      <img
                        src={iconInfo.iconSrc}
                        alt={iconInfo.label}
                        className="w-10 h-10"
                      />

                    </div>
                    {["questions_asked", "education", "net_worth", "criminal_cases", "attendance", "funds_utilisation"].includes(key) && (
                      <button className={`w-4 h-4 rounded-full text-blue-500 border ${showIconInfoMessage[key] ? 'border-gray-400' : 'border-blue-500'} flex text-center items-center`} disabled={showIconInfoMessage[key]} onClick={() => {
                        setShowIconInfoMessage(prev => ({ ...prev, [key]: !prev[key] }))
                      }}>
                        <span className={`mx-auto text-sm ${showIconInfoMessage[key] ? 'text-gray-400' : 'text-blue-500'}`}>i</span>
                      </button>
                    )}
                  </div>
                  <div className="mb-1 flex flex-col justify-center items-center">
                    <div className="flex w-full relative justify-center gap-1">
                      <p className="text-base mb-1 text-center text-[#1D2530]" style={{
                        fontFamily: 'Noto Sans Devanagari',
                        fontWeight: 600,
                        letterSpacing: '0'
                      }}>{iconInfo.label}</p>

                      {showIconInfoMessage[key] &&
                        <span ref={messageRef} className="info-message-box text-sm absolute top-[-25px] bg-gray-100 shadow-sm w-4/5 h-[80px] min-w-[140px] border border-gray-500 mr-6 block overflow-y-auto scroll-y items-center rounded-lg z-50">
                          <span className="pl-2 pr-1 pb-1 block" dangerouslySetInnerHTML={{
                            __html: iconInfo.message.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">$1</a>')
                          }}></span>
                        </span>
                      }
                    </div>

                    <p className="text-lg text-center font-semibold"
                      style={{
                        fontFamily: 'Noto Sans Devanagari, sans-serif',
                        fontWeight: 700,
                        letterSpacing: '0',
                        color: '#176DCF'
                      }}
                    >{value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Previous Manifesto Tile */}
          <div
            className="bg-[#f6f6f6] rounded-lg shadow-md p-2 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              if (constituencyInfo?.vidhayak_info.manifesto_link) {
                window.open(constituencyInfo.vidhayak_info.manifesto_link, '_blank');
              }
            }}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img
                  src="/manifesto_icon.svg"
                  alt="Manifesto Icon"
                  className="w-6 h-6"
                />
              </div>
              <p className="text-base font-semibold text-[#1D2530] text-center" style={{
                fontFamily: 'Noto Sans Devanagari',
                fontWeight: 600,
                letterSpacing: '0'
              }}>
                पूर्व घोषणापत्र देखें
                <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </p>
            </div>
          </div>

          {/* Thematic Sections */}
          <div className="space-y-2.5">
            {constituencyInfo?.dept_info.map((dept) => {
              const iconMap: { [key: string]: { icon: string; bgColor: string; iconColor: string } } = {
                'स्वास्थ्य': {
                  icon: '/work_info/health.svg',
                  bgColor: 'bg-red-100',
                  iconColor: 'text-red-600'
                },
                'शिक्षा': {
                  icon: '/work_info/edu.svg',
                  bgColor: 'bg-blue-100',
                  iconColor: 'text-blue-600'
                },
                'महिला सशक्तिकरण': {
                  icon: '/work_info/misc.svg',
                  bgColor: 'bg-purple-100',
                  iconColor: 'text-purple-600'
                },
                'कृषि': {
                  icon: '/work_info/agri.svg',
                  bgColor: 'bg-yellow-100',
                  iconColor: 'text-yellow-600'
                },
                'रोजगार': {
                  icon: '/work_info/misc.svg',
                  bgColor: 'bg-yellow-100',
                  iconColor: 'text-yellow-600'
                }
              };

              const iconInfo = iconMap[dept.dept_name] || { icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', bgColor: 'bg-gray-100', iconColor: 'text-gray-600' };
              const satisfactionPercentage = dept.survey_score[0].score
              // const updatedRatingScore = deptRatings[dept.id] || 0;

              return (
                <div key={dept.id} className="bg-[#f6f6f6] rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center`}>
                      <img
                        src={iconInfo.icon}
                        alt={dept.dept_name}
                        className="w-8 h-8"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-[#273F4F]">{dept.dept_name}</h3>
                  </div>
                  <div className="space-y-2 mb-4">
                    {dept.work_info && Array.isArray(dept.work_info) ? (dept.work_info.length > 0 && dept.work_info.map((work, index) => (
                      <p key={index} className="text-sm text-justify" style={{
                        fontFamily: 'Noto Sans Devanagari, sans-serif',
                        fontWeight: 400,
                        lineHeight: '1.625', // 22.75px/14px ≈ 1.625
                        letterSpacing: '0',
                        color: '#7B899D'
                      }}>{work}</p>
                    ))) : <p className="text-sm text-justify" style={{
                      fontFamily: 'Noto Sans Devanagari, sans-serif',
                      fontWeight: 400,
                      lineHeight: '1.625',
                      letterSpacing: '0',
                      color: '#7B899D'
                    }}>{dept.work_info}</p>}
                  </div>
                  <p className="text-base text-justify mb-2" style={{
                    fontFamily: 'Noto Sans Devanagari, sans-serif',
                    fontWeight: 550,
                    letterSpacing: '0',
                    color: '#1D2530'
                  }}>{dept.survey_score[0]?.question}</p>
                  {/* call handlePollSubmit when user clicks on the stars*/}
                  <div className="flex items-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => { canEditStarRating[dept.id] && handleStarRatingPoll(dept.id, star) }}
                        className="hover:scale-110 transition-transform cursor-pointer"
                      >
                        {canEditStarRating[dept.id] ? (
                          <svg
                            className={`w-5 h-5 ${star <= (deptRatings[dept.id] || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ) : (
                          <svg
                            className={`w-5 h-5 ${star <= (deptRatings[dept.id] || 0) ? 'text-gray-600' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between rounded-lg gap-10">
                    <div className="flex gap-1">
                      <p className="text-sm text-gray-600 mb-2 my-auto align-middle">{satisfactionPercentage}% </p>
                      <span className=" text-gray-400 candidate-profile-subheading-text-satisfaction-percentage align-middle my-auto">लोग इस विषय से संतुष्ट हैं</span>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500 flex flex-col">
                      <div className="flex gap-2">
                        <span className="candidate-profile-subheading-text-satisfaction-percentage-verygood">बहुत खराब</span>
                        <svg key={'star'} className={`w-2 h-2 text-yellow-400 my-auto`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg></div>
                      <div className="flex gap-2">
                        <span className="candidate-profile-subheading-text-satisfaction-percentage-verygood w-full">बहुत अच्छा</span>
                        <div className="flex align-middle my-auto">{[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className={`w-2 h-2 text-yellow-400`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}</div>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Other Major Candidates */}
          <div className="bg-[#f6f6f6] rounded-lg shadow-sm px-3 py-3">
            <h3
              className="text-xl mb-1"
              style={{
                fontFamily: 'Noto Sans Devanagari, sans-serif',
                fontWeight: 600,
                letterSpacing: '0',
                color: '#1D2530'
              }}
            >
              अन्य प्रमुख उम्मीदवार
            </h3>
            <p className="text-sm text-gray-600 mb-4">(पिछला चुनाव)</p>

            {/* <div className="flex space-x-10 overflow-x-auto pb-4">
              {constituencyInfo?.other_candidates.map((candidate) => (
                <div key={candidate.id} className="flex-shrink-0 w-32 text-center">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <img
                      src={candidate.candidate_image_url}
                      alt={candidate.candidate_name}
                      className="w-full h-full rounded-full object-cover border-2 border-gray-300"
                    />
                  </div>
                  <h4 className="text-sm font-medium text-[#273F4F]">{candidate.candidate_name}</h4>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                      <img
                        src={partyIconMap[candidate.candidate_party as keyof typeof partyIconMap] || '/default-party-icon.png'}
                        alt={candidate.candidate_party}
                        className="w-4 h-4 rounded object-cover"
                      />
                    </div>
                    <span className="text-xs text-gray-600">{candidate.candidate_party}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">वोट शेयर: {candidate.vote_share}</p>
                </div>
              ))}
            </div> */}

            <div className="relative">
              <div className="grid grid-cols-2 gap-4 pb-4 px-1">
                {constituencyInfo?.other_candidates
                  ?.slice(currentCandidateIndex, currentCandidateIndex + 2)
                  .map((candidate) => (
                    <div key={candidate.id} className="bg-[#f6f6f6] rounded-lg shadow-md p-4 flex flex-col items-center">
                      <div className="w-20 h-20 bg-gray-300 rounded-full mb-3 flex items-center justify-center overflow-hidden">
                        <img
                          src={candidate.candidate_image_url}
                          alt={candidate.candidate_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <h4
                        className="text-base mb-1 text-[#1D2530]"
                        style={{
                          fontFamily: 'Noto Sans Devanagari, sans-serif',
                          fontWeight: 600,
                          lineHeight: '1.625', // 26px/16px = 1.625
                          letterSpacing: '0'
                        }}
                      >{candidate.candidate_name}</h4>
                      {/* <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                          <img
                            src={partyIconMap[candidate.candidate_party as keyof typeof partyIconMap] || '/default-party-icon.png'}
                            alt={candidate.candidate_party}
                            className="w-4 h-4 rounded object-cover"
                          />
                        </div>
                        <span className="text-xs text-gray-600">{candidate.candidate_party}</span>
                      </div> */}
                      <div className="flex items-center gap-2 mb-2 -ml-1">
                        <button className="bg-[#008040] items-center text-white px-2.5 py-1.5 rounded-full text-xs font-medium whitespace-normal min-w-fit max-w-[200px]"
                          style={{
                            fontFamily: 'Noto Sans Devanagari, sans-serif',
                            fontWeight: 600,
                            letterSpacing: '0',
                            lineHeight: '1.625'
                          }}
                        >
                          {candidate.candidate_party}
                        </button>
                        {/* <div className="w-12 h-12 bg-[#f6f6f6] rounded-full flex-shrink-0 flex items-center justify-center">
                          <img
                            src={partyIconMap[candidate.candidate_party as keyof typeof partyIconMap] || '/default-party-icon.png'}
                            alt={candidate.candidate_party}
                            className="w-10 h-10 rounded object-contain"
                          />
                        </div> */}
                      </div>
                      <p className="text-xs text-gray-500 font-semibold">वोट शेयर: {candidate.vote_share}</p>
                    </div>
                  ))}
              </div>
              {/* Navigation Arrows */}
              <div className="absolute right-0 -top-15 flex justify-between pointer-events-none">
                {/* Left Arrow - Show only if not on first page */}
                {currentCandidateIndex > 0 && (
                  <div
                    className="pointer-events-auto bg-[#f6f6f6] rounded-full shadow-lg p-2 cursor-pointer hover:bg-gray-50 transition-colors ml-1"
                    onClick={() => setCurrentCandidateIndex(prev => Math.max(0, prev - 2))}
                  >
                    <svg className="w-6 h-6 text-[#273F4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                )}
                {/* Right Arrow - Show only if there are more candidates */}
                {constituencyInfo?.other_candidates && currentCandidateIndex + 2 < constituencyInfo.other_candidates.length && (
                  <div
                    className="pointer-events-auto bg-[#f6f6f6] rounded-full shadow-lg p-2 cursor-pointer hover:bg-gray-50 transition-colors mr-1"
                    onClick={() => setCurrentCandidateIndex(prev => Math.min((prev + 2), (constituencyInfo.other_candidates.length || 0) - 2))}
                  >
                    <svg className="w-6 h-6 text-[#273F4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* विशेष गहन पुनरीक्षण - 2025 Section */}
          <div className="bg-[#f6f6f6] rounded-lg shadow-sm p-6">
            <h3
              className="text-lg mb-4 text-center"
              style={{
                fontFamily: 'Noto Sans Devanagari, sans-serif',
                fontWeight: 600,
                letterSpacing: '0',
                color: '#1D2530'
              }}
            >
              विशेष गहन पुनरीक्षण (एसआईआर) - 2025
            </h3>

            <div className="space-y-4">
              {/* First Link */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-base text-[#1D2530]" style={{
                  fontFamily: 'Noto Sans Devanagari',
                  fontWeight: 500,
                  letterSpacing: '0'
                }}>
                  <p>प्रारूप मतदाता सूची में अपना नाम देखें -</p>
                  <span
                    className="text-blue-600 underline cursor-pointer hover:text-blue-800 ml-1"
                    onClick={() => window.open('https://electoralsearch.eci.gov.in/', '_blank')}
                    style={{
                      fontFamily: 'Noto Sans Devanagari',
                      fontWeight: 600,
                      letterSpacing: '0'
                    }}
                  >
                    यहाँ क्लिक करें
                  </span>
                </div>
              </div>

              {/* Second Link */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-base text-[#1D2530]" style={{
                  fontFamily: 'Noto Sans Devanagari',
                  fontWeight: 500,
                  letterSpacing: '0'
                }}>
                  <p>अपने मतदाता केंद्र के बीएलओ की जानकारी -</p>
                  <span
                    className="text-blue-600 underline cursor-pointer hover:text-blue-800 ml-1"
                    onClick={() => window.open('https://electoralsearch.eci.gov.in/pollingstation', '_blank')}
                    style={{
                      fontFamily: 'Noto Sans Devanagari',
                      fontWeight: 600,
                      letterSpacing: '0'
                    }}
                  >
                    यहाँ क्लिक करें
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Call to Action */}
          <div className="bg-gray-700 rounded-lg p-4 flex items-center justify-center space-x-3" onClick={() => router.push(`/message?constituency=${selectedConstituency?._id}`)}>
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            <span className="text-white text-sm">आपके क्षेत्र के चर्चा मंच पर जाएं</span>
          </div>
        </div>
      </main >
    </div >
  )
}

// Main component with Suspense boundary
export default function YourAreaPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');
  return (
    <div className="min-h-screen w-full bg-[#c1cbd1] flex flex-col ">
      <div className={`flex-grow w-full lg: max-w-screen-md mx-auto ${showAuthModal ? 'blur-sm' : ''}`}>
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#273F4F] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }>
          <YourAreaPageContent showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} authModalMessage={authModalMessage} setAuthModalMessage={setAuthModalMessage} />
        </Suspense>
      </div>
      <NewModalLogin
        isOpen={showAuthModal}
        message={authModalMessage}
        onClose={() => setShowAuthModal(false)}
      />
      <Footer />
    </div>
  );
}