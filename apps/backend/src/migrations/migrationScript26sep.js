import mongoose from 'mongoose';
import Constituency from '../models/constituency.js';
import connectDB from '../config/db.js';
import { constituencyNameData } from './constant.js';
import fs from 'fs';

const exampleConstituencyDataObject =
{
    "_id": "68add9e4615f3037710afc8d",
    "area_name": "अगिआंव",
    "vidhayak_info": {
        "metadata": {
            "education": "स्नातक",
            "net_worth": "10.4 लाख",
            "criminal_cases": "4",
            "attendance": "--",
            "questions_asked": "27",
            "funds_utilisation": "--"
        },
        "name": "शिव प्रकाश रंजन",
        "image_url": "https://suvidha.eci.gov.in/ac/public/uploads1/candprofile/E24/2024/AC/s04/SHIVP-2024-20240508045927.jpg",
        "age": "34",
        "last_election_vote_percentage": "53%",
        "experience": "1",
        "party_name": "भाकपा(माले)",
        "party_icon_url": "https://res.cloudinary.com/dqikvjy9f/image/upload/v1755985439/CPIML_L_hiaurt.jpg",
        "manifesto_link": "https://drive.google.com/file/d/1XKXgk8SqDQaVJAFcyUhqEhPZr04l5RTM/view?usp=sharing",
        "manifesto_score": 47,
        "survey_score": [
            {
                "question": "क्या आप पिछले पांच साल के कार्यकाल से खुश हैं?",
                "yes_votes": [
                    "68ae94f11fcb0ea51c84f0c6",
                    "68b42cebc6769017c99091b5",
                    "68addc50af20a2258bddf52e",
                    "68b3495b7f0f6ccb36fd8983",
                    "68b4ab596d3284d7166ca072",
                    "68b4c65e2b7cb471f25f1e66",
                    "68b5467634d8e2a5d2fef5bf",
                    "68b5637d743274bcc292d646",
                    "68b595af941b25c79beed1fc",
                    "68ce23628ff0a9a6b2ae5aeb",
                    "68b4dc21a56de68302d0fe9e"
                ],
                "no_votes": [
                    "68ae948d1fcb0ea51c84f027",
                    "68ae95051fcb0ea51c84f0d9",
                    "68ae92d41fcb0ea51c84ef56",
                    "68b42fb5c6769017c9909203",
                    "68b339957f0f6ccb36fd7cf6",
                    "68b5627a743274bcc292d5f1",
                    "68b9a39491388e14c84b628c",
                    "68ba78058edf6b5f63d3f3d7",
                    "68b5d1429b07aa05803b6e08"
                ],
                "score": 55
            }
        ]
    },
    "dept_info": [
        {
            "id": "0f38a0a4-8c11-4fd0-a1c7-aa3afd37ed75",
            "dept_name": "स्वास्थ्य",
            "work_info": [
                "सीपीआई (एमएल) एल के घोषणा पत्र में स्वास्थ्य क्षेत्र के लिए संकल्प लिए गए हैं कि प्राथमिक स्वास्थ्य केंद्रों को आपातकालीन देखभाल सेवाएँ प्रदान करने योग्य बनाए जाएंगे। हर 30,000 की आबादी पर शहरी प्राथमिक स्वास्थ्य केंद्र खोले जाएंगे।"
            ],
            "survey_score": [
                {
                    "ratings": {
                        "1": [
                            "68b5467634d8e2a5d2fef5bf",
                            "68b9a39491388e14c84b628c",
                            "68c51ab648f9b2222f950d56"
                        ],
                        "2": [
                            "68b339957f0f6ccb36fd7cf6"
                        ],
                        "3": [
                            "68ae92d41fcb0ea51c84ef56",
                            "68ae94f11fcb0ea51c84f0c6",
                            "68b42cebc6769017c99091b5",
                            "68ce23628ff0a9a6b2ae5aeb"
                        ],
                        "4": [
                            "68ae95051fcb0ea51c84f0d9",
                            "68addc50af20a2258bddf52e",
                            "68b4dc21a56de68302d0fe9e"
                        ],
                        "5": [
                            "68ae948d1fcb0ea51c84f027",
                            "68b3495b7f0f6ccb36fd8983"
                        ]
                    },
                    "question": "आपके इलाके में स्वास्थ्य सुधार के प्रयासों से आप कितने संतुष्ट हैं",
                    "score": 50
                }
            ],
            "average_score": 50
        },
        {
            "id": "8df8ac61-b629-4d9f-9ecd-e3f3d3766015",
            "dept_name": "कृषि",
            "work_info": [
                "सीपीआई (एमएल) एल के घोषणा पत्र में कृषि क्षेत्र के लिए संकल्प लिए गए हैं कि एमएसपी को लागत का डेढ़ गुना सुनिश्चित किया जाएगा। किसानों को सस्ती ऋण सुविधा, सस्ती दरों पर बिजली-पानी और सुनिश्चित सिंचाई सुविधाएँ प्रदान की जाएंगी। साथ ही, हर पंचायत स्तर पर ख़रीद केंद्र स्थापित किए जाएंगे।"
            ],
            "survey_score": [
                {
                    "ratings": {
                        "1": [
                            "68b339957f0f6ccb36fd7cf6"
                        ],
                        "2": [
                            "68ae94f11fcb0ea51c84f0c6",
                            "68b5467634d8e2a5d2fef5bf"
                        ],
                        "3": [
                            "68ae92d41fcb0ea51c84ef56",
                            "68b3495b7f0f6ccb36fd8983",
                            "68b9a39491388e14c84b628c"
                        ],
                        "4": [
                            "68ae95051fcb0ea51c84f0d9",
                            "68addc50af20a2258bddf52e",
                            "68b4dc21a56de68302d0fe9e"
                        ],
                        "5": [
                            "68ae948d1fcb0ea51c84f027"
                        ]
                    },
                    "question": "आपके इलाके में कृषि सुधार के प्रयासों से आप कितने संतुष्ट हैं",
                    "score": 53
                }
            ],
            "average_score": 53
        },
        {
            "id": "d6481fe4-2ff5-4479-ad84-5a49443f7dc2",
            "dept_name": "महिला सशक्तिकरण",
            "work_info": [
                "सीपीआई (एमएल) एल के घोषणा पत्र में महिला सशक्तिकरण के लिए संकल्प लिए गए हैं कि यौन शोषण और घरेलू हिंसा की शिकार महिलाओं को तत्काल कानूनी सहायता और सामाजिक सहयोग प्रदान करने के लिए हेल्पलाइन स्थापित की जाएंगी। गर्भवती महिलाओं को पौष्टिक भोजन, स्वास्थ्य जांच, दवाएँ और सुरक्षित प्रसव की सुविधा सुनिश्चित की जाएगी।"
            ],
            "survey_score": [
                {
                    "ratings": {
                        "1": [],
                        "2": [
                            "68ae948d1fcb0ea51c84f027",
                            "68ae94f11fcb0ea51c84f0c6"
                        ],
                        "3": [
                            "68ae92d41fcb0ea51c84ef56",
                            "68addc50af20a2258bddf52e",
                            "68b339957f0f6ccb36fd7cf6"
                        ],
                        "4": [
                            "68ae95051fcb0ea51c84f0d9",
                            "68b3495b7f0f6ccb36fd8983",
                            "68b5467634d8e2a5d2fef5bf",
                            "68b9a39491388e14c84b628c",
                            "68b4dc21a56de68302d0fe9e"
                        ],
                        "5": []
                    },
                    "question": "आपके इलाके में महिला सशक्तिकरण सुधार के प्रयासों से आप कितने संतुष्ट हैं",
                    "score": 57
                }
            ],
            "average_score": 57
        },
        {
            "id": "988bccd6-7b74-4be2-9d32-eb34e067eb31",
            "dept_name": "रोजगार",
            "work_info": [
                "सीपीआई (एमएल) एल के घोषणा पत्र में रोजगार क्षेत्र के लिए संकल्प लिए गए हैं कि सभी लंबित सरकारी रिक्तियों को बिना देरी के भरा जाएगा। मनरेगा में सुधार कर परिवार की जगह प्रत्येक व्यक्ति को न्यूनतम मज़दूरी पर 200 दिन का रोजगार सुनिश्चित किया जाएगा।"
            ],
            "survey_score": [
                {
                    "ratings": {
                        "1": [
                            "68ae94f11fcb0ea51c84f0c6",
                            "68b3495b7f0f6ccb36fd8983",
                            "68b5467634d8e2a5d2fef5bf",
                            "68b9a39491388e14c84b628c"
                        ],
                        "2": [
                            "68ae948d1fcb0ea51c84f027",
                            "68ae95051fcb0ea51c84f0d9"
                        ],
                        "3": [
                            "68ae92d41fcb0ea51c84ef56",
                            "68addc50af20a2258bddf52e",
                            "68b339957f0f6ccb36fd7cf6"
                        ],
                        "4": [
                            "68b4dc21a56de68302d0fe9e"
                        ],
                        "5": []
                    },
                    "question": "आपके इलाके में रोजगार सुधार के प्रयासों से आप कितने संतुष्ट हैं",
                    "score": 28
                }
            ],
            "average_score": 28
        }
    ],
    "other_candidates": [
        {
            "id": "e9dc0043-4ed6-4bf5-bced-8c0f90e87409",
            "candidate_name": "प्रभुनाथ प्रसाद",
            "candidate_image_url": "https://suvidha.eci.gov.in/ac/public/uploads1/candprofile/E24/2024/AC/s04/PRABH-2024-20240514071734.jpg",
            "candidate_party": "जद (यू)",
            "vote_share": "32%"
        },
        {
            "id": "8aed03d1-eb41-4ce6-82ec-d6507e184f77",
            "candidate_name": "उपेंद्र कुमार",
            "candidate_image_url": "https://suvidha.eci.gov.in/ac/public/uploads1/candprofile/E24/2024/AC/s04/UPEND-2024-20240514072736.jpg",
            "candidate_party": "आईएनडी",
            "vote_share": "5%"
        },
        {
            "id": "946fa51a-a2aa-4588-a08b-d747a9e6f0f8",
            "candidate_name": "नोटा",
            "candidate_image_url": "https://res.cloudinary.com/dqikvjy9f/image/upload/v1755985440/NOTA_d5oqqr.jpg",
            "candidate_party": "नोटा",
            "vote_share": "3%"
        },
        {
            "id": "4f900885-6464-4678-9bab-7e3603ae56e2",
            "candidate_name": "सोनू कुमार",
            "candidate_image_url": "https://suvidha.eci.gov.in/ac/public/uploads1/candprofile/E24/2024/AC/s04/SONUK-2024-20240513045931.jpg",
            "candidate_party": "आईएनडी",
            "vote_share": "2%"
        }
    ],
    "latest_news": [
        {
            "title": ""
        },
        {
            "title": ""
        }
    ],
    "createdAt": "2025-08-26T15:59:33.072Z",
    "updatedAt": "2025-09-22T11:52:57.387Z"
}
const addEnglishNameForTheseIds = async (data) => {
    await connectDB();

    const fieldNamesToBeChanged = [
        ["vidhayak_info", "metadata", "net_worth"],
        ["vidhayak_info", "metadata", "criminal_cases"],
        ["vidhayak_info", "metadata", "expense_cleaned"],
        ["dept_info", "work_info"]
    ];
    console.log('here->>>>', data.length, data[0]);
    // Create a map for quick lookup by area_name
    const outputDataMap = new Map();
    data.forEach(item => {
        outputDataMap.set(item.area_name, item);
    });

    // Search for all constituencies in MongoDB and sort by area_name
    const constituencies = await Constituency.find({}).sort({ area_name: 1 });
    fs.writeFileSync('./sortedConstituencies26sep.json', JSON.stringify(constituencies, null, 2), 'utf8');
    let updatedCount = 0;
    const updatedConstituencies = [];

    for (let j = 0; j < constituencies.length; j++) {
        const constituency = constituencies[j];
        const outputItem = data[j];


        if (outputItem.area_name === constituency.area_name) {
            let hasChanges = false;
            const constituencyObj = constituency.toObject(); // Convert to plain object

            // Use fieldNamesToBeChanged to dynamically update fields
            constituencyObj.vidhayak_info.metadata.net_worth = outputItem.vidhayak_info.metadata.net_worth;
            constituencyObj.vidhayak_info.metadata.criminal_cases = outputItem.vidhayak_info.metadata.criminal_cases;
            constituencyObj.vidhayak_info.metadata.expense_cleaned = outputItem.vidhayak_info.metadata.expense_cleaned;
            for (let i = 0; i < constituencyObj.dept_info.length; i++) {
                constituencyObj.dept_info[i].work_info = outputItem.dept_info[i].work_info;
            }
            hasChanges = true;

            // Add to updated constituencies if there were changes
            if (hasChanges) {
                updatedConstituencies.push(constituencyObj);
                updatedCount++;
                console.log(`Updated ${constituency.area_name}`);
            }
        } else {
            console.log(`No output data found for ${constituency.area_name}`);
        }
    }

    // Save updated constituencies to local file
    fs.writeFileSync('./updatedConstituencies.json', JSON.stringify(updatedConstituencies, null, 2), 'utf8');

    console.log(`Updated ${updatedCount} constituencies and saved to updatedConstituencies.json`);
    await mongoose.disconnect();
}

// Helper function to get nested value using array path
function getNestedValue(obj, path) {
    return path.reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
}

// Helper function to set nested value using array path
function setNestedValue(obj, path, value) {
    const lastKey = path.pop();
    const target = path.reduce((current, key) => {
        if (!current[key]) current[key] = {};
        return current[key];
    }, obj);
    target[lastKey] = value;
}

// Run the migration

function sortAreasByName(data) {
    return data.sort((a, b) => a.area_name.localeCompare(b.area_name));
}
const outputData = JSON.parse(fs.readFileSync('output--24sep.json', 'utf8'));
await addEnglishNameForTheseIds(sortAreasByName(outputData));

// const sortedOutputData = sortAreasByName(outputData);
// fs.writeFileSync('./sortedOutputData24sep.json', JSON.stringify(sortedOutputData, null, 2), 'utf8');