'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { trackPageView, trackButtonClick } from "@/utils/analytics";

export default function CharchagramPrivacyPolicy() {
  const router = useRouter();

  useEffect(() => {
    trackPageView('Privacy', '/privacy');
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Section with Back Button */}
      <header className="bg-[#273F4F] px-4 py-4 text-white">
        <div className="flex items-center">
          <button
            onClick={() => {
              trackButtonClick('back_button', 'privacy_page');
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
          <h1 className="ml-4 text-xl font-medium">प्राइवेसी पॉलिसी</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 bg-white">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              चर्चाग्राम – प्राइवेसी पॉलिसी
            </h1>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">प्रभावी तिथि:</span> 15 अगस्त 2025
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">अंतिम संशोधन तिथि:</span> 5 सितम्बर 2025
            </p>

          {/* Introduction */}
          <div className="mb-8">
            <p className="text-base leading-7 text-gray-700">
              चर्चा फाउंडेशन और इसके सहयोगी (सामूहिक रूप से, "चर्चाग्राम", "हम" या "हमें") प्रौद्योगिकी एवं सामुदायिक पहलों के माध्यम से नागरिक भागीदारी, लोकतांत्रिक मूल्यों और सार्वजनिक जागरूकता को बढ़ावा देने हेतु एक निष्पक्ष मंच प्रदान करने के कार्य में संलग्न हैं। यह प्राइवेसी पॉलिसी उन प्रथाओं का वर्णन करती है जिनके तहत हम आपका व्यक्तिगत विवरण संग्रहित, संग्रहीत, उपयोग, संसाधित और प्रकटीकरण करते हैं — वह विवरण जो आप हमें हमारी वेबसाइट charchagram.com ("प्लैटफ़ॉर्म") तक पहुँचने, उसका उपयोग करने या किसी अन्य प्रकार से संवाद करने पर प्रदान करते हैं, अथवा उन उत्पादों या सेवाओं (सामूहिक रूप से, "सेवाएँ") का उपयोग करते समय उपलब्ध कराते हैं।
            </p>
          </div>

          <div className="mb-8">
            <p className="text-base leading-7 text-gray-700">
              कृपया ध्यान दें कि जब तक इस नीति में विशेष रूप से परिभाषित न किया गया हो, बड़े अक्षरों वाले शब्दों का वही अर्थ होगा जो हमारी शर्तों और नियमों में उन्हें दिया गया है, जो 
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => window.location.href = '/terms'}
              > यहाँ </span>
              उपलब्ध हैं ("टर्म्स")। कृपया इस प्राइवेसी पॉलिसी को टर्म्स के साथ पढ़ें।
            </p>
          </div>

          <div className="mb-8">
            <p className="text-base leading-7 text-gray-700 font-medium">
              सेवाओं का उपयोग करके, आप पुष्टि करते हैं कि आपने इस प्राइवेसी पॉलिसी को पढ़ा है और इसके अंतर्गत वर्णित संसाधन गतिविधियों के लिए अपनी सहमति देते हैं।
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              हम कौन-सी जानकारी एकत्र करते हैं
            </h2>
            <p className="text-base leading-7 text-gray-700 mb-4">
              हम आपके बारे में विभिन्न प्रकार की व्यक्तिगत जानकारी एकत्र करते हैं, जिसमें शामिल हैं (पर सीमित नहीं):
            </p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                आपके द्वारा दी गई जानकारी :
              </h3>
              <p className="text-base leading-7 text-gray-700 mb-3">
                जब आप हमारी सेवाओं का उपयोग करते हैं तो हम वह कंटेन्ट , संचार और अन्य जानकारी एकत्र करते हैं जो आप प्रदान करते हैं — जैसे खाता बनाना, कंटेन्ट  बनाना या साझा करना, संदेश भेजना या दूसरों से संवाद करना।
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li className="text-base leading-7 text-gray-700">
                  <span className="font-semibold">खाता जानकारी :</span> नाम, ईमेल पता और पासवर्ड (खाता बनाने के समय)।
                </li>
                <li className="text-base leading-7 text-gray-700">
                  <span className="font-semibold">प्रोफ़ाइल जानकारी :</span> वैकल्पिक विवरण जैसे उपयोगकर्ता नाम, परिचय (बायो) या प्रोफ़ाइल तस्वीर।
                </li>
                <li className="text-base leading-7 text-gray-700">
                  <span className="font-semibold">आपका कंटेन्ट :</span> पोस्ट, टिप्पणियाँ और मंच पर भेजे गए संदेश।
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                स्वचालित रूप से एकत्र की गई जानकारी :
              </h3>
              <p className="text-base leading-7 text-gray-700 mb-3">
                हम पैटर्न, विश्लेषणात्मक जानकारी और प्लेटफ़ॉर्म इंटरैक्शन रुझान एकत्र करते हैं ताकि आपके अनुभव को सुरक्षित और वैयक्तिकृत किया जा सके।
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li className="text-base leading-7 text-gray-700">
                  <span className="font-semibold">उपयोग विवरण :</span> वे पन्ने, स्क्रीन और कंटेन्ट जिन्हें आप देखते हैं, पसंद करते हैं, पोस्ट या रिपोर्ट करते हैं; प्रयुक्त फीचर्स; सहभागिता के आँकड़े; खोज प्रश्न; लिंक क्लिक; कंटेन्ट  और विज्ञापनों के साथ संपर्क।
                </li>
                <li className="text-base leading-7 text-gray-700">
                  <span className="font-semibold">डिवाइस और लॉग विवरण :</span> उदाहरण के लिए आईपी एड्रेस (सुरक्षा और प्रदर्शन हेतु)।
                </li>
                <li className="text-base leading-7 text-gray-700">
                  <span className="font-semibold">कुकीज़/SDKs :</span> आवश्यक कुकीज़ (आपकी सहमति के साथ); विश्लेषणात्मक कुकीज़ और SDKs।
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              हम आपकी व्यक्तिगत जानकारी का कैसे उपयोग करते हैं
            </h2>
            <p className="text-base leading-7 text-gray-700 mb-4">
              हम आपकी व्यक्तिगत जानकारी निम्न उद्देश्यों के लिए उपयोग करते हैं:
            </p>
            <div className="space-y-3">
              <p className="text-base leading-7 text-gray-700">
                <span className="font-semibold">पहचान सत्यापन:</span> आपकी पहचान सत्यापित करने, आपको एक उपयोगकर्ता के रूप में पंजीकृत करने और प्लेटफ़ॉर्म पर आपका खाता बनाने के लिए।
              </p>
              <p className="text-base leading-7 text-gray-700">
                <span className="font-semibold">प्लेटफ़ॉर्म का संचालन और सुधार:</span> सेवाएँ प्रदान करने, रुझानों की निगरानी करने, आपके अनुभव को वैयक्तिकृत करने और नए फीचर्स विकसित करने के लिए।
              </p>
              <p className="text-base leading-7 text-gray-700">
                <span className="font-semibold">समुदाय की सुरक्षा:</span> खातों और गतिविधियों का सत्यापन करना, हानिकारक व्यवहार का मुकाबला करना, स्पैम और अन्य हानिकारक अनुभवों का पता लगाना और रोकना, कंटेन्ट  मॉडरेट करना, हमारे उत्पादों की अखंडता बनाए रखना, सुरक्षा बढ़ाना, हमारी शर्तें और दिशानिर्देश लागू करना तथा अवैध गतिविधियों को रोकना।
              </p>
              <p className="text-base leading-7 text-gray-700">
                <span className="font-semibold">संचार:</span> आपको विपणन संदेश, सेवा-संबंधी सूचनाएँ और नीतियों/शर्तों से संबंधित सूचनाएँ भेजने तथा जब आप हमसे संपर्क करते हैं तो आपके प्रश्नों का उत्तर देने के लिए।
              </p>
              <p className="text-base leading-7 text-gray-700">
                <span className="font-semibold">कानूनी अनुपालन:</span> भारतीय कानूनों, कानूनी प्रक्रियाओं या किसी वैध सरकारी अनुरोध का पालन करने हेतु; अदालती आदेशों का जवाब देने, हमारे कानूनी अधिकारों की स्थापना या प्रवर्तन करने, तथा कानूनी दावों से बचाव के लिए।
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              हम आपकी व्यक्तिगत जानकारी कैसे साझा करते हैं
            </h2>
            <p className="text-base leading-7 text-gray-700 mb-4">
              हम आपकी जानकारी निम्न परिस्थितियों में साझा कर सकते हैं:
            </p>
            <div className="space-y-3">
              <p className="text-base leading-7 text-gray-700">
                <span className="font-semibold">सार्वजनिक रूप से:</span> सार्वजनिक रूप से साझा की गई जानकारी किसी भी व्यक्ति के लिए दिखाई दे सकती है, भले ही उसके पास खाता न हो। इसमें आपका उपयोगकर्ता नाम और वह कंटेन्ट  शामिल है जो आप सार्वजनिक दर्शकों के साथ साझा करते हैं।
              </p>
              <p className="text-base leading-7 text-gray-700">
                <span className="font-semibold">सेवा प्रदाता और बाहरी प्रसंस्करण:</span> हम भरोसेमंद भागीदारों (जैसे AWS, Google Cloud) और सेवा प्रदाताओं के साथ व्यक्तिगत जानकारी साझा कर सकते हैं जो हमारी सेवाएँ प्रदान करने में सहायता करते हैं; ये साझेदार गोपनीयता और सुरक्षा समझौतों के अधीन होते हैं।
              </p>
              <p className="text-base leading-7 text-gray-700">
                <span className="font-semibold">कानूनी प्रकटीकरण:</span> यदि भारतीय कानून की आवश्यकता हो तो हम आपकी व्यक्तिगत जानकारी सरकार या नियामक प्राधिकरणों के साथ साझा कर सकते हैं। आपकी सहमति के साथ या वैध अनुबंधों के अनुसार भी जानकारी साझा की जा सकती है।
              </p>
              <p className="text-base leading-7 text-gray-700">
                <span className="font-semibold">व्यावसायिक हस्तांतरण:</span> विलय, अधिग्रहण या परिसंपत्तियों की बिक्री जैसी स्थिति में (पूर्व सूचना सहित) आपकी जानकारी स्थानांतरित की जा सकती है; हम सुनिश्चित करेंगे कि आपकी गोपनीयता बनी रहे।
              </p>
              <p className="text-base leading-7 text-gray-700">
                <span className="font-semibold">सुरक्षा और जाँच:</span> धोखाधड़ी, सुरक्षा कमजोरियों या तकनीकी समस्याओं की पहचान, जाँच या समाधान हेतु आवश्यक होने पर जानकारी का प्रकटीकरण।
              </p>
              <p className="text-base leading-7 text-gray-700">
                <span className="font-semibold">अधिकारों की रक्षा:</span> चर्चाग्राम, हमारे उपयोगकर्ताओं या जनता के अधिकारों, संपत्ति या सुरक्षा की रक्षा के लिए आवश्यक होने पर।
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              कुकी नीति
            </h2>
            <p className="text-base leading-7 text-gray-700 mb-4">
              कुकीज़ छोटी फाइलें होती हैं जिन्हें कोई साइट या उसकी सेवा प्रदाता आपके डिवाइस पर आपके ब्राउज़र के जरिए रखती है (यदि आप अनुमति देते हैं)। कुकीज़ साइटों को आपके ब्राउज़र को पहचानने और कुछ जानकारी याद रखने में सक्षम बनाती हैं।
            </p>
            <p className="text-base leading-7 text-gray-700 mb-4">
              हम कुकीज़ का उपयोग आपको पहचानने, आपकी प्राथमिकताओं को भविष्य के विज़िट के लिए संचित करने और साइट ट्रैफ़िक व इंटरैक्शन का समग्र आँकड़ा इकट्ठा करने के लिए करते हैं ताकि आपको निर्बाध अनुभव प्रदान किया जा सके। तृतीय-पक्ष सेवा प्रदाता भी इस कार्य में हमारी सहायता कर सकते हैं, पर वे उस जानकारी का उपयोग केवल हमारी ओर से सेवाओं में सुधार के उद्देश्य से कर सकते हैं।
            </p>
            <p className="text-base leading-7 text-gray-700">
              कुछ परिस्थितियों में कुकीज़ तृतीय पक्षों द्वारा नियंत्रित भी की जा सकती हैं। यदि आप हमें व्यक्तिगत संदेश (जैसे ईमेल) भेजते हैं, या अन्य उपयोगकर्ता/तृतीय पक्ष हमें आपके प्लेटफ़ॉर्म उपयोग से संबंधित जानकारी भेजते हैं, तो हम उसे आपके नाम से संबंधित फ़ाइलों में संग्रहित कर सकते हैं।
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              आपके अधिकार और विकल्प
            </h2>
            <p className="text-base leading-7 text-gray-700 mb-4">
              भारतीय कानून के तहत, आपके पास निम्नलिखित अधिकार हैं:
            </p>
            <div className="space-y-3">
              <p className="text-base leading-7 text-gray-700">
                <span className="font-semibold">जानकारी तक पहुँच और संशोधन:</span> आप यह सुनिश्चित कर सकते हैं कि हमें प्रदान की गई व्यक्तिगत जानकारी सही, अद्यतन और पूर्ण है। आप प्लेटफ़ॉर्म पर अपने उपयोग के दौरान गलत या अपूर्ण जानकारी को सुधारने का अनुरोध कर सकते हैं। आप हमें grievance.charchagram@gmail.com पर ईमेल करके अपनी व्यक्तिगत जानकारी की प्रति प्राप्त करने का अनुरोध कर सकते हैं।
              </p>
              <p className="text-base leading-7 text-gray-700">
                <span className="font-semibold">सहमति वापस लेना:</span> आप कभी भी अपनी सहमति वापस ले सकते हैं; इसके लिए हमें ईमेल भेजें।
              </p>
              <p className="text-base leading-7 text-gray-700">
                <span className="font-semibold">जानकारी मिटाने का अनुरोध:</span> सहमति वापस लेने के बाद आप अपनी व्यक्तिगत जानकारी को हटाने का अनुरोध कर सकते हैं। चर्चाग्राम को आपका अनुरोध पूरा करने में लगभग 7 कार्य दिवस लग सकते हैं। एक बार आपका खाता हट जाने पर आपको संबंधित सेवाओं तक पहुँच खोनी पड़ सकती है।
              </p>
              <p className="text-base leading-7 text-gray-700">
                <span className="font-semibold">शिकायत निवारण:</span> किसी गोपनीयता संबंधी चिंता के लिए आप हमारे शिकायत निवारण अधिकारी से संपर्क कर सकते हैं।
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              जानकारी की सुरक्षा और संरक्षण
            </h2>
            <p className="text-base leading-7 text-gray-700 mb-4">
              आप सहमति देते हैं कि आपकी व्यक्तिगत जानकारी उस अवधि तक संग्रहित और संरक्षित रहेगी जो हमारे उद्देश्यों को पूरा करने और कानूनी दायित्वों को पूरा करने के लिए आवश्यक है।
            </p>
            <p className="text-base leading-7 text-gray-700">
              हम उपयुक्त और समयानुकूल सुरक्षा उपाय लागू करते हैं — जैसे एन्क्रिप्शन और पासवर्ड सुरक्षा — ताकि आपकी व्यक्तिगत जानकारी को अनधिकृत पहुँच और प्रकटीकरण से सुरक्षित रखा जा सके।
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              बच्चों की गोपनीयता
            </h2>
            <p className="text-base leading-7 text-gray-700">
              चर्चाग्राम का उद्देश्य 18 वर्ष से कम आयु के व्यक्तियों द्वारा उपयोग किए जाने के लिए नहीं है। हम बच्चों से जानबूझकर व्यक्तिगत जानकारी एकत्र नहीं करते। यदि हमें पता चलता है कि 18 वर्ष से कम आयु का कोई उपयोगकर्ता बिना आवश्यक सहमति के प्लेटफ़ॉर्म पर जानकारी दे रहा है, तो हम उसका खाता समाप्त कर देंगे और संबंधित जानकारी हटा देंगे।
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              नीति में परिवर्तन
            </h2>
            <p className="text-base leading-7 text-gray-700">
              हम समय-समय पर अपनी प्राइवेसी पॉलिसी अपडेट कर सकते हैं। हर बार जब नीति बदलती है, हम अंतिम संशोधन तिथि अपडेट करेंगे। यदि कोई महत्वपूर्ण बदलाव होगा, तो हम आपको प्लेटफ़ॉर्म पोस्टिंग या ईमेल के द्वारा सूचित करेंगे। लागू कानूनों के अनुसार, ऐसे नोटिस के बाद प्लेटफ़ॉर्म का उपयोग जारी रखने को इन अपडेट्स के प्रति आपकी सहमति माना जाएगा।
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              संपर्क एवं शिकायत निवारण अधिकारी
            </h2>
            <p className="text-base leading-7 text-gray-700 mb-4">
              सूचना प्रौद्योगिकी अधिनियम, 2000 एवं लागू नियमों के अनुरूप शिकायत निवारण अधिकारी का नाम और संपर्क विवरण निम्नलिखित है:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-base leading-7 text-gray-700 mb-2">
                <span className="font-semibold">शिकायत निवारण अधिकारी:</span> दीप्ति अरोरा
              </p>
              <p className="text-base leading-7 text-gray-700 mb-2">
                <span className="font-semibold">ईमेल:</span>{' '}
                <a href="mailto:grievance.charchagram@gmail.com" className="text-blue-600 hover:underline">
                  grievance.charchagram@gmail.com
                </a>
              </p>
              <p className="text-base leading-7 text-gray-700">
                <span className="font-semibold">पता:</span> फ़्लैट नं- 304, पॉकेट 8, सेक्टर 12, द्वारका, N.S.I.T. द्वारका, नई दिल्ली, दक्षिण पश्चिम दिल्ली – 110078, दिल्ली
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              हमसे संपर्क करें
            </h2>
            <p className="text-base leading-7 text-gray-700">
              हमारी प्राइवेसी प्रथाओं के बारे में अधिक जानकारी के लिए, कृपया हमसे इस ईमेल पर संपर्क करें:{' '}
              <a href="mailto:grievance.charchagram@gmail.com" className="text-blue-600 hover:underline">
                grievance.charchagram@gmail.com
              </a>
            </p>
          </section>
      </main>
    </div>
  );
}