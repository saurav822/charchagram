'use client';

const CommunityRuleSection = () => {

    const communityRules = [
        {
            id: 1,
            icon: (
                <svg className="w-6 h-6 text-[#176DCF]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM4 16V4h16v12H5.17L4 17.17V16z" />
                </svg>
            ),
            title: 'सम्मानजनक संवाद',
            description: 'सभी के साथ शिष्टाचार और सम्मान से बात करें'
        },
        {
            id: 2,
            icon: (
                <svg className="w-6 h-6 text-[#176DCF]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z" /> {/* Placeholder: Shield with exclamation or checkmark */}
                </svg>
            ),
            title: 'तथ्यपरक जानकारी',
            description: 'केवल सत्यापित और तथ्यपरक जानकारी साझा करे'
        },
        {
            id: 3,
            icon: (
                <svg className="w-6 h-6 text-[#176DCF]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-4-3c0-2.21-1.79-4-4-4S4 5.79 4 8s1.79 4 4 4c.71 0 1.37-.16 2-.43V14H4c-2.21 0-4 1.79-4 4v2h24v-2c0-2.21-1.79-4-4-4h-4v-1.43c.63-.27 1.29-.43 2-.43z" />
                </svg>
            ),
            title: 'सामुदायिक भलाई',
            description: 'समुदाय की भलाई को ध्यान में रखकर पोस्ट करे'
        },
        {
            id: 4,
            icon: (
                <svg className="w-6 h-6 text-[#176DCF]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
                </svg>
            ),
            title: 'राष्ट्रीय एकता',
            description: 'धर्म, जाति, भाषा के आधार पर भेदभाव न करे'
        }
    ];

    return (
        <div className={`min-h-[100px] bg-[#F6F6F6] flex flex-col rounded-lg items-center `}>
            <div className="rounded-lg w-full max-w-md p-6">
                {/* Header: सामुदायिक नियम */}
                <div className="px-4">
                    <h2 className="postsection-community-rule-header mb-4">सामुदायिक नियम</h2>

                    {/* Rules List */}
                    <div className="space-y-6 ">
                        {communityRules.map(rule => (
                            <div key={rule.id} className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-[#E2EBF3] rounded-full flex items-center justify-center flex-shrink-0">
                                    {rule.icon}
                                </div>
                                <div>
                                    <h3 className="postsection-community-rule-title">{rule.title}</h3>
                                    <p className="postsection-community-rule-description">{rule.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Note Section */}
                <div className="bg-[#F0F2F4] border-l-4 border-[#273F4F] rounded-md p-4 mt-8 w-full">
                    <p className="postsection-community-rule-note w-full">
                        <span className="font-bold text-">नोट:</span> नियमों का उल्लंघन करने वाली पोस्ट हटाई जा सकती हैं।
                        गलत जानकारी फैलाने या अभद्र भाषा का प्रयोग करने पर खाता निलंबित किया जा सकता है।
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CommunityRuleSection;