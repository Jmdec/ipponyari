"use client"

import { useState, useEffect } from "react"

export default function IzakayaLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-[#fff5f5] overflow-hidden">
      {/* Animated background orbs - crimson themed */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#dc143c] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-[#7f0020] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#dc143c] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <div className="text-center relative z-10">
        {/* Animated spear/yari symbol for Ipponyari */}
        <div className="mb-12 flex justify-center items-center">
          <div className="relative w-40 h-40">
            {/* Glow effect */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-12 bg-gradient-to-t from-[#dc143c]/40 to-transparent rounded-full blur-sm"
                  style={{
                    left: `${-20 + i * 20}px`,
                    animation: "float 2.5s ease-in-out infinite",
                    animationDelay: `${i * 200}ms`,
                  }}
                />
              ))}
            </div>

            {/* Spear/Yari design */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              {/* Spear tip */}
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[30px] border-l-transparent border-r-transparent border-b-[#dc143c] shadow-lg"></div>
              {/* Spear shaft */}
              <div className="w-3 h-24 bg-gradient-to-b from-[#dc143c] to-[#7f0020] rounded-b-sm shadow-md"></div>
              {/* Decorative ring */}
              <div className="w-8 h-2 bg-gradient-to-r from-[#7f0020] via-[#dc143c] to-[#7f0020] rounded-full -mt-1"></div>
              {/* Lower shaft */}
              <div className="w-2 h-16 bg-gradient-to-b from-[#8B4513] to-[#654321] rounded-b-lg"></div>
            </div>

            {/* Circular glow behind spear */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#dc143c]/5 animate-pulse"></div>
          </div>
        </div>

        {/* Brand text */}
        <div className="mb-10">
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#dc143c] via-[#7f0020] to-[#dc143c] mb-1 tracking-wider">
            IPPONYARI
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-600 tracking-widest">JAPANESE RESTAURANT</h2>
          <div className="h-1.5 w-32 bg-gradient-to-r from-[#dc143c] via-[#7f0020] to-[#dc143c] mx-auto mt-4 rounded-full shadow-lg"></div>
        </div>

        {/* Loading animation - crimson bars */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className="w-2 h-8 bg-gradient-to-b from-[#dc143c] to-[#7f0020] rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-8 bg-gradient-to-b from-[#dc143c] to-[#7f0020] rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-8 bg-gradient-to-b from-[#dc143c] to-[#7f0020] rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>

        {/* Status text */}
        <p className="text-[#dc143c]/70 text-sm font-medium tracking-widest">一本槍 • Loading...</p>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
            50% { opacity: 0.6; }
            100% { transform: translateY(-40px) translateX(10px); opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  )
}
