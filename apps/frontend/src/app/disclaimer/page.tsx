'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { trackPageView, trackButtonClick } from "@/utils/analytics";

export default function CharchagramDisclaimer() {
  const router = useRouter();

  useEffect(() => {
    trackPageView('Disclaimer', '/disclaimer');
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Section with Back Button */}
      <header className="bg-[#273F4F] px-4 py-4 text-white">
        <div className="flex items-center">
          <button
            onClick={() => {
              trackButtonClick('back_button', 'disclaimer_page');
              router.back();
            }}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Go back"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </button>
          <h1 className="ml-4 text-xl font-medium">चर्चाग्राम डिस्क्लेमर</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4 text-center">
          चर्चाग्राम में आपका स्वागत है
        </h1>

        <p className="mb-4 text-base leading-relaxed">
          हमारी भूमिका एक निष्पक्ष प्लैटफ़ॉर्म की है जो आपकी आवाज़ और हमारी कम्युनिटी द्वारा बनाए गए कंटेन्ट को आगे बढ़ाता है। सभी बयान और विचार यूज़र-जनरेटेड हैं और चर्चाग्राम या इसके एफिलिएट्स के विचारों का प्रतिनिधित्व नहीं करते। हम प्लैटफ़ॉर्म पर उपलब्ध कराई गई सभी राजनीतिक जानकारी या कंटेन्ट के प्रति निष्पक्ष रहते हैं।
        </p>

        <p className="mb-4 text-base leading-relaxed">
          यह सेवा 18 वर्ष से अधिक उम्र के यूज़र्स के लिए है। "मैं सहमत हूं" पर क्लिक करके, आप पुष्टि करते हैं कि आपकी आयु कम से कम 18 वर्ष है और आप इस डिस्क्लेमर, प्राइवेसी पॉलिसी, कंटेन्ट पॉलिसी और टर्म्स ऑफ़ यूज़ की शर्तों को स्वीकार करते हैं।
        </p>

        <p className="mb-6 text-base leading-relaxed">
          हमारी कम्युनिटी को सभी के लिए सुरक्षित और सम्मानजनक बनाए रखने के लिए, हम किसी भी ऐसे कंटेन्ट को हटा देंगे जो हमारे रूल्स या भारतीय कानून का उल्लंघन करता है।
        </p>

        <h2 className="text-xl font-bold mb-3">
          सूचना की शुद्धता
        </h2>

        <p className="mb-6 text-base leading-relaxed">
          चर्चाग्राम पर कंटेन्ट में विचार, दावे, या थर्ड-पार्टी मटीरियल शामिल हो सकते हैं। सभी इंफॉर्मेशन को सही, पूर्ण या नवीनतम मान लेना आवश्यक नहीं है। यूज़र्स को सलाह दी जाती है कि वे अपने विवेक का उपयोग करें और राजनीतिक या किसी भी अन्य कंटेन्ट को उस पर निर्भर होने से पहले स्वतंत्र रूप से सत्यापित करें।
        </p>

        <h2 className="text-xl font-bold mb-3">
          कृपया यह पोस्ट न करें:
        </h2>

        <div className="mb-4 space-y-3">
          <p className="text-base leading-relaxed">
            <span className="font-bold">घृणास्पद भाषण:</span> ऐसा कंटेन्ट जो नस्ल, धर्म, जाति, लिंग या अन्य पहचान के आधार पर किसी भी ग्रुप पर हमला करता हो या उन्हें नीचा दिखाता हो।
          </p>

          <p className="text-base leading-relaxed">
            <span className="font-bold">राष्ट्रीय सुरक्षा:</span> ऐसा कंटेन्ट जो भारत की संप्रभुता, सुरक्षा, या पब्लिक ऑर्डर को प्रभावित करता हो; साम्प्रदायिक वैमनस्य को बढ़ावा देता हो; हिंसा भड़काता हो; या स्थानीय कानूनों का उल्लंघन करता हो।
          </p>

          <p className="text-base leading-relaxed">
            <span className="font-bold">हानिकारक भ्रामक जानकारी:</span> झूठी या भ्रामक इंफॉर्मेशन जो वास्तविक दुनिया में नुकसान पहुँचा सकती हो।
          </p>

          <p className="text-base leading-relaxed">
            <span className="font-bold">हरासमेंट और बुलिंग:</span> व्यक्तिगत हमले, धमकियाँ, या ऐसा कंटेन्ट जिसका उद्देश्य दूसरों को डराना हो।
          </p>

          <p className="text-base leading-relaxed">
            <span className="font-bold">इल्लीगल कंटेन्ट:</span> ऐसा कोई भी मटेरियल जो भारतीय कानून का उल्लंघन करता हो, जिसमें अश्लील कंटेन्ट, प्राइवेसी उल्लंघन, या इंटेलेक्चुअल प्रॉपर्टी इन्फ्रिंजमेंट शामिल हो।
          </p>
        </div>

        <p className="mb-6 text-base leading-relaxed">
          प्लैटफ़ॉर्म पर प्रतिबंधित कंटेन्ट की विस्तृत जानकारी के लिए, कृपया कंटेन्ट पॉलिसी देखें जो IT Act, 2000 और उसके अंतर्गत बनाए गए रूल्स के अनुरूप बनाई गई है।
        </p>

        <h2 className="text-xl font-bold mb-3">
          कैसे मदद करें
        </h2>

        <p className="mb-4 text-base leading-relaxed">
          आईटी एक्ट, 2000 और इन्फ़ॉर्मेशन टेक्नोलॉजी (इंटरमीडियरी गाइडलाइन्स एंड डिजिटल मीडिया एथिक्स कोड रूल्स), 2021 के अंतर्गत एक इंटरमीडियरी के रूप में, हम ड्यू डिलिजेंस दायित्वों का पालन करते हैं। यदि आप कुछ ऐसा देखते हैं जो इन रूल्स का उल्लंघन करता है, तो कृपया रिपोर्ट फीचर का उपयोग करें। हमारे पास एक ग्रिवेन्स रिड्रेसल मेकॅनिज़्म भी है जिसके माध्यम से ऐसे उल्लंघनों की रिपोर्ट की जा सकती है, जिसका विवरण टर्म्स ऑफ़ यूज़ में पाया जा सकता है। हम हर रिपोर्ट की समीक्षा करते हैं और कानून के अनुसार उचित कार्रवाई करते हैं।
        </p>
      </main>
    </div>
  );
}