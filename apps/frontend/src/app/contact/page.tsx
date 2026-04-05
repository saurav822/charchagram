'use client'
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { trackPageView, trackFormSubmission, trackButtonClick } from "@/utils/analytics";
import axios from "axios";
export default function ContactPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        senderEmail: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    useEffect(() => {
        trackPageView('Contact Page', '/contact');
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        trackFormSubmission('contact_form', true);
        // Handle form submission logic here
        // Reset form
        try {
            await axios.post('/api/email/send', formData);
            setSuccess(true);
        }
        catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Email sending failed';
            alert(message);
            setSuccess(false);
        }
        finally {
            setFormData({ name: '', senderEmail: '', message: '' });
            setFormSubmitted(true);
            setLoading(false);
        }
    };

    const showSuccess = () => {
        return (
            <div className="flex flex-col w-full items-center justify-between rounded-lg p-4 py-18 h-[300px]">
                <div className="flex flex-col w-full items-center justify-center gap-4 ">
                    <div className="w-8 h-8 bg-white rounded-full mx-auto flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="green" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    </div>
                    <h2 className="text-gray-600">आपका संदेश सफलतापूर्वक भेजा गया है</h2>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="bg-[#273F4F] text-white px-6 py-2 rounded-lg hover:bg-[#1e2f3a] transition-colors "
                >
                    होम पेज पर जाएं
                </button>
            </div>
        )
    }
    const showFailure = () => {
        return (
            <div className="flex flex-col w-full items-center justify-center gap-4 h-[300px] rounded-lg p-4">
                <div className="w-8 h-8 bg-white rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="red" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                    </svg>
                </div>
                <h2 className="text-gray-600 mb-4">आपका संदेश भेजने में विफल हुआ है</h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => { setFormSubmitted(false); setFormData({ name: '', senderEmail: '', message: '' }); }}
                        className="bg-[#273F4F] text-white px-6 py-2 rounded-lg hover:bg-[#1e2f3a] transition-colors "
                    >
                        फिर से प्रयास करें
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="text-blue px-6 py-2 rounded-lg hover:bg-[#1e2f3a] transition-colors border border-black "
                    >
                        होम पेज पर जाएं
                    </button>
                </div>

            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header Section with Back Button */}
            <header className="bg-[#273F4F] px-4 py-4 text-white">
                <div className="flex items-center">
                    <button
                        onClick={() => {
                            trackButtonClick('back_button', 'contact_page');
                            router.back();
                        }}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="ml-4 text-xl font-medium">संपर्क करें</h1>
                </div>
            </header>

            {/* Main Content */}
            <div className="w-full mx-auto px-10 py-8">
                {/* Contact Information Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">हमसे जुड़ें</h2>

                    <div className="grid gap-6 md:grid-cols-2 mb-8">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">कार्यालय पता</h3>
                            <p className="text-gray-600">
                                चर्चा फाउंडेशन<br />
                                136बी, सनसिटी फ़्लोर्स, रोहतक <br />
                                हरियाणा - 124001
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">संपर्क माध्यम</h3>
                            <p className="text-gray-600">
                                ईमेल: connect@charchagram.com<br />
                                फोन: +91 8287509616<br />
                                समय: सुबह 11 बजे - शाम 6 बजे
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Form Section */}
                {loading ? <div className="flex flex items-center justify-center p-6 w-full h-[300px] rounded-lg">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#273F4F] mx-auto mb-4 border border-gray-300"></div>
                </div> :
                    <section className="bg-gray-50 p-6 rounded-lg ">
                        {!formSubmitted && <h2 className="text-2xl font-bold text-gray-800 mb-6">संदेश भेजें</h2>}
                        {!formSubmitted ? <form onSubmit={handleSubmit} className={`space-y-6 ${loading ? 'blur-sm' : ''}`}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    आपका नाम
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-[#273F4F] focus:border-[#273F4F]"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    ईमेल पता
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.senderEmail}
                                    onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-[#273F4F] focus:border-[#273F4F]"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    आपका संदेश
                                </label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-[#273F4F] focus:border-[#273F4F]"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#273F4F] text-white py-3 px-6 rounded-md font-medium hover:bg-[#1e2f3a] transition-colors"
                            >
                                संदेश भेजें
                            </button>
                        </form> : success ? showSuccess() : showFailure()}
                    </section>
                }

                {/* Social Media Section */}
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">सोशल मीडिया</h2>
                    <div className="flex gap-4">
                        <a href="https://www.facebook.com/charchagram/" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>
                        <a href="https://x.com/Charchagram_" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.53 3H21.5L14.36 10.68L22.75 21H16.44L11.38 14.62L5.72 21H1.75L9.27 12.82L1.25 3H7.73L12.36 9.01L17.53 3ZM16.46 19.13H18.19L7.59 4.76H5.74L16.46 19.13Z" />
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/__charchagram__/" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                            </svg>
                        </a>
                        <a href="https://www.youtube.co/@CharchagramCollective" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </a>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}
