import React from "react";
import { Phone, User, MapPin, Calendar } from "lucide-react";

export default function CitizenProfile() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Header */}
      <div className="w-full bg-[#1E3A4C] text-white py-4 px-6 flex items-center">
        <button className="mr-4 text-lg">←</button>
        <h1 className="text-lg font-semibold">नागरिक प्रोफ़ाइल</h1>
      </div>

      {/* Profile Section */}
      <div className="w-full max-w-md bg-[#1E3A4C] text-white flex flex-col items-center py-6">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl text-gray-600">
          <User size={40} />
        </div>
        <p className="mt-3 font-semibold tracking-widest">XXXXXX</p>
      </div>

      {/* नागरिकता स्तर */}
      <div className="w-full max-w-md bg-white shadow-md mt-4 rounded-lg p-4">
        <h2 className="text-center text-lg font-semibold mb-3">नागरिकता स्तर</h2>
        <div className="flex justify-between">
          {[
            { label: "नागरिक", active: false },
            { label: "मतदाता", active: true },
            { label: "जागरूक", active: false },
            { label: "प्रेरक", active: false },
            { label: "समर्पित", active: false },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`w-14 h-14 rounded-lg flex items-center justify-center font-bold ${
                item.active
                  ? "bg-[#1E3A4C] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {item.label[0]}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>नागरिक</span>
          <span>मतदाता</span>
          <span>जागरूक</span>
          <span>प्रेरक</span>
          <span>समर्पित</span>
        </div>
      </div>

      {/* व्यक्तिगत जानकारी */}
      <div className="w-full max-w-md bg-white shadow-md mt-4 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">व्यक्तिगत जानकारी</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Phone className="text-gray-600" size={20} />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-3">
            <User className="text-gray-600" size={20} />
            <span>पुरुष</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="text-gray-600" size={20} />
            <span>वाराणसी उत्तर</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="text-gray-600" size={20} />
            <span>25-35 वर्ष</span>
          </div>
        </div>
      </div>
    </div>
  );
}