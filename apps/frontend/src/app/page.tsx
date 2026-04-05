'use client'
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Select from 'react-select';
import Footer from "@/components/Footer";
import axios from "axios";
import NewModalLogin from "@/components/newModalLogin";
import { BiharId } from "@/constants/constants";
import { LoadingSpinner } from "@/components/Loadingspinner";
import { trackPageView } from "@/utils/analytics";
import Share from "@/components/share";
import { ConstituencyListType } from "@/types/constituency";
import { isDevanagariText, isEnglishText } from "@/utils/languageutils";

interface ConstituencyDetailSummaryType {
  constituencies: {
    _id: string;
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
      manifesto_score: number;
      metadata: {
        education: string;
        net_worth: string;
        criminal_cases: number;
        attendance: string;
        questions_asked: number;
        funds_utilisation: string;
      };
      survey_score: {
        question: string;
        yes_votes: string[];
        no_votes: string[];
        score: number;
      }[];
    };
    dept_info: {
      id: string;
      dept_name: string;
      work_info: string[];
      average_score: number;
      survey_score: {
        question: string;
        yes_votes: string[];
        no_votes: string[];
        score: number;
      }[];
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
  }[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalConstituencies: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
    limit: number;
  };
}
export default function Home() {

  const router = useRouter();

  useEffect(() => {
    trackPageView('Home Page', '/');
  }, []);
  const [constituencyAreaList, setConstituencyAreaList] = useState<ConstituencyListType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  // const [error, setError] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState<ConstituencyListType | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingConstituencyDetailSummary, setLoadingConstituencyDetailSummary] = useState(false);
  const [constituencyDetailSummary, setConstituencyDetailSummary] = useState<ConstituencyDetailSummaryType['constituencies']>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  const [constituencyButtonStates, setConstituencyButtonStates] = useState<{
    [key: string]: 'yes' | 'no' | null;
  }>({});
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');

  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setUserId(userId);
  }, []);

  const updateYesNoVotes = (constituencyDetailSummaryValue: ConstituencyDetailSummaryType['constituencies'], userId: string) => {
    const yesNoVotes: any = constituencyDetailSummaryValue.map((constituency) => {
      return constituency.vidhayak_info.survey_score.map((survey) => {
        const votes = survey.yes_votes.includes(userId as string) ? 'yes' : survey.no_votes.includes(userId as string) ? 'no' : null;
        // Update button states for this constituency
        setConstituencyButtonStates(prev => ({
          ...prev,
          [constituency.area_name]: votes
        }));

        return votes;
      });
    });

    return yesNoVotes; // Return the result if needed
  };
  const fetchMoreCandidates = useCallback(async (pageNumber: number) => {
    setLoadingConstituencyDetailSummary(true);
    try {
      const limit = pageNumber === 1 ? 2 : 3; // First page: 2, others: 3
      const sortBy = 'engagement';
      const response = await axios.get(`/api/constituencies/list/paginated?page=${pageNumber}&limit=${limit}?sortBy=${sortBy}`);
      const data = response.data;

      if (pageNumber === 1) {
        // First page: replace the list
        setConstituencyDetailSummary(data.constituencies);
      } else {
        // Subsequent pages: append to existing list
        setConstituencyDetailSummary(prev => [...prev, ...data.constituencies]);
      }
      const userIdFromLocalStorage = localStorage.getItem('userId');
      if (userIdFromLocalStorage) { updateYesNoVotes(data.constituencies, userIdFromLocalStorage as string); }

      setCurrentPage(data.pagination.currentPage);
      setHasNextPage(data.pagination.hasNextPage);
      // setTotalPages(data.pagination.totalPages);

    } catch (err) {
      console.error(`Error fetching page ${pageNumber}:`, err);
      // setError(`Failed to load page ${pageNumber}`);
    } finally {
      setLoadingConstituencyDetailSummary(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    const fetchConstituencyAreaList = async () => {
      setLoading(true);

      try {
        const response = await axios.get(`/api/constituencies`);
        let data: ConstituencyListType[] = response.data;
        data = data.filter((ele: ConstituencyListType) => ele._id !== BiharId)
        setConstituencyAreaList(data);

      } catch (err) {
        // setError('Failed to load constituencies');
      } finally {
        setLoading(false);
      }
    }

    fetchConstituencyAreaList();
    fetchMoreCandidates(1);
  }, []);
  async function handlePollSubmit(constituencyAreaName: string, poll_category: string = 'vidhayak', poll_response: string, question_id: number) {
    try {
      const response = await axios.post(`/api/constituencies/poll/${constituencyAreaName}`, {
        poll_response: poll_response,
        poll_category: poll_category,
        question_id: question_id
      });
      const data = response.data;
      setConstituencyButtonStates(prev => ({
        ...prev,
        [constituencyAreaName]: poll_response as 'yes' | 'no'
      }));
      const latestScore = data.updated_scores.question_score;
      setConstituencyDetailSummary((prev: ConstituencyDetailSummaryType['constituencies']) =>
        prev.map(constituency => constituency.area_name === constituencyAreaName ?
          {
            ...constituency,
            vidhayak_info: {
              ...constituency.vidhayak_info,
              survey_score: constituency.vidhayak_info.survey_score.map((survey: { question: string, yes_votes: string[], no_votes: string[], score: number }, idx: number) =>
                idx === question_id ? { ...survey, score: latestScore } : survey
              )
            }
          } : constituency
        )
      );
    }
    catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setShowAuthModal(true);
        setAuthModalMessage('आपको लॉगिन करना होगा वोट देने के लिए।');
      }
    }
    finally {

    }
  }

  const handleConstituencySelect = async (constituency: ConstituencyListType) => {
    setSelectedConstituency(constituency);
    setSearchQuery(constituency.area_name);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL;
      // Fetch constituency info first
      const response = await axios.get(`/api/constituencies/${encodeURIComponent(constituency.area_name)}`);

      const data = response.data;

      // Navigate to your-area page with the selected constituency
      router.push(`/your-area?constituency=${encodeURIComponent(constituency.area_name)}`);
    } catch (err) {
      console.error('Error:', err);
      // setError('Failed to fetch constituency information');
    }
  }
  const renderConstituencyDetailSummaryCardsPerPageNumber = () => {
    return (
      <div className="space-y-4 bg-grey-50">
        {constituencyDetailSummary.map((constituency, index) => {
          const isYesSelected = constituencyButtonStates[constituency.area_name] === 'yes';
          const isNoSelected = constituencyButtonStates[constituency.area_name] === 'no';

          return (
            <div key={`${constituency._id}`} className="bg-white rounded-lg p-4 px-6 shadow-sm border border-gray-200 relative">
              {/* Active Discussion Tag - Top Right */}
              <div className="absolute top-2 right-2 bg-[#DEAF13] px-4 py-2 rounded-xl cursor-pointer hover:bg-[#C49F11] transition-colors z-40"
                style={{ boxShadow: '0px 4px 4px 0px #00000080' }}
                onClick={(e) => {
                  console.log('Button clicked for:', constituency.area_name, constituency._id, 'Index:', index);
                  e.stopPropagation();
                  router.push(`/message?constituency=${encodeURIComponent(constituency._id)}`)
                }}>
                <div className="text-center">
                  {/* <div className="font-bold">10+</div> */}
                  <div className="candidate-profile-sakriya-charcha-text" style={{ fontSize: '12px', lineHeight: '16px' }}>सक्रिय चर्चा</div>
                </div>
              </div>

              {/* Candidate Profile Section */}
              <div className="mb-4 flex items-start space-x-3">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  <img
                    src={constituency.vidhayak_info.image_url}
                    alt={constituency.vidhayak_info.name}
                    className="w-16 h-16 rounded-full border-2 border-gray-300 object-cover"
                  />
                </div>

                {/* Candidate Info */}
                <div className="flex-1">
                  <div className="mb-1 candidate-profile-heading">
                    {constituency.area_name}
                  </div>
                  <div className="text-xl font-bold candidate-profile-subheading mb-2">
                    {constituency.vidhayak_info.name}
                  </div>

                  {/* Party Button */}
                  <div className="flex items-center space-x-2 mb-2">
                    <button className="bg-[#008040] text-white px-3 py-1 rounded-full text-sm font-medium">
                      {constituency.vidhayak_info.party_name}
                    </button>
                    {/* <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div> */}
                    <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center p-2">
                      <img
                        src={constituency.vidhayak_info.party_icon_url}
                        alt={constituency.vidhayak_info.party_name}
                        className="w-full h-full rounded-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Candidate Metrics */}
              <div className="flex space-x-6 mb-4 justify-between mx-auto">
                <div className="text-center">
                  <div className=" vidhayak-info-text">
                    {constituency.vidhayak_info.experience}
                  </div>
                  <div className="text-sm text-gray-600 vidhayak-info-text-subheading">बार निर्वाचित</div>
                </div>
                <div className="text-center">
                  <div className="vidhayak-info-text">
                    {constituency.vidhayak_info.metadata.education}
                  </div>
                  <div className="text-sm text-gray-600">शिक्षा</div>
                </div>
              </div>

              {/* Public Satisfaction Poll */}
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-3 text-center  mx-auto">
                  {constituency.vidhayak_info.survey_score && constituency.vidhayak_info.survey_score.length > 0
                    ? constituency.vidhayak_info.survey_score[0].question
                    : 'क्या आप पिछले पाँच साल के कार्यकाल से संतुष्ट है?'}
                </div>

                <div className="flex items-center justify-between ">
                  {/* Response Buttons */}
                  <div className="flex bg-[#f6f6f6] w-[90px] h-[40px] pt-[3px] pb-[10px] pr-[6px] pl-[3px] rounded-full gap-0" style={{ boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.15), 0px 2px 4px 0px rgba(0, 0, 0, 0.1)' }}>
                    <button
                      className={`text-center w-[40px]  h-[34px] pl-[10px] pr-[10px] rounded-full text-base font-medium mx-auto transition-colors ${isYesSelected
                        ? 'bg-[#004030] text-white'
                        : 'bg-[#f6f6f6] text-[#026A00]'
                        }`}
                      onClick={() => handlePollSubmit(constituency.area_name, 'vidhayak', 'yes', 0)}
                    >
                      हाँ
                    </button>
                    <button className={`text-center w-[40px] h-[34px] rounded-full text-base pr-[9px] pl-[3px] font-medium transition-colors  ${isNoSelected
                      ? 'bg-[#CA3C26] text-white'
                      : 'bg-[#f6f6f6] text-[#026A00]'
                      }`}
                      onClick={() => handlePollSubmit(constituency.area_name, 'vidhayak', 'no', 0)}
                    >
                      ना
                    </button>
                  </div>

                  {/* Satisfaction Percentage */}
                  {isYesSelected || isNoSelected ? <div className="text-2xl font-bold text-green-600 candidate-profile-percentage-text flex gap-2">
                    <span>
                      {constituency.vidhayak_info.survey_score && constituency.vidhayak_info.survey_score.length > 0
                        ? `${constituency.vidhayak_info.survey_score[0].score}%`
                        : '78%'}
                    </span>
                    <span className="candidate-profile-percentage-text-subheading text-center my-1">संतुष्ट</span>
                  </div> : null}
                </div>
              </div>

              {/* Manifesto Promise Score */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 manifesto-score-text">
                    घोषणापत्र वादा स्कोर: {constituency.vidhayak_info.manifesto_score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#273F4F] h-2 rounded-full"
                    style={{ width: `${constituency.vidhayak_info.manifesto_score}%` }}
                  ></div>
                </div>
              </div>

              {/* Recent Achievement/Update */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-5 h-5 rounded flex items-center justify-center">
                  <img src="/charchagramnewsicon.svg" alt='charcha gram news icon' className="w-3 h-3 bg-transparent" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">
                    {constituency.latest_news && constituency.latest_news.length > 0
                      ? constituency.latest_news[0].title
                      : 'सड़क सुधार परियोजना का शुभारंभ'}
                  </span>
                  {/* <span className="text-xs text-gray-500">2 दिन पहले</span> */}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex justify-between space-x-3">
                <button className="w-4/5 bg-[#273F4F] text-white py-3 px-4 rounded-lg text-sm font-medium" onClick={() => router.push(`/your-area?constituency=${encodeURIComponent(constituency.area_name)}`)}>
                  <span className="text-center">विस्तार से देखे</span>
                </button>
                <Share
                  url={window.location.href + `/your-area?constituency=${encodeURIComponent(constituency.area_name)}`}
                  pathname="shareicon.svg"
                  showText={false}
                />
              </div>
            </div>
          )
        })}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background circles with exact specs */}

      {/* <div className="absolute w-16 h-16 top-32 left-61 border-2 border-[#273F4F] rounded-full opacity-10"></div>
      <div className="absolute w-12 h-12 top-[439px] left-[97.5px] border-2 border-[#273F4F] rounded-full opacity-10"></div> */}


      {/* App Header */}


      {/* Main Banner Area */}
      <div className="bg-gradient-to-r from-[#273F4F] to-[#1a2b36] px-4 py-6 text-white relative overflow-visible" style={{ height: 'calc(90vh - 70px)' }}>
        {/* Existing assets */}
        <img
          src="/home_assets/IMG_5509.PNG"
          alt="Circle Asset"
          width={140}
          height={140}
          style={{
            position: 'absolute',
            top: 40,
            left: 15,
            zIndex: 10,
          }}
        />
        <img
          src="/home_assets/IMG_5509.PNG"
          alt="Circle Asset"
          width={124}
          height={124}
          style={{
            position: 'absolute',
            top: 122,
            right: 35,
            zIndex: 10,
          }}
        />
        <img
          src="/home_assets/IMG_5509.PNG"
          alt="Circle Asset"
          width={108}
          height={108}
          style={{
            position: 'absolute',
            //top: 479, // 439 + 40
            left: 97.5,
            zIndex: 10,
            bottom: 100
          }}
        />
        {/* Place asset at bottom right of blue container */}
        <img
          src="/home_assets/IMG_5510_2.png"
          alt="Bottom Right Asset"
          width={140 * 20}
          height={190 * 20}
          style={{
            position: 'absolute',
            bottom: -40,
            right: -120,
            zIndex: 20,
            opacity: 1,
            transform: 'scale(1.5)'
            // opacity: 0.5,
            // backgroundColor: '#FFFFFF',
          }}
        />

        {/* Main Title Text - Centered */}
        <div className="pt-6 ml-30" style={{ position: 'relative', zIndex: 20 }}>
          <h2
            className="banner-text mb-1.5"
            style={{ fontSize: '2.7rem' }} // Increased font size
          >
            जनता का
          </h2>
          <h2
            className="banner-text"
            style={{ fontSize: '2.7rem' }} // Increased font size
          >
            चुनावी <span className="font-color-orange">साथी</span>
          </h2>
        </div>

        {/* Subtitle Text - Centered */}
        <div
          className="mb-8 w-fit pt-2 mt-4"
          style={{
            position: 'relative',
            left: 20, // 30px from the left
            top: 10
          }}
        >
          <p
            className="banner-subtitle mb-2"
            style={{
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: '20px',
              fontFamily: 'inherit',
            }}
          >
            किसने किया है कैसा काम
          </p>
          <p
            className="banner-subtitle"
            style={{
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: '20px',
              fontFamily: 'inherit',
            }}
          >
            आओ करें चर्चाग्राम
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-md mx-auto">
          <Select
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


        {/* Informational Bullet Points */}
        <div className="space-y-4 text-sm px-4">
          <div className="flex items-start">
            <span
              className="banner-info-text font-bold"
              style={{
                fontSize: '18px',
                fontWeight: 800,
                // fontStyle: 'italic',
                lineHeight: '32px',
                //boxShadow: '0px 5px 4px 0px #00000040',
                marginRight: '8px',
              }}
            >
              जानें
            </span>
            <span
              className="banner-info-text font-bold"
              style={{
                fontSize: '18px',
                fontWeight: 800,
                //fontStyle: 'italic',
                lineHeight: '32px',
                //boxShadow: '0px 5px 4px 0px #00000040',
                marginRight: '8px',
              }}
            >
              –
            </span>
            <span
              className="banner-info-text"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                //fontStyle: 'italic',
                lineHeight: '22px',
                //boxShadow: '0px 5px 4px 0px #00000040',
              }}
            >
              उम्मीदवारों की संपत्ति, आपराधिक मामले और संसद में भागीदारी
            </span>
          </div>
          <div className="flex items-start">
            <span
              className="banner-info-text font-bold"
              style={{
                fontSize: '18px',
                fontWeight: 800,
                //fontStyle: 'italic',
                lineHeight: '22px',
                //boxShadow: '0px 5px 4px 0px #00000040',
                marginRight: '8px',
              }}
            >
              रखें
            </span>
            <span
              className="banner-info-text font-bold"
              style={{
                fontSize: '18px',
                fontWeight: 800,
                //fontStyle: 'italic',
                lineHeight: '22px',
                //boxShadow: '0px 5px 4px 0px #00000040',
                marginRight: '8px',
              }}
            >
              –
            </span>
            <span
              className="banner-info-text"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                //fontStyle: 'italic',
                lineHeight: '22px',
                //boxShadow: '0px 5px 4px 0px #00000040',
              }}
            >
              वर्तमान और पूर्व उम्मीदवारों पर अपनी राय
            </span>
          </div>
          <div className="flex items-start">
            <span
              className="banner-info-text font-bold"
              style={{
                fontSize: '18px',
                fontWeight: 800,
                //fontStyle: 'italic',
                lineHeight: '22px',
                //boxShadow: '0px 5px 4px 0px #00000040',
                marginRight: '8px',
              }}
            >
              करें
            </span>
            <span
              className="banner-info-text font-bold"
              style={{
                fontSize: '18px',
                fontWeight: 800,
                //fontStyle: 'italic',
                lineHeight: '22px',
                //boxShadow: '0px 5px 4px 0px #00000040',
                marginRight: '8px',
              }}
            >
              –
            </span>
            <span
              className="banner-info-text"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                //fontStyle: 'italic',
                lineHeight: '22px',
                //boxShadow: '0px 5px 4px 0px #00000040',
              }}
            >
              जनसंवाद, सवाल-जवाब और जवाबदेही तय
            </span>
          </div>
        </div>
      </div>


      {/* Your Citizen Contribution Section */}
      {/* <div className="bg-gray-100 px-4 py-6">
        <h3 className="text-lg font-semibold text-[#273F4F] mb-2">आपका नागरिक योगदान</h3>
        <p className="text-sm text-gray-600 mb-4">चुनाव में आपकी सक्रिय भागीदारी का डैशबोर्ड</p>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div>
              <div className="text-2xl font-bold text-[#273F4F]">स्तर 3</div>
              <div className="text-sm text-gray-600">सक्रिय नागरिक</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">सक्रियता</div>
              <div className="text-lg font-semibold text-[#273F4F]">78%</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#273F4F] h-2 rounded-full" style={{ width: '78%' }}></div>
          </div>
        </div>
      </div> */}

      {/* Achievements Section */}
      {/* <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#273F4F]">उपलब्धियाँ</h3>
          <span className="text-sm text-gray-500">2/4</span>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium text-[#273F4F]">पहला वोट</div>
                <div className="text-sm text-gray-600">पहली बार मतदान किया</div>
                <div className="text-blue-600 text-sm">जानकारी दें</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium text-[#273F4F]">चर्चाओं में भागीदारी</div>
                <div className="text-sm text-gray-600">10+ चर्चाओं में भाग लिया</div>
                <div className="text-sm text-gray-500">22 मार्च 2025</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.26c-.3.4-.47.88-.47 1.4V20h6z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium text-[#273F4F]">नई चर्चा की पहल</div>
                <div className="text-sm text-gray-600">50+ चर्चा शुरू की</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium text-[#273F4F]">नागरिक प्रेरक</div>
                <div className="text-sm text-gray-600">5+ नए सदस्यों का मार्गदर्शन</div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Discussed Assembly Section */}
      <div className={`px-4 py-6 bg-gray-50 ${showAuthModal ? 'blur-sm' : ''} md: max-w-screen-md mx-auto`}>
        <h3 className="text-lg font-semibold text-[#273F4F] text-center mb-4 candidate-profile-main-heading">चर्चित विधानसभा</h3>
        {constituencyDetailSummary.length > 0 &&
          renderConstituencyDetailSummaryCardsPerPageNumber()
        }
        {/* Loading indicator */}
        {/* {loadingConstituencyDetailSummary && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#273F4F]"></div>
            <p className="mt-2 text-sm text-gray-600">Loading more candidates...</p>
          </div>
        )} */}
        {/* View All Candidates Button */}
        <div className="mt-6">
          <button
            onClick={() => fetchMoreCandidates(currentPage + 1)}
            disabled={!hasNextPage || loadingConstituencyDetailSummary}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 ${hasNextPage
              ? 'bg-[#273F4F] text-white hover:bg-[#1e2f3a]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {loadingConstituencyDetailSummary && <LoadingSpinner />}
            <span>
              {hasNextPage ? 'अधिक क्षेत्र देखे' : 'सभी क्षेत्र देखे गए'}
            </span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <NewModalLogin
        isOpen={showAuthModal}
        message={authModalMessage}
        onClose={() => setShowAuthModal(false)}
      />
      <Footer />
    </div >
  )
}
