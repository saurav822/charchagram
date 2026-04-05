"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Phone, User, MapPin, Calendar, Pencil } from "lucide-react";
import Footer from "@/components/Footer";
import type { User as UserType } from "@/interface/User";
import { trackPageView } from "@/utils/analytics";
import EditUserProfile from "@/components/EditUserProfile";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isEditingUserProfile, setIsEditingUserProfile] = useState(false);

  useEffect(() => {
    trackPageView('Profile Page', '/profile');
  }, []);

  const handleUpdateUser = async (updatedUser: UserType) => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/users/${user?._id}`, {userData: updatedUser});
      
      localStorage.setItem("user", JSON.stringify(response.data.user));      
      localStorage.setItem("constituency", JSON.stringify({area_name: response.data.user.constituency.area_name, _id: response.data.user.constituency._id}));
      setUser(response.data.user);
    } catch {
      alert("व्यक्तिगत जानकारी संपादित करने में विफल");
    }
    finally {
      setIsEditingUserProfile(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.replace("/login");
      return;
    }
    setLoading(true);
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}`);
        let data = response.data;
        setUser(data.user);
      } catch {
        // Failed to load user — will show loading spinner then redirect.
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (isEditingUserProfile) {
    return <EditUserProfile userprop={user as UserType} onUpdateUser={handleUpdateUser} onBackClick={() => setIsEditingUserProfile(false)} />;
  }

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#273F4F] mx-auto mb-4"></div>
          <p className="text-gray-600">लोड हो रहा है...</p>
        </div>
      </div>
    )
  }

  const logout = async () => {
    try {
      localStorage.clear();
      await axios.post("/api/auth/logout");
    } catch {
      // Non-fatal: local storage is already cleared; redirect regardless.
    } finally {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Section with Back Button */}
      <header className="bg-[#1E3A4C] px-4 py-4 text-white">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-full"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="ml-4 text-xl font-medium">नागरिक प्रोफ़ाइल</h1>
        </div>
      </header>
      {/* Profile Section */}
      <div className="w-full bg-[#1E3A4C] text-white flex flex-col items-center py-6">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl text-gray-600">
          <User size={40} />
        </div>
        <p className="mt-3 font-semibold tracking-widest">
          {user?.name || "उपलब्ध नहीं"}
        </p>
      </div>

      {/* व्यक्तिगत जानकारी */}
      <div className="w-full bg-[#C1CAD1] flex relative justify-center py-6 p-4">
        <div className="absolute top-10 right-10">
          <button className="text-gray-600" onClick={()=>setIsEditingUserProfile(true)}>
            <Pencil size={20} />
          </button>
        </div>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">व्यक्तिगत जानकारी</h2>
          <div className="space-y-4">
            {/* Phone */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="text-gray-600" size={20} />
                <span>{user?.phoneNumber || "उपलब्ध नहीं"}</span>
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="text-gray-600" size={20} />
                <span>
                  {user?.gender === "male"
                    ? "पुरुष"
                    : user?.gender === "female"
                      ? "महिला"
                      : user?.gender === "other"
                        ? "अन्य"
                        : user?.gender === "prefer_not_to_say"
                          ? "प्रियवाद नहीं"
                        : "उपलब्ध नहीं"}
                </span>
              </div>
              {/* <Pencil size={18} className="text-gray-500 cursor-pointer" /> */}
            </div>

            {/* Location */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-600" size={20} />
                <span>{user?.constituency?.area_name || "उपलब्ध नहीं"}</span>
              </div>
              {/* <Pencil size={18} className="text-gray-500 cursor-pointer" /> */}
            </div>

            {/* Age */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-600" size={20} />
                <span>{user?.ageBracket || "उपलब्ध नहीं"} वर्ष</span>
              </div>
              {/* <Pencil size={18} className="text-gray-500 cursor-pointer" /> */}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-[#C1CAD1] flex justify-center py-6 p-4">
        <button
          onClick={() => logout()}
          className="flex pl-[4px] items-center space-x-4 text-lg text-gray-700 hover:text-[#DC3C22] transition-colors py-2"
        >
          <div className="flex items-center justify-center w-4 h-4 p-[2px]">
            <img
              src="logouticon1.svg"
              alt="logouticon1"
              className="w-4 h-4"
            />
            <img
              src="logouticon2.svg"
              alt="logouticon1"
              className="w-4 h-4 p-[2px] "
            />
          </div>

          <span className="font-medium">लॉग आउट</span>
        </button>
      </div>

      <Footer />
    </div>
  );
}
function redirect(url: string) {
  if (typeof window !== "undefined") {
    window.location.href = url;
  }
}
