"use client";
import { useEffect, useState } from "react";
import axios from "axios";
interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerProfileMenu = ({ isOpen, onClose }: HamburgerMenuProps) => {
  // Handle click outside to close the menu
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById("hamburger-profile-menu");
      if (menu && !menu.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);
  if (!isOpen) return null;

  const logout = async () => {
    try {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userId");
      await axios.post("/api/auth/logout");
    } catch {
      // Non-fatal: local token is already cleared; redirect regardless.
    } finally {
      window.location.href = "/";
    }
  };

  return (
    <div className="fixed top-0 right-0 h-screen w-screen z-50 pointer-events-none">
      <div
        id="hamburger-profile-menu"
        className="absolute top-0 right-0 w-1/2 max-w-[450px] h-1/2 bg-white shadow-lg rounded-bl-lg py-6 px-8 pointer-events-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Menu Items */}
        <nav className="mt-8">
          <ul className="space-y-6">
            {userId && (
              <li>
                <a
                  href="/profile"
                  className="flex items-center space-x-4 text-lg text-gray-700 hover:text-[#DC3C22] transition-colors py-2"
                >
                  <img
                    src="/hamberger/about-us.svg"
                    alt="About icon"
                    className="w-6 h-6"
                  />
                  <span className="font-medium">नागरिक प्रोफ़ाइल</span>
                </a>
              </li>
            )}
            {userId && (
              <li>
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
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default HamburgerProfileMenu;
