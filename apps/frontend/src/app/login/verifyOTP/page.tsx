'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackPageView, trackFormSubmission } from '@/utils/analytics';

// Add type declarations for MSG91 functions
declare global {
  interface Window {
    initSendOTP?: (config: any) => void;
    sendOtp?: (phoneNumber: string, success: (data: any) => void, error: (error: any) => void) => void;
    verifyOtp?: (otp: string, success: (data: any) => void, error: (error: any) => void) => void;
    retryOtp?: (param: any, success: (data: any) => void, error: (error: any) => void) => void;
  }
}

const OTPVerification = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    trackPageView('OTP Verification Page', '/login/verifyOTP');
  }, []);

  useEffect(() => {
    // Get phone number from localStorage
    // const storedPhoneNumber = localStorage.getItem('phoneNumber');
    // if (!storedPhoneNumber) {
    //   router.push('/login');
    //   return;
    // }
    // setPhoneNumber(storedPhoneNumber);

    // Load MSG91 script
    const script = document.createElement('script');
    script.src = 'https://verify.msg91.com/otp-provider.js';
    script.onload = initWidget;
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://verify.msg91.com/otp-provider.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [router]);

  const initWidget = () => {
    const configuration = {
      widgetId: "35684467544f353037303838",
      tokenAuth: "466248TowdX1OQ68b2acc5P1",
      exposeMethods: true,
      success: (data: any) => {
        setAccessToken(data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);
        setSuccess("OTP verified successfully!");
        setError('');
        
        // Automatically verify with backend after successful OTP verification
        verifyWithBackend(data.accessToken);
      },
      failure: (error: any) => {
        setError("OTP verification failed: " + error.message);
        setSuccess('');
      },
    };

    if (typeof window.initSendOTP === "function") {
      window.initSendOTP(configuration);
    }
  };

  // Function 1: Send OTP
  const sendOTP = () => {
    if (!phoneNumber) {
      setError("Please enter a phone number");
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    if (window.sendOtp) {
      window.sendOtp(
        phoneNumber,
        (data) => {
          setSuccess("OTP sent successfully!");
          setLoading(false);
        },
        (error) => {
          setError("Error sending OTP: " + error.message);
          setLoading(false);
        }
      );
    } else {
      setError("OTP service not available");
      setLoading(false);
    }
  };

  // Function 2: Retry OTP
  const retryOTP = () => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (window.retryOtp) {
      window.retryOtp(
        null,
        (data) => {
          setSuccess("OTP resent successfully!");
          setLoading(false);
        },
        (error) => {
          setError("Error resending OTP: " + error.message);
          setLoading(false);
        }
      );
    } else {
      setError("OTP service not available");
      setLoading(false);
    }
  };

  // Function 3: Submit/Verify OTP
  const submitOTP = () => {
    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    trackFormSubmission('otp_verification', true);
    setLoading(true);
    setError('');
    setSuccess('');

    if (window.verifyOtp) {
      window.verifyOtp(
        otp,
        (data) => {
          setSuccess("OTP verification in progress...");
        },
        (error) => {
          setError("OTP verification failed: " + error.message);
          setLoading(false);
        }
      );
    } else {
      setError("OTP service not available");
      setLoading(false);
    }
  };

  // Backend verification after successful OTP verification
  const verifyWithBackend = async (token?: string) => {
    const tokenToUse = token || accessToken;
    if (!tokenToUse) {
      setError("No access token available. Please verify OTP first.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: tokenToUse,
          phoneNumber: phoneNumber
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Store user data if available
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));        
        }
        if (result.token) {
          localStorage.setItem('jwtToken', result.token);
        }
        
        // Clear phone number from localStorage
        localStorage.removeItem('phoneNumber');
        
        setSuccess("OTP verified successfully on backend!");
        
        // Redirect based on whether user exists or needs to register
        setTimeout(() => {
          if (result.userExists) {
            router.push('/'); // Go to homepage
          } else {
            router.push('/login/register'); // Go to registration page
          }
        }, 2000);
      } else {
        setError("Backend verification failed: " + result.message);
      }
    } catch (error) {
      console.error('Backend verification error:', error);
      setError("Error verifying with backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">OTP Verification</h2>
          <p className="text-gray-600">Enter the OTP sent to your phone</p>
        </div>

        {/* Phone Number Display */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Phone Number:</p>
          {/* <p className="font-semibold text-gray-900">{phoneNumber}</p> */}
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            // maxLength={10}
          />
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={6}
          />
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Submit OTP Button */}
          <button
            onClick={submitOTP}
            disabled={loading || !otp}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Submit OTP'}
          </button>

          {/* Retry OTP Button */}
          <button
            onClick={retryOTP}
            disabled={loading}
            className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Retry OTP'}
          </button>

          {/* Send New OTP Button */}
          <button
            onClick={sendOTP}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send New OTP'}
          </button>
        </div>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
