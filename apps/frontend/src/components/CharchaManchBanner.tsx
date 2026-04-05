import { useRouter } from 'next/navigation'
export default function CharchaManchBanner({ showBackButton = false, backpageUrl = '/', onBackClick, blog = false }: { showBackButton?: boolean, backpageUrl?: string, onBackClick?: () => void, blog?: boolean }) {
    const router = useRouter()
    return (
        <div className={`bg-[#273F4F] rounded-lg shadow-sm text-center mb-2.5 relative overflow-hidden ${blog ? 'py-4' : ''}`}>
            {/* Left side image */}
            {showBackButton && <button
                onClick={() => {
                    if (backpageUrl.length > 0) {
                        onBackClick?.();
                        router.push(backpageUrl);

                    } else {
                        onBackClick?.();
                        router.back();
                    }
                }}
                className="p-2 bg-white/10 rounded-full transition-colors z-20 absolute top-5 left-5"
            >
                <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>}
            <img
                src="/flyer-charcha-mach-your-area/charcha-manch-flyer-left.PNG"
                alt="Charcha Manch Left Flyer"
                className="absolute -left-5 -top-12 h-[180%] w-auto object-contain opacity-100"
            />

            {/* Right side image */}
            <img
                src="/flyer-charcha-mach-your-area/charcha-manch-flyer-right.PNG"
                alt="Charcha Manch Right Flyer"
                className="absolute -right-5 -top-12 h-[180%] w-auto object-contain opacity-100"
            />

            {/* Content - with higher z-index to appear above images */}
            <div className={`relative z-10 ${blog ? 'mb-4' : ''}`}>
                <p
                    className="text-4xl tracking-[0%] text-center flex w-fit mx-auto items-center justify-center gap-2 text-[#ffffff] pt-8"
                    style={{
                        fontFamily: 'Noto Sans Devanagari, sans-serif',
                        fontWeight: 800,
                        lineHeight: '1.42',
                    }}
                >
                    <span>{blog ? 'नागरिक' : 'चर्चा'}</span><span
                        className="text-[#DC3C22] inline-flex"
                        style={{
                            fontFamily: 'Noto Sans Devanagari, sans-serif',
                            fontWeight: 800,
                        }}
                    >{blog ? 'नज़रिया' : 'मंच'}</span>
                </p>
                {!blog && <p
                    className="pt-0 text-base mb-6"
                    style={{
                        fontFamily: 'Noto Sans Devanagari, sans-serif',
                        fontWeight: 600,
                        lineHeight: '1.425', // 22.75px/14px = 1.425
                        letterSpacing: '0%',
                        verticalAlign: 'middle',
                        color: '#a4abb6ff'
                    }}
                >संवाद और सामुदायिक सहयोग का मंच</p>
                }
            </div>
        </div>
    )
}