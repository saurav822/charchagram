'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { trackPageView, trackButtonClick } from "@/utils/analytics";

export default function CharchagramTermsOfService() {
  const router = useRouter();

  useEffect(() => {
    trackPageView('Terms', '/terms');
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Section with Back Button */}
      <header className="bg-[#273F4F] px-4 py-4 text-white">
        <div className="flex items-center">
          <button
            onClick={() => {
              trackButtonClick('back_button', 'terms_page');
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
          <h1 className="ml-4 text-xl font-medium">टर्म्स ऑफ़ सर्विस</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 bg-white">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
           चर्चाग्राम – टर्म्स ऑफ़ सर्विस एग्रीमेंट
        </h1>
        <div className="mb-8">
          <p className="text-sm text-gray-600 italic mb-4">
            [वैश्विक टिप्पणी: इन शर्तों को संशोधित किया गया है इस आधार पर कि कंपनी 'मध्यस्थ' के रूप में योग्य है जैसा कि सूचना प्रौद्योगिकी अधिनियम, 2000 के अंतर्गत परिभाषित किया गया है।]
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">प्रभावी तिथि:</span> 15 अगस्त 2025
          </p>
          <p className="text-sm text-gray-600 mb-6">
            <span className="font-semibold">अंतिम संशोधन तिथि:</span> 5 सितम्बर 2025
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">चर्चाग्राम में आपका स्वागत है।</h2>
        </div>

        {/* Introduction */}
        <div className="mb-8">
          <p className="text-base leading-7 text-gray-700 mb-4">
            ये सेवा शर्तें ("शर्तें") आपके ("आप", "आपका" या "उपयोगकर्ता") और चर्चाग्राम ("हम," "हमें," "हमारा") के बीच एक कानूनी रूप से बाध्यकारी समझौता हैं और हमारी वेबसाइट, सेवाओं, और अनुप्रयोगों (सामूहिक रूप से, "प्लैटफ़ॉर्म") तक आपकी पहुँच और उपयोग को नियंत्रित करती हैं।
          </p>
          <p className="text-base leading-7 text-gray-700 mb-4">
            इन शर्तों को चर्चाग्राम कंटेन्ट  पॉलिसी (
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => window.location.href = '/policy'}
              > यहाँ </span>
            उपलब्ध हैं) और चर्चाग्राम प्राइवेसी पॉलिसी (
                            <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => window.location.href = '/privacy'}
              > यहाँ </span>
              उपलब्ध हैं) के साथ पढ़ा जाना चाहिए। यदि आप इन शर्तों और नियमों से सहमत नहीं हैं, तो कृपया इस प्लैटफ़ॉर्म का उपयोग न करें।
          </p>
          <p className="text-base leading-7 text-gray-700">
            हमारी सेवाएँ (जैसा कि नीचे विस्तार से वर्णित है) और ये शर्तें भारतीय न्याय संहिता, 2023 और सूचना प्रौद्योगिकी अधिनियम, 2000 (उसमें किए गए सभी संशोधन और उसके अंतर्गत बनाए गए नियमों सहित) के अनुरूप हैं। जब आप हमारे प्लैटफ़ॉर्म पर एक खाता बनाते हैं या हमारे प्लैटफ़ॉर्म या हमारी किसी भी सेवा का उपयोग करते हैं, तो आप इन शर्तों को स्वीकार करते हैं और उनसे सहमत होते हैं।
          </p>
        </div>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. सेवा प्रदाता</h2>
          <p className="text-base leading-7 text-gray-700">
            चर्चा फाउंडेशन, जो भारत के कानूनों के तहत व्यवस्थित और संचालित है, जिसका व्यवसाय पता FLAT NO- 304, PKT 8 SECT 12 DWARKA, N.S.I.T. Dwarka, New Delhi, South West Delhi- 110078, Delhi है।
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. आयु आवश्यकताएँ</h2>
          <p className="text-base leading-7 text-gray-700">
            इस प्लैटफ़ॉर्म पर खाता बनाने या कंटेन्ट  के साथ अंतर्क्रिया करने के लिए उपयोगकर्ताओं की आयु कम से कम 18 वर्ष होनी चाहिए। जबकि कोई भी सार्वजनिक कंटेन्ट  देख सकता है, आप खाता बनाते समय या प्लैटफ़ॉर्म के साथ संलग्न होते समय पुष्टि करते हैं कि आपकी आयु 18 वर्ष या उससे अधिक है।
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. शर्तों के साथ सहमति</h2>
          <p className="text-base leading-7 text-gray-700">
            इस समझौते की शर्तें आपके और चर्चाग्राम के बीच संबंध को परिभाषित करने में मदद करती हैं। प्लैटफ़ॉर्म का उपयोग करके या उसके साथ अंतर्क्रिया करके आप पुष्टि करते हैं कि आपने इन्हें पढ़ लिया है, समझ लिया है, और इन टर्म्स ऑफ़ सर्विस, हमारी प्राइवेसी पॉलिसी, कंटेन्ट  पॉलिसी, और डिस्क्लेमर द्वारा बंधने के लिए सहमत हैं।
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. प्लेटफ़ॉर्म और हमारी भूमिका एक मध्यस्थ के रूप में</h2>
          <p className="text-base leading-7 text-gray-700">
            चर्चाग्राम उपयोगकर्ताओं को इंटरैक्ट करने, कंटेन्ट  पोस्ट करने और सार्वजनिक चर्चा में भाग लेने के लिए एक स्थान प्रदान करता है। हम "मध्यस्थ" हैं जैसा कि भारत के सूचना प्रौद्योगिकी अधिनियम, 2000 के तहत परिभाषित है। हमारा रोल यूजर-जेनरेटेड कंटेन्ट  के लिए एक न्यूट्रल प्लेटफ़ॉर्म प्रदान करना है। ये नियम सूचना प्रौद्योगिकी (मध्यस्थ दिशानिर्देश और डिजिटल मीडिया एथिक्स कोड) नियम, 2021 के रूल 3(1) के प्रावधानों के अनुसार प्रकाशित किए गए हैं, जो प्लेटफ़ॉर्म तक पहुँच और उपयोग के लिए नियम और विनियम, चर्चाग्राम कंटेंट पॉलिसी, चर्चाग्राम प्राइवेसी पॉलिसी, डिसक्लेमर और चर्चाग्राम टर्म्स ऑफ यूज़ प्रकाशित करने की आवश्यकता रखते हैं। हम यूज़र्स द्वारा पोस्ट किए गए कंटेंट को क्रिएट, समर्थन या जिम्मेदार नहीं हैं।
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. आपका उपयोगकर्ता खाता</h2>
          <p className="text-base leading-7 text-gray-700 mb-4">
            प्लेटफ़ॉर्म के अधिकांश फीचर्स का उपयोग करने के लिए, आपको अकाउंट रजिस्टर करना होगा। आप सहमति देते हैं कि:
          </p>
          <div className="space-y-3">
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">a.</span> रजिस्ट्रेशन प्रक्रिया के दौरान सटीक, वर्तमान और पूरी जानकारी प्रदान करेंगे।
            </p>
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">b.</span> अपने पासवर्ड की सुरक्षा बनाए रखेंगे और अकाउंट के अनधिकृत एक्सेस के सभी जोखिम स्वीकार करेंगे। आप अपने अकाउंट के तहत होने वाली सभी गतिविधियों के लिए जिम्मेदार हैं।
            </p>
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">c.</span> यदि आपको प्लेटफ़ॉर्म या आपके अकाउंट से संबंधित कोई सुरक्षा उल्लंघन पता चले या शक हो, तो तुरंत हमें सूचित करेंगे।
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. कंटेन्ट और आपके अधिकार</h2>
          <p className="text-base leading-7 text-gray-700 mb-4">
            आप प्लेटफ़ॉर्म के उपयोग और किसी भी कंटेन्ट  के लिए जिम्मेदार हैं, जिसमें इसकी कानूनी वैधता, विश्वसनीयता और उपयुक्तता शामिल है।
          </p>
          <div className="space-y-3">
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">a. आपका कंटेन्ट :</span> आप किसी भी कंटेन्ट के अधिकार रखते हैं जिसे आप सबमिट, पोस्ट या डिस्प्ले करते हैं।
            </p>
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">b. हमें दिया गया लाइसेंस:</span> कंटेन्ट  सबमिट, पोस्ट या डिस्प्ले करके, आप हमें एक वैश्विक, गैर-विशिष्ट, रॉयल्टी-फ्री, सबलाइसेन्सेबल और ट्रांसफरेबल लाइसेंस प्रदान करते हैं, ताकि हम उस कंटेन्ट  का उपयोग, होस्ट, स्टोर, डिस्प्ले, पुन: उत्पादन, संशोधन, अनुकूलन, प्रकाशित और वितरित कर सकें। यह लाइसेंस प्लेटफ़ॉर्म को संचालित, विकसित, प्रदान, प्रचारित और सुधारने और नए प्लेटफ़ॉर्म विकसित करने के उद्देश्य से सीमित है। यह लाइसेंस तब समाप्त होता है जब आप अपना कंटेन्ट  या अकाउंट डिलीट करते हैं।
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. हमारे अधिकार</h2>
          <div className="space-y-3">
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">a.</span> हम प्लेटफ़ॉर्म पर किसी भी कंटेन्ट  को हटाने या वितरित करने से इनकार करने का अधिकार रखते हैं जो इन नियमों या हमारी नीतियों का उल्लंघन करता है।
            </p>
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">b.</span> जब हम रजिस्ट्रेशन के दौरान किसी उपयोगकर्ता से जानकारी एकत्र करते हैं, तो हम इसे रजिस्ट्रेशन रद्द या वापसी के बाद 180 दिन तक रखेंगे।
            </p>
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">c.</span> हम यह अधिकार भी रखते हैं कि किसी भी जानकारी को एक्सेस, पढ़ने, सुरक्षित करने और प्रकटीकरण करने के लिए जब हमें यह उचित लगे कि (i) किसी लागू कानून, विनियम, कानूनी प्रक्रिया या सरकारी अनुरोध को पूरा करना, (ii) नियमों को लागू करना, (iii) धोखाधड़ी, सुरक्षा या तकनीकी मुद्दों का पता लगाना और रोकना, (iv) उपयोगकर्ता सहायता अनुरोधों का जवाब देना, या (v) चर्चाग्राम, इसके उपयोगकर्ताओं और जनता के अधिकार, संपत्ति या सुरक्षा की रक्षा करना आवश्यक हो।
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. निषिद्ध व्यवहार</h2>
          <p className="text-base leading-7 text-gray-700 mb-4">
            आप सहमति देते हैं कि आप निम्नलिखित कार्य नहीं करेंगे, जो हमारी कंटेन्ट  पॉलिसी के अतिरिक्त हैं:
          </p>
          <div className="space-y-3">
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">a.</span> प्लेटफ़ॉर्म का उपयोग किसी भी अवैध या अनधिकृत उद्देश्य के लिए नहीं करेंगे या किसी गतिविधि को बढ़ावा नहीं देंगे जो नियमों या हमारी नीतियों का उल्लंघन करती हो।
            </p>
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">b.</span> प्लेटफ़ॉर्म या सर्वर्स/नेटवर्क्स में हस्तक्षेप या व्यवधान नहीं डालेंगे, जैसे किसी वर्म्स, वायरस, स्पायवेयर, मैलवेयर या किसी अन्य हानिकारक कोड का ट्रांसमिशन।
            </p>
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">c.</span> किसी भी सिस्टम या नेटवर्क की सुरक्षा या प्रमाणीकरण उपायों का उल्लंघन करने का प्रयास नहीं करेंगे।
            </p>
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">d.</span> प्लेटफ़ॉर्म का उपयोग किसी वाणिज्यिक उद्देश्य या किसी तीसरे पक्ष के लाभ के लिए नहीं करेंगे, सिवाय हमारी स्पष्ट अनुमति के।
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. निषिद्ध सामग्री</h2>
          <div className="space-y-3">
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">a.</span> आप सहमति देते हैं कि आप कोई भी कंटेन्ट पोस्ट नहीं करेंगे जो अवैध, हानिकारक या हमारी नीतियों का उल्लंघन करता हो।
            </p>
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">b.</span> एक मध्यस्थ के रूप में, हम किसी भी जानकारी को होस्ट, स्टोर या प्रकाशित नहीं करेंगे जो लागू कानून के तहत अवैध या प्रतिबंधित हो।
            </p>
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">c.</span> यदि हमें किसी सक्षम न्यायालय या सरकारी एजेंसी का आदेश मिलता है, तो हम कंटेन्ट  को 36 घंटों के भीतर हटाएंगे या एक्सेस निष्क्रिय करेंगे।
            </p>
          </div>
        </section>

        {/* Section 10 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. तृतीय-पक्ष डेटा और स्रोत</h2>
          <p className="text-base leading-7 text-gray-700">
            प्लेटफ़ॉर्म थर्ड-पार्टी स्रोतों से प्राप्त जानकारी प्रदर्शित कर सकता है। हम इसका स्वतंत्र सत्यापन नहीं करते और इसकी सटीकता, पूर्णता या समयबद्धता की गारंटी नहीं देते।
          </p>
        </section>

        {/* Section 11 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. विज्ञापन</h2>
          <p className="text-base leading-7 text-gray-700">
            हमारा प्लेटफ़ॉर्म विज्ञापन स्थान नहीं बेचता और थर्ड-पार्टी विज्ञापन नहीं चलाता। किसी उपयोगकर्ता द्वारा पोस्ट किया गया कोई भी वाणिज्यिक या राजनीतिक विज्ञापन उस उपयोगकर्ता की जिम्मेदारी है।
          </p>
        </section>

        {/* Section 12 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. नीतियों का प्रवर्तन</h2>
          <p className="text-base leading-7 text-gray-700">
            हम इन नियमों और नीतियों को लागू करने का अधिकार रखते हैं। उल्लंघन की गंभीरता के आधार पर कार्रवाई हो सकती है, जैसे कि कंटेन्ट  हटाना, चेतावनी जारी करना, अकाउंट अस्थायी या स्थायी रूप से निलंबित करना।
          </p>
        </section>

        {/* Section 13 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">13. समाप्ति</h2>
          <div className="space-y-3">
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">a.</span> आप किसी भी समय प्लेटफ़ॉर्म का उपयोग बंद कर सकते हैं और अकाउंट निष्क्रिय करके नियम समाप्त कर सकते हैं।
            </p>
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">b.</span> हम किसी भी समय आपका अकाउंट निलंबित या समाप्त कर सकते हैं यदि हमें लगता है कि आप नियमों या नीतियों का उल्लंघन कर रहे हैं, या प्लेटफ़ॉर्म प्रदान करना वाणिज्यिक रूप से संभव नहीं है।
            </p>
          </div>
        </section>

        {/* Section 14 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">14. शिकायत निवारण</h2>
          <p className="text-base leading-7 text-gray-700">
            उपयोगकर्ता अपनी शिकायतें या प्रश्न हमारे नामित शिकायत अधिकारी को ईमेल या रजिस्टर्ड पोस्ट के माध्यम से भेज सकते हैं:{' '}
            <a href="mailto:grievance.charchagram@gmail.com" className="text-blue-600 hover:underline">
              grievance.charchagram@gmail.com
            </a>
          </p>
        </section>

        {/* Section 15 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">15. अस्वीकरण और देयता की सीमा</h2>
          <div className="space-y-3">
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">a. "जैसा है" सेवा:</span> प्लेटफ़ॉर्म "जैसा है" और "उपलब्ध" के रूप में प्रदान किया जाता है, बिना किसी वारंटी के।
            </p>
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">b. देयता की सीमा:</span> अधिकतम सीमा तक हम किसी भी अप्रत्यक्ष, आकस्मिक, विशेष, परिणामी या दंडात्मक हानि के लिए जिम्मेदार नहीं हैं।
            </p>
          </div>
        </section>

        {/* Section 16 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">16. क्षतिपूर्ति</h2>
          <p className="text-base leading-7 text-gray-700">
            आप सहमति देते हैं कि चर्चाग्राम और इसके अधिकारी, निदेशक, कर्मचारी और एजेंट्स को किसी भी दावे, विवाद या नुकसान से क्षतिपूर्ति देंगे।
          </p>
        </section>

        {/* Section 17 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">17. लागू कानून और विवाद समाधान</h2>
          <p className="text-base leading-7 text-gray-700">
            ये नियम भारत के कानूनों द्वारा नियंत्रित होंगे। किसी भी कानूनी मामले को बेंगलुरु, कर्नाटक, भारत के न्यायालयों में हल किया जाएगा।
          </p>
        </section>

         {/* Section 18 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">18. सामान्य नियम</h2>
          <div className="space-y-3">
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">a. संपूर्ण समझौता:</span>  ये नियम, प्राइवेसी पॉलिसी, कंटेन्ट  पॉलिसी और अस्वीकरण हमारे और आपके बीच संपूर्ण समझौता हैं।
            </p>
            <p className="text-base leading-7 text-gray-700">
              <span className="font-semibold">b. नियमों में परिवर्तन:</span> हम समय-समय पर नियम संशोधित कर सकते हैं।
            </p>
          </div>
        </section>

        {/* Section 19 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">19. संपर्क</h2>
          <p className="text-base leading-7 text-gray-700">
            यदि आपके कोई प्रश्न हैं, तो संपर्क करें: grievance.charchagram@gmail.com
          </p>
        </section>          
        </main>
    </div>
  );
}