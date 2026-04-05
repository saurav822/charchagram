import { v4 as uuidv4 } from 'uuid';

// Comprehensive constituency data for Indian constituencies
//insert your 
export const constituencyData = [
  {
    area_name: "Raghopur Vidhan Sabha Kshetra",
    vidhayak_info: {
      name: "तेजस्वी यादव",
      image_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchimage1.png",
      age: 58,
      last_election_vote_percentage: "52.3%",
      experience: 15,
      party_name: "RJD",
      party_icon_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchpartyimage1.png",
      manifesto_link: "https://example.com/tejashwi_manifesto.pdf",
      manifesto_score: 50,
      metadata: {
        education: "स्नातकोत्तर",
        net_worth: "₹2.4 करोड़",
        criminal_cases: 0,
        attendance: "89%",
        questions_asked: 47,
        funds_utilisation: "78%"
      },
      survey_score: [
        {
          question: "क्या आप पिछले पांच साल के कार्यकाल से खुश हैं?",
          yes_votes: 500,
          no_votes: 500,
          score: 50
        }
      ]
    },
    dept_info: [
      {
        id: uuidv4(),
        dept_name: "स्वास्थ्य",
        work_info: [
          "प्रत्येक गांव में प्राथमिक स्वास्थ्य केंद्र",
          "24/7 एम्बुलेंस सेवा",
          "मुफ्त दवाइयां और टीकाकरण",
          "मातृ-शिशु स्वास्थ्य कार्यक्रम"
        ],
        survey_score: [
          {
            question: "इस विषय पर सरकार के कार्य से आप कितने संतुष्ट हैं?",
            ratings: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
            score: 50
          }
        ],
        average_score: 50
      },
      {
        id: uuidv4(),
        dept_name: "शिक्षा",
        work_info: [
          "सभी सरकारी स्कूलों में कंप्यूटर लैब",
          "मुफ्त किताबें और यूनिफॉर्म",
          "डिजिटल शिक्षा कार्यक्रम",
          "शिक्षक प्रशिक्षण कार्यक्रम"
        ],
        survey_score: [
          {
            question: "शिक्षा के क्षेत्र में सरकार के प्रयासों से आप कितने संतुष्ट हैं?",
            ratings: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
            score: 50
          }
        ],
        average_score: 50
      },
      {
        id: uuidv4(),
        dept_name: "अपराध",
        work_info: [
          "महिला सुरक्षा हेल्पलाइन",
          "हर 5 किमी पर पुलिस चौकी",
          "सीसीटीवी कैमरों की स्थापना",
          "सामुदायिक पुलिसिंग कार्यक्रम"
        ],
        survey_score: [
          {
            question: "कानून व्यवस्था और सुरक्षा के मामले में आप कितने संतुष्ट हैं?",
            ratings: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
            score: 50
          }
        ],
        average_score: 50
      },
      {
        id: uuidv4(),
        dept_name: "कृषि",
        work_info: [
          "MSP की गारंटी",
          "मुफ्त बीज और खाद वितरण",
          "किसान क्रेडिट कार्ड योजना",
          "सिंचाई सुविधाओं का विस्तार"
        ],
        survey_score: [
          {
            question: "कृषि क्षेत्र में सरकार की नीतियों से आप कितने संतुष्ट हैं?",
            ratings: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
            score: 50
          }
        ],
        average_score: 50
      }
    ],
    other_candidates: [
      {
        id: 1,
        candidate_name: "राहुल शर्मा",
        candidate_image_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchimage2.png",
        candidate_party: "Congress",
        candidate_party_icon_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchpartyimage1.png",
        vote_share: "18.2%"
      },
      {
        id: 2,
        candidate_name: "उत्कर्ष सिंह",
        candidate_image_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchimage2.png",
        candidate_party: "BJP",
        candidate_party_icon_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchpartyimage1.png",
        vote_share: "18.2%"
      },
      {
        id: 3,
        candidate_name: "प्रमोद कुमार",
        candidate_image_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchimage2.png",
        candidate_party: "JDU",
        candidate_party_icon_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchpartyimage1.png",
        vote_share: "11.3%"
      }
    ],
    latest_news: [
      {
        title: "तेजस्वी यादव ने स्वास्थ्य केंद्र का उद्घाटन किया"
      },
      {
        title: "राघोपुर में नई सड़क परियोजना शुरू"
      }
    ]
  },
  {
    area_name: "Patna Sahib",
    vidhayak_info: {
      name: "रवि शंकर प्रसाद",
      image_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchimage2.png",
      age: 65,
      last_election_vote_percentage: "48.7%",
      experience: 12,
      party_name: "BJP",
      party_icon_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchpartyimage2.png",
      manifesto_link: "https://example.com/ravi_manifesto.pdf",
      manifesto_score: 50,
      metadata: {
        education: "एलएलबी",
        net_worth: "₹5.2 करोड़",
        criminal_cases: 1,
        attendance: "92%",
        questions_asked: 85,
        funds_utilisation: "82%"
      },
      survey_score: [
        {
          question: "क्या आप पिछले पांच साल के कार्यकाल से खुश हैं?",
          yes_votes: 500,
          no_votes: 500,
          score: 50
        }
      ]
    },
    dept_info: [
      {
        id: uuidv4(),
        dept_name: "सड़क और परिवहन",
        work_info: [
          "राष्ट्रीय राजमार्ग का निर्माण",
          "सार्वजनिक परिवहन में सुधार",
          "सड़क सुरक्षा अभियान",
          "पैदल यात्री पुल का निर्माण"
        ],
        survey_score: [
          {
            question: "सड़क और परिवहन के क्षेत्र में सरकार के कार्य से आप कितने संतुष्ट हैं?",
            ratings: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
            score: 50
          }
        ],
        average_score: 50
      },
      {
        id: uuidv4(),
        dept_name: "बिजली",
        work_info: [
          "24x7 बिजली आपूर्ति",
          "सौर ऊर्जा परियोजनाएं",
          "ग्रामीण विद्युतीकरण",
          "स्मार्ट मीटर की स्थापना"
        ],
        survey_score: [
          {
            question: "बिजली आपूर्ति के मामले में आप कितने संतुष्ट हैं?",
            ratings: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
            score: 50
          }
        ],
        average_score: 50
      }
    ],
    other_candidates: [
      {
        id: 1,
        candidate_name: "अनिल कुमार",
        candidate_image_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchimage2.png",
        candidate_party: "Congress",
        candidate_party_icon_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchpartyimage1.png",
        vote_share: "35.4%"
      },
      {
        id: 2,
        candidate_name: "सुनील कुमार",
        candidate_image_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchimage2.png",
        candidate_party: "RJD",
        candidate_party_icon_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchpartyimage1.png",
        vote_share: "15.9%"
      }
    ],
    latest_news: [
      {
        title: "पटना साहिब में नई बिजली परियोजना"
      },
      {
        title: "रवि शंकर प्रसाद ने सड़क सुरक्षा अभियान शुरू किया"
      }
    ]
  },
  {
    area_name: "Vaishali",
    vidhayak_info: {
      name: "राजेश रंजन उर्फ पप्पू यादव",
      image_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchimage2.png",
      age: 52,
      last_election_vote_percentage: "45.8%",
      experience: 18,
      party_name: "RJD",
      party_icon_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchpartyimage1.png",
      manifesto_link: "https://example.com/pappu_manifesto.pdf",
      manifesto_score: 50,
      metadata: {
        education: "स्नातक",
        net_worth: "₹3.8 करोड़",
        criminal_cases: 2,
        attendance: "78%",
        questions_asked: 62,
        funds_utilisation: "71%"
      },
      survey_score: [
        {
          question: "क्या आप पिछले पांच साल के कार्यकाल से खुश हैं?",
          yes_votes: 500,
          no_votes: 500,
          score: 50
        }
      ]
    },
    dept_info: [
      {
        id: uuidv4(),
        dept_name: "जल आपूर्ति",
        work_info: [
          "हर घर नल कनेक्शन",
          "जल संरक्षण अभियान",
          "जल गुणवत्ता परीक्षण",
          "वर्षा जल संग्रहण"
        ],
        survey_score: [
          {
            question: "जल आपूर्ति के क्षेत्र में सरकार के कार्य से आप कितने संतुष्ट हैं?",
            ratings: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
            score: 50
          }
        ],
        average_score: 50
      },
      {
        id: uuidv4(),
        dept_name: "ग्रामीण विकास",
        work_info: [
          "पीएम ग्राम सड़क योजना",
          "मनरेगा कार्यक्रम",
          "ग्राम पंचायत सशक्तिकरण",
          "डिजिटल गांव कार्यक्रम"
        ],
        survey_score: [
          {
            question: "ग्रामीण विकास के क्षेत्र में सरकार के प्रयासों से आप कितने संतुष्ट हैं?",
            ratings: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
            score: 50
          }
        ],
        average_score: 50
      }
    ],
    other_candidates: [
      {
        id: 1,
        candidate_name: "वीरेंद्र कुमार",
        candidate_image_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchimage2.png",
        candidate_party: "BJP",
        candidate_party_icon_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchpartyimage1.png",
        vote_share: "38.9%"
      },
      {
        id: 2,
        candidate_name: "राजेश कुमार",
        candidate_image_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchimage2.png",
        candidate_party: "Congress",
        candidate_party_icon_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchpartyimage1.png",
        vote_share: "15.3%"
      }
    ],
    latest_news: [
      {
        title: "वैशाली में जल संरक्षण अभियान शुरू"
      },
      {
        title: "पप्पू यादव ने ग्रामीण विकास योजना का शुभारंभ किया"
      }
    ]
  },
  {
    area_name: "Nalanda",
    vidhayak_info: {
      name: "शाहिद अली",
      image_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchimage1.png",
      age: 45,
      last_election_vote_percentage: "41.2%",
      experience: 8,
      party_name: "JDU",
      party_icon_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchpartyimage2.png",
      manifesto_link: "https://example.com/shahid_manifesto.pdf",
      manifesto_score: 50,
      metadata: {
        education: "एमबीए",
        net_worth: "₹1.8 करोड़",
        criminal_cases: 0,
        attendance: "95%",
        questions_asked: 73,
        funds_utilisation: "88%"
      },
      survey_score: [
        {
          question: "क्या आप पिछले पांच साल के कार्यकाल से खुश हैं?",
          yes_votes: 500,
          no_votes: 500,
          score: 50
        }
      ]
    },
    dept_info: [
      {
        id: uuidv4(),
        dept_name: "उच्च शिक्षा",
        work_info: [
          "कॉलेजों में आधुनिक सुविधाएं",
          "छात्रवृत्ति कार्यक्रम",
          "रोजगार प्रशिक्षण केंद्र",
          "अंतरराष्ट्रीय छात्र आदान-प्रदान"
        ],
        survey_score: [
          {
            question: "उच्च शिक्षा के क्षेत्र में सरकार के प्रयासों से आप कितने संतुष्ट हैं?",
            ratings: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
            score: 50
          }
        ],
        average_score: 50
      },
      {
        id: uuidv4(),
        dept_name: "पर्यटन",
        work_info: [
          "बौद्ध पर्यटन सर्किट",
          "ऐतिहासिक स्थलों का संरक्षण",
          "स्वच्छ पर्यटन अभियान",
          "स्थानीय कला-संस्कृति का प्रचार"
        ],
        survey_score: [
          {
            question: "पर्यटन विकास के क्षेत्र में सरकार के कार्य से आप कितने संतुष्ट हैं?",
            ratings: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
            score: 50
          }
        ],
        average_score: 50
      }
    ],
    other_candidates: [
      {
        id: 1,
        candidate_name: "राजेश कुमार",
        candidate_image_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchimage2.png",
        candidate_party: "BJP",
        candidate_party_icon_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchpartyimage1.png",
        vote_share: "42.1%"
      },
      {
        id: 2,
        candidate_name: "मोहम्मद शफीक",
        candidate_image_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchimage2.png",
        candidate_party: "RJD",
        candidate_party_icon_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchpartyimage1.png",
        vote_share: "16.7%"
      }
    ],
    latest_news: [
      {
        title: "नालंदा में उच्च शिक्षा केंद्र का उद्घाटन"
      },
      {
        title: "शाहिद अली ने पर्यटन विकास योजना शुरू की"
      }
    ]
  },
  {
    area_name: "Muzaffarpur",
    vidhayak_info: {
      name: "सुशील कुमार मोदी",
      image_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchimage2.png",
      age: 70,
      last_election_vote_percentage: "44.5%",
      experience: 25,
      party_name: "BJP",
      party_icon_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchpartyimage2.png",
      manifesto_link: "https://example.com/sushil_manifesto.pdf",
      manifesto_score: 50,
      metadata: {
        education: "एमए",
        net_worth: "₹8.7 करोड़",
        criminal_cases: 0,
        attendance: "87%",
        questions_asked: 156,
        funds_utilisation: "91%"
      },
      survey_score: [
        {
          question: "क्या आप पिछले पांच साल के कार्यकाल से खुश हैं?",
          yes_votes: 500,
          no_votes: 500,
          score: 50
        }
      ]
    },
    dept_info: [
      {
        id: uuidv4(),
        dept_name: "स्वच्छता",
        work_info: [
          "स्वच्छ भारत मिशन",
          "शौचालय निर्माण",
          "कचरा प्रबंधन",
          "जल निकासी व्यवस्था"
        ],
        survey_score: [
          {
            question: "स्वच्छता के क्षेत्र में सरकार के कार्य से आप कितने संतुष्ट हैं?",
            ratings: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
            score: 50
          }
        ],
        average_score: 50
      },
      {
        id: uuidv4(),
        dept_name: "खेलकूद",
        work_info: [
          "खेल मैदानों का निर्माण",
          "युवा कल्याण केंद्र",
          "खेल प्रतियोगिताएं",
          "खिलाड़ी प्रशिक्षण कार्यक्रम"
        ],
        survey_score: [
          {
            question: "खेलकूद के क्षेत्र में सरकार के प्रयासों से आप कितने संतुष्ट हैं?",
            ratings: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
            score: 50
          }
        ],
        average_score: 50
      }
    ],
    other_candidates: [
      {
        id: 1,
        candidate_name: "राजेश रंजन",
        candidate_image_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchimage1.png",
        candidate_party: "RJD",
        candidate_party_icon_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchpartyimage1.png",
        vote_share: "39.8%"
      },
      {
        id: 2,
        candidate_name: "अमित कुमार",
        candidate_image_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchimage2.png",
        candidate_party: "Congress",
        candidate_party_icon_url: "https://blog-meme.blr1.digitaloceanspaces.com/charchamanchpartyimage1.png",
        vote_share: "15.7%"
      }
    ],
    latest_news: [
      {
        title: "मुजफ्फरपुर में स्वच्छता अभियान शुरू"
      },
      {
        title: "सुशील कुमार मोदी ने खेल मैदान का उद्घाटन किया"
      }
    ]
  },
];

// Function to generate UUIDs for dept_info
export const generateDeptInfoWithUUIDs = (deptInfoRaw) => {
  return deptInfoRaw.map(dept => ({
    ...dept,
    id: uuidv4()
  }));
};

// Function to create a new constituency with proper UUIDs
export const createConstituencyWithUUIDs = (constituencyData) => {
  return {
    ...constituencyData,
    dept_info: generateDeptInfoWithUUIDs(constituencyData.dept_info)
  };
};

// Function to get constituency by area name
export const getConstituencyByAreaName = (areaName) => {
  return constituencyData.find(constituency => 
    constituency.area_name.toLowerCase() === areaName.toLowerCase()
  );
};

// Function to get all constituency names
export const getAllConstituencyNames = () => {
  return constituencyData.map(constituency => ({
    area_name: constituency.area_name
  }));
};
