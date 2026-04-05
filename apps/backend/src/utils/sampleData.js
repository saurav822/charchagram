import { v4 as uuidv4 } from 'uuid';

// Sample constituency data for testing - Based on Raghopur Vidhan Sabha Kshetra
const sampleConstituencies = [
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
      metadata: {
        education: "स्नातकोत्तर",
        net_worth: "₹2.4 करोड़",
        criminal_cases: 0,
        attendance: "89%",
        questions_asked: 47,
        funds_utilisation: "78%"
      }
    },
    dept_info: [
      {
        id: uuidv4(),
        dept_name: "स्वास्थ्य",
        work_info: [
          "प्रत्येक गांव में प्राथमिक स्वास्थ्य केंद्र",
          "24/7 एम्बुलेंस सेवा",
          "मुफ्त दवाइयां और टीकाकरण"
        ],
        survey_score: [
          {
            question: "इस विषय पर सरकार के कार्य से आप कितने संतुष्ट हैं?",
            yes_votes: 680,
            no_votes: 320
          }
        ]
      },
      {
        id: uuidv4(),
        dept_name: "शिक्षा",
        work_info: [
          "सभी सरकारी स्कूलों में कंप्यूटर लैब",
          "मुफ्त किताबें और यूनिफॉर्म",
          "डिजिटल शिक्षा कार्यक्रम"
        ],
        survey_score: [
          {
            question: "शिक्षा के क्षेत्र में सरकार के प्रयासों से आप कितने संतुष्ट हैं?",
            yes_votes: 680,
            no_votes: 320
          }
        ]
      },
      {
        id: uuidv4(),
        dept_name: "अपराध",
        work_info: [
          "महिला सुरक्षा हेल्पलाइन",
          "हर 5 किमी पर पुलिस चौकी",
          "सीसीटीवी कैमरों की स्थापना"
        ],
        survey_score: [
          {
            question: "कानून व्यवस्था और सुरक्षा के मामले में आप कितने संतुष्ट हैं?",
            yes_votes: 680,
            no_votes: 320
          }
        ]
      },
      {
        id: uuidv4(),
        dept_name: "कृषि",
        work_info: [
          "MSP की गारंटी",
          "मुफ्त बीज और खाद वितरण",
          "किसान क्रेडिट कार्ड योजना"
        ],
        survey_score: [
          {
            question: "कृषि क्षेत्र में सरकार की नीतियों से आप कितने संतुष्ट हैं?",
            yes_votes: 680,
            no_votes: 320
          }
        ]
      }
    ],
    other_candidates: [
      {
        id: 1,
        candidate_name: "राहुल शर्मा",
        candidate_party: "Congress",
        vote_share: "18.2%"
      },
      {
        id: 2,
        candidate_name: "उत्कर्ष सिंह",
        candidate_party: "BJP",
        vote_share: "18.2%"
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
      metadata: {
        education: "एलएलबी",
        net_worth: "₹5.2 करोड़",
        criminal_cases: 1,
        attendance: "92%",
        questions_asked: 85,
        funds_utilisation: "82%"
      }
    },
    dept_info: [
      {
        id: uuidv4(),
        dept_name: "सड़क और परिवहन",
        work_info: [
          "राष्ट्रीय राजमार्ग का निर्माण",
          "सार्वजनिक परिवहन में सुधार",
          "सड़क सुरक्षा अभियान"
        ],
        survey_score: [
          {
            question: "सड़क और परिवहन के क्षेत्र में सरकार के कार्य से आप कितने संतुष्ट हैं?",
            yes_votes: 720,
            no_votes: 280
          }
        ]
      },
      {
        id: uuidv4(),
        dept_name: "बिजली",
        work_info: [
          "24x7 बिजली आपूर्ति",
          "सौर ऊर्जा परियोजनाएं",
          "ग्रामीण विद्युतीकरण"
        ],
        survey_score: [
          {
            question: "बिजली आपूर्ति के मामले में आप कितने संतुष्ट हैं?",
            yes_votes: 650,
            no_votes: 350
          }
        ]
      }
    ],
    other_candidates: [
      {
        id: 1,
        candidate_name: "अनिल कुमार",
        candidate_party: "Congress",
        vote_share: "35.4%"
      },
      {
        id: 2,
        candidate_name: "सुनील कुमार",
        candidate_party: "RJD",
        vote_share: "15.9%"
      }
    ]
  }
];

// Function to generate UUIDs for dept_info
const generateDeptInfoWithUUIDs = (deptInfoRaw) => {
  return deptInfoRaw.map(dept => ({
    ...dept,
    id: uuidv4()
  }));
};

// Function to create a new constituency with proper UUIDs
const createConstituencyWithUUIDs = (constituencyData) => {
  return {
    ...constituencyData,
    dept_info: generateDeptInfoWithUUIDs(constituencyData.dept_info)
  };
};

export {
  sampleConstituencies,
  generateDeptInfoWithUUIDs,
  createConstituencyWithUUIDs
};
