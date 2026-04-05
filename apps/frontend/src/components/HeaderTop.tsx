"use client";
import { useEffect, useState } from "react";
import HamburgerMenu from "./HamburgerMenu";
import { useRouter } from "next/navigation";
import HamburgerProfileMenu from "./HamburgerProfileMenu";

export default function HeaderTop() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();
  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);
  return (
    <header className="bg-white px-4 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded flex items-center justify-center cursor-pointer" onClick={() => router.push("/")}>
          <img src="/mainlogonew.png" alt="Header Icon" className="w-7 h-7" />
        </div>
        <div className="flex-1 items-center w-[40px]">
          <img
            src="/charchaTitle.png"
            alt="CharchaGram Logo"
            className="w-[full] h-[40px] mx-auto"
          />
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            {userId ? (
              <div className="w-5 h-5 bg-[#273F4F] p-[2px] rounded-full flex items-center justify-center">

                <img
                  onClick={() => router.push("/profile")}
                  src="/twouser.svg"
                  alt="profile icon"
                  className="w-5 h-5"
                />
                <HamburgerProfileMenu
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                />
              </div>
            ) : (
              <img
                src="/usericon.svg"
                onClick={() => router.push("/login")}
                alt="User Profile"
                className="w-5 h-5"
              />
            )}
          </div>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-8 h-8 bg-white rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
          <HamburgerMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}
