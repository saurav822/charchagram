'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LoadingSpinner } from '@/components/Loadingspinner';
import NewModalLogin from '@/components/newModalLogin';
import { trackPageView, trackFormSubmission } from '@/utils/analytics';
import { getUserData } from '@/utils/userData';
import { UserDataResponseType } from '@/types/user';
// Add type declarations for MSG91 functions
declare global {
    interface Window {
        initSendOTP?: (config: any) => void;
        sendOtp?: (phoneNumber: string, success: (data: any) => void, error: (error: any) => void) => void;
        verifyOtp?: (otp: string, success: (data: any) => void, error: (error: any) => void) => void;
        retryOtp?: (param: any, success: (data: any) => void, error: (error: any) => void) => void;
    }
}

const encryptMobileNumber = (mobileNumber: string): string => {
    // Simple base64 encoding with a salt
    const salt = 'charchamanch2024';
    const combined = salt + mobileNumber;
    return btoa(combined);
};
const LoginPage = () => {
    const router = useRouter();
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');

    useEffect(() => {
        trackPageView('Login Page', '/login');
    }, []);
    // useEffect(() => {
    //     window.location.reload()
    // }, []);
    const [accessToken, setAccessToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState('');
    const [reqId, setReqId] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showLoginSuccessBlurEffect, setShowLoginSuccessBlurEffect] = useState(false);
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const scriptRef = useRef<HTMLScriptElement | null>(null);
    const [hideRetryButton, setHideRetryButton] = useState(false);
    // Add this state for individual OTP digits
    const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
    const [isWidgetInitialized, setIsWidgetInitialized] = useState(false);

    // Add these state variables
    const [timeLeft, setTimeLeft] = useState(90); // 90 seconds = 1 min 30 sec
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Add this function to handle OTP digit changes
    const handleOtpDigitChange = (index: number, value: string) => {
        if (value.length > 1) return; // Only allow single digit

        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = value;
        setOtpDigits(newOtpDigits);

        // Auto-focus to next input if current input has a value
        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }

        // Update the combined OTP value
        const combinedOtp = newOtpDigits.join('');
        setOtp(combinedOtp);
    };

    // Add this function to handle backspace
    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            // Move to previous input on backspace if current input is empty
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    // Update the useEffect for script loading
    useEffect(() => {
        // Check if widget is already initialized
        if (isWidgetInitialized) {
            return;
        }

        // Check if script is already loaded
        const existingScript = document.querySelector('script[src="https://verify.msg91.com/otp-provider.js"]');
        if (existingScript && window.initSendOTP) {
            console.log('script already loaded, initializing widget');
            setIsScriptLoaded(true);
            initWidget();
            return;
        }

        // Only load script if it doesn't exist
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://verify.msg91.com/otp-provider.js';
            script.async = true;
            script.onload = () => {
                console.log('script loaded, initializing widget');
                setIsScriptLoaded(true);
                initWidget();
            };
            script.onerror = () => {
                setError('Failed to load OTP service');
            };

            scriptRef.current = script;
            document.head.appendChild(script);
        }

        return () => {
            // Don't remove script on unmount to prevent re-loading
            // The script can be reused across component mounts
        };
    }, [isWidgetInitialized]); // Add isWidgetInitialized as dependency

    // Add this useEffect before your existing MSG91 initialization
    useEffect(() => {
        // Suppress h-captcha registration errors
        if (typeof window !== 'undefined') {
            const originalDefine = window.customElements.define;
            window.customElements.define = function (name, constructor, options) {
                try {
                    if (name === 'h-captcha' && window.customElements.get(name)) {
                        return; // Skip if already defined
                    }
                    return originalDefine.call(this, name, constructor, options);
                } catch (error) {
                    // Suppress the error silently
                    console.warn(`Suppressed custom element registration error for: ${name}`);
                }
            };
        }
    }, []);

    // Add this function to suppress hCaptcha errors
    useEffect(() => {
        // Suppress hCaptcha errors in development
        if (typeof window !== 'undefined') {
            const originalError = console.error;
            console.error = (...args) => {
                if (args[0] && typeof args[0] === 'string' && args[0].includes('hCaptcha')) {
                    return; // Suppress hCaptcha warnings
                }
                if (args[0] && typeof args[0] === 'object' && args[0].message === 'No hCaptcha exists.') {
                    return; // Suppress hCaptcha errors
                }
                if (args[0] && typeof args[0] === 'string' && args[0].includes('localhost detected')) {
                    return; // Suppress localhost warnings
                }
                originalError.apply(console, args);
            };
        }
    }, []);

    // Update the initWidget function
    const initWidget = () => {
        // Prevent multiple initializations
        if (isWidgetInitialized) {
            console.log('Widget already initialized, skipping...');
            return;
        }

        const configuration = {
            widgetId: "35684467544f353037303838",
            tokenAuth: "466248TowdX1OQ68b2acc5P1",
            exposeMethods: true,
            success: (data: any) => {
                console.log("OTP verification successful:", data);
            },
            failure: (error: any) => {
                console.log("OTP verification failed:", error);
            },
        };

        try {
            if (typeof window.initSendOTP === "function") {
                console.log('Initializing MSG91 widget...');
                window.initSendOTP(configuration);
                setIsWidgetInitialized(true); // Mark as initialized
            } else {
                console.log('initSendOTP function not available yet');
            }
        } catch (error) {
            console.error('Error initializing MSG91 widget:', error);
            setError('Failed to initialize OTP service');
        }
    };

    // Add this useEffect for timer
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isTimerRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        setIsTimerRunning(false);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isTimerRunning, timeLeft]);

    // Add this function to start timer
    const startTimer = () => {
        setTimeLeft(90);
        setIsTimerRunning(true);
    };

    // Add this function to format time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Function 1: Send OTP
    const sendOTP = async () => {
        try {
            setLoading(true);
            // Add +91 prefix to the mobile number
            const fullPhoneNumber = `+91${mobileNumber}`;

            return new Promise((resolve, reject) => {
                (window as any)?.sendOtp(
                    fullPhoneNumber,
                    (data: any) => {
                        setReqId(data.message);
                        startTimer(); // Start timer when OTP is sent
                        setHideRetryButton(false);
                        setShowOTPInput(true);
                        resolve(data);
                    },
                    (error: any) => {
                        console.log("Error sending OTP:", error);
                        reject(new Error("Error sending OTP: " + error.message));
                    }
                );
            });
        } catch (error) {
            throw error;
        }
    }

    // Function 2: Retry OTP
    const retryOTP = async () => {
        try {
            setLoading(true);
            return new Promise((resolve, reject) => {
                (window as any).retryOtp(
                    '11',
                    (data: any) => {
                        console.log("OTP resent successfully:", data);
                        setSuccess("OTP resent successfully!");
                        startTimer(); // Restart timer
                        resolve(data);
                    },
                    (error: any) => {
                        console.log("Error resending OTP:", error);
                        reject(new Error("Error resending OTP: " + error.message));
                    },
                    reqId
                );
            });
        } catch (error) {
            throw error;
        }
    }

    const handleLogin = async () => {
        try {
            const response = await axios.post('/login', {
                phoneNumber: mobileNumber.trim(),
            });

            if (response.data.token) {
                localStorage.setItem('jwtToken', response.data.token);
                localStorage.setItem('userId', response.data.user._id);
            }
            const userData: UserDataResponseType['user'] = await getUserData(response.data.user._id);
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('constituency', JSON.stringify(userData?.constituency));
            setShowLoginSuccessBlurEffect(true);
            setTimeout(() => {
                setShowLoginSuccessBlurEffect(false);
                router.push('/');
            }, 2000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'लॉगिन में त्रुटि हुई';
            setShowAuthModal(true)
            throw new Error(errorMessage);
        }
        finally {
            var isCaptchaVerified = (window as any).isCaptchaVerified();
            console.log('isCaptchaVerified', isCaptchaVerified);
        }
    }

    const verifyOTP = () => {
        (window as any).verifyOtp(
            otp,
            (data: any) => {
                console.log("OTP verified:", data);
                console.log('accessToken', data.message);
                verifyWithBackend(data.message);
            },
            (error: any) => {
                console.log("OTP verification error:", error);
            },
            reqId
        );
    }

    //test
    // Backend verification after successful OTP verification
    const verifyWithBackend = async (token?: string) => {
        const tokenToUse = token;

        const response = await axios.post('/api/verify-otp', {
            accessToken: tokenToUse,
        });

        const result = response.data;
        console.log('Backend verification result:', result);

        if (result.success) {
            setSuccess("OTP verified successfully on backend!");
            // Additional logic for user data storage can be added here
        } else {
            throw new Error("OTP verification failed: " + result.message);
        }
    };

    const handleVerifyOTPAndThenTryLogin = async () => {
        try {
            // First verify OTP
            verifyOTP();

            // Then try login
            handleLogin();

        } catch (error) {
            throw error; // Re-throw to be handled by the caller
        }
    }
    // const submitOTP = (otp: string) => {
    //     if (!otp) {
    //         setError("Please enter OTP");
    //         return;
    //     }

    //     setLoading(true);
    //     setError('');
    //     setSuccess('');

    //     if (window.verifyOtp) {
    //         window.verifyOtp(
    //             otp,
    //             (data) => {
    //                 console.log("OTP verified:", data);
    //                 setSuccess("OTP verification in progress...");
    //             },
    //             (error) => {
    //                 console.log("OTP verification error:", error);
    //                 setError("OTP verification failed: " + error.message);
    //                 setLoading(false);
    //             }
    //         );
    //     } else {
    //         setError("OTP service not available");
    //         setLoading(false);
    //     }
    // };

    const mobileRegex = /^[6-9]\d{9}$/
    const validateMobileNumber = (mobile: string): boolean => {
        if (!mobile) {
            setError('मोबाइल नंबर आवश्यक है')
            return false
        }

        if (!mobileRegex.test(mobile)) {
            setError('कृपया एक वैध भारतीय मोबाइल नंबर दर्ज करें (10 अंक, 6-9 से शुरू)')
            return false
        }

        setError(null)
        return true
    }
    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess('');

            if (!showOTPInput) {
                // Validate mobile number first
                if (!validateMobileNumber(mobileNumber)) {
                    setLoading(false);
                    return;
                }

                // Send OTP
                trackFormSubmission('login_form', true);
                await sendOTP();
                // setShowOTPInput(true);
                setHideRetryButton(true);
            } else {
                // Verify OTP and then login
                await handleVerifyOTPAndThenTryLogin();
            }
        } catch (error: any) {
            setError(error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }

    const handleClose = () => {
        router.push('/')
    }

    // Add this function to handle retry
    const handleRetry = async () => {
        try {
            setOtpDigits(['', '', '', '']);
            setHideRetryButton(true);
            setOtp('');
            setError(null);
            await retryOTP();
            setSuccess("OTP resent successfully!");
        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    };

    // Add this function to check if OTP is complete
    const isOtpComplete = () => {
        return otpDigits.every(digit => digit !== '');
    };

    const handleRegisterClick = () => {
        const encryptedMobile = encryptMobileNumber(mobileNumber);
        router.push(`/login/register?user=${encodeURIComponent(encryptedMobile)}`);
    }

    return (
        <div className="min-h-screen relative bg-[#F6F6F6] flex justify-center px-2 z-10">
            <div className={`bg-[#F6F6F6] rounded-lg w-full p-4  ${showAuthModal || showLoginSuccessBlurEffect ? 'blur-sm' : ''}`}>
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* User icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#273F4F] rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                </div>

                {/* Main title */}
                <h1 className="text-2xl font-bold text-[#273F4F] text-center mb-2">
                    आपका चुनावी साथी
                </h1>

                {/* Subtitle */}
                <p className="text-gray-600 text-center mb-8">
                    लोकतंत्र में भागीदारी का नया तरीका
                </p>

                {/* Form Container */}
                <div className="space-y-6">
                    {/* Mobile Number */}
                    <div className='flex flex-col gap-10'>
                        <div>
                            <label className="flex items-center gap-2 w-full justify-center text-sm font-medium text-gray-700 mb-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                </svg>
                                मोबाइल नंबर
                            </label>
                            <div className='flex items-center w-full justify-center gap-2'>
                                <input
                                    type="text"
                                    value="+91"
                                    disabled
                                    className='w-12 px-2 py-2 bg-white border border-gray-300 rounded-lg text-black'
                                    readOnly
                                />
                                <input
                                    type="number"
                                    value={mobileNumber}
                                    onChange={(e) => { setMobileNumber(e.target.value); }}
                                    placeholder="10 अंकों का मोबाइल नंबर"
                                    className="w-3/5 px-2 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#273F4F] focus:border-transparent"
                                    maxLength={10}
                                />
                            </div>
                        </div>
                        {showOTPInput &&

                            <div className=''>
                                <label className="font-medium flex w-full text-center justify-center rounded-lg p-2 text-gray-700 mb-2">
                                    कृपया ओटीपी दर्ज करें
                                </label>
                                <div className="flex gap-2 justify-center">
                                    {[0, 1, 2, 3].map((index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            value={otpDigits[index]}
                                            onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            placeholder=""
                                            className="w-12 h-12 text-center text-lg font-semibold bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#273F4F] focus:border-transparent"
                                            maxLength={1}
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                        />
                                    ))}
                                </div>

                                {/* Timer and Retry Section */}
                                <div className="mt-4 text-center">
                                    {isTimerRunning && timeLeft > 0 ? (
                                        <div className="text-sm text-gray-600">
                                            {formatTime(timeLeft)}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleRetry}
                                            hidden={!hideRetryButton}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            पुनः भेजें OTP
                                        </button>
                                    )}
                                </div>
                            </div>
                        }
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Login button */}
                    <div className='w-full'>
                        <button
                            type="button"
                            disabled={loading || (showOTPInput && !isOtpComplete())}
                            className="w-4/5 mx-auto bg-[#273F4F]  text-white py-3 px-6 rounded-lg font-medium hover:bg-[#1e2f3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            onClick={handleSubmit}
                        >
                            {loading ? <LoadingSpinner /> : <></>}
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                            </svg>
                            लॉगिन करें
                        </button>

                    </div>

                </div>
            </div>
            {<NewModalLogin
                isOpen={showLoginSuccessBlurEffect}
                message='आपका लॉगिन सफल हुआ'
                onClose={() => setShowLoginSuccessBlurEffect(false)}
                showButtons={false}
                successModal={true}

            />}
            <NewModalLogin
                isOpen={showAuthModal}
                message={error as string}
                onClose={() => setShowAuthModal(false)}
                primaryButtonText='पंजीकरण करें'
                primaryButtonLink='/login/register'
                primaryButtonOnClick={handleRegisterClick}
            />
        </div>
    );
};

export default LoginPage;
