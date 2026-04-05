'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import { trackPageView, trackButtonClick } from "@/utils/analytics";

export default function AboutPage() {
    const router = useRouter();

    useEffect(() => {
        trackPageView('About Page', '/about');
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header Section with Back Button */}
            <header className="bg-[#273F4F] px-4 py-4 text-white">
                <div className="flex items-center">
                    <button 
                        onClick={() => {
                            trackButtonClick('back_button', 'about_page');
                            router.back();
                        }}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="ml-4 text-xl font-medium">हमारी कहानी</h1>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Mission Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">हमारा मिशन</h2>
                    <p className="text-gray-600 leading-relaxed">
                        चर्चाग्राम का मिशन है लोकतंत्र को और अधिक पारदर्शी और जवाबदेह बनाना। हम नागरिकों और उनके प्रतिनिधियों के बीच एक सेतु का काम करते हैं, जहां हर आवाज सुनी जाती है और हर विचार मायने रखता है।
                    </p>
                </section>

                {/* Vision Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">हमारी दृष्टि</h2>
                    <p className="text-gray-600 leading-relaxed">
                        हम एक ऐसे भारत की कल्पना करते हैं जहां हर नागरिक सूचित, सक्रिय और सशक्त हो। जहां लोकतांत्रिक प्रक्रियाएं सिर्फ चुनावों तक सीमित न हों, बल्कि रोजमर्रा की जीवंत चर्चाओं का हिस्सा बनें।
                    </p>
                </section>

                {/* Core Values Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">हमारे मूल्य</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">पारदर्शिता</h3>
                            <p className="text-gray-600">सटीक और विश्वसनीय जानकारी प्रदान करने के लिए प्रतिबद्ध</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">निष्पक्षता</h3>
                            <p className="text-gray-600">सभी विचारों और दृष्टिकोणों का सम्मान</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">सहभागिता</h3>
                            <p className="text-gray-600">सामूहिक विचार-विमर्श को प्रोत्साहित करना</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">जवाबदेही</h3>
                            <p className="text-gray-600">लोकतांत्रिक प्रक्रियाओं में पारदर्शिता को बढ़ावा देना</p>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">हमारी टीम</h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        हमारी टीम युवा और उत्साही पेशेवरों की एक समर्पित टीम है जो भारत के लोकतांत्रिक मूल्यों को मजबूत करने के लिए प्रतिबद्ध है। हम तकनीक और पारंपरिक मूल्यों के बीच एक संतुलन बनाते हैं।
                    </p>
                </section>
            </div>
            <Footer />
        </div>
    );
}
