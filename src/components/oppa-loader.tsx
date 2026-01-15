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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black via-red-950 to-black overflow-hidden">
      {/* Animated background orbs - deep crimson themed */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-700 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-rose-900 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-red-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

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
        @keyframes spin-slow {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
          50% { opacity: 0.7; }
          100% { transform: translateY(-50px) translateX(15px); opacity: 0; }
        }
        @keyframes sizzle {
          0%, 100% { transform: translateX(0px) scale(1); }
          25% { transform: translateX(-2px) scale(1.05); }
          75% { transform: translateX(2px) scale(0.95); }
        }
      `}</style>

      <div className="text-center relative z-10">
        {/* Chef's knife and cutting board illustration */}
        <div className="mb-12 flex justify-center items-center">
          <div className="relative w-48 h-40">
            {/* Steam/heat waves */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-16 bg-gradient-to-t from-red-500/50 to-transparent rounded-full blur-md"
                  style={{
                    left: `${-30 + i * 20}px`,
                    animation: "float 2.8s ease-in-out infinite",
                    animationDelay: `${i * 250}ms`,
                  }}
                />
              ))}
            </div>

            {/* Rotating plate decoration */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-44 h-44">
              <div className="absolute inset-0 border-2 border-red-600/30 rounded-full" style={{ animation: "spin-slow 12s linear infinite" }}>
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-red-500 rounded-full -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-rose-500 rounded-full -translate-x-1/2"></div>
              </div>
            </div>

            {/* Chef's knife */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 rotate-45" style={{ animation: "sizzle 2s ease-in-out infinite" }}>
              {/* Blade */}
              <div className="relative">
                <div className="w-24 h-6 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 rounded-r-full shadow-xl border-t-2 border-b-2 border-gray-400">
                  {/* Blade shine */}
                  <div className="absolute top-1 left-2 w-16 h-1 bg-white/60 rounded-full blur-sm"></div>
                  {/* Sharp edge indicator */}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                </div>
                {/* Handle */}
                <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 w-10 h-5 bg-gradient-to-r from-red-900 to-red-800 rounded-l-lg border-2 border-red-950 shadow-lg">
                  <div className="absolute inset-1 bg-gradient-to-r from-red-800/50 to-transparent rounded-l-lg"></div>
                </div>
              </div>
            </div>

            {/* Cutting board base */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 h-20 bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg border-4 border-amber-950 shadow-2xl">
              {/* Wood grain effect */}
              <div className="absolute inset-2 opacity-30">
                <div className="h-1 bg-amber-950 rounded-full mb-2"></div>
                <div className="h-1 bg-amber-950 rounded-full mb-2"></div>
                <div className="h-1 bg-amber-950 rounded-full"></div>
              </div>
              {/* Highlight */}
              <div className="absolute top-2 left-4 w-20 h-2 bg-amber-700/40 rounded-full blur-sm"></div>
            </div>

            {/* Ingredient accent - small vegetables */}
            <div className="absolute bottom-16 right-8 w-4 h-4 bg-green-600 rounded-full shadow-md animate-pulse"></div>
            <div className="absolute bottom-14 right-12 w-3 h-3 bg-red-600 rounded-full shadow-md animate-pulse" style={{ animationDelay: "200ms" }}></div>
          </div>
        </div>

        {/* Brand text */}
        <div className="mb-10">
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-600 to-red-500 mb-1 tracking-wider drop-shadow-2xl">
            IPPONYARI
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-red-300/90 tracking-widest drop-shadow-lg">JAPANESE RESTAURANT</h2>
          <div className="h-1.5 w-32 bg-gradient-to-r from-red-600 via-rose-700 to-red-600 mx-auto mt-4 rounded-full shadow-lg shadow-red-500/50"></div>
        </div>

        {/* Loading animation - crimson bars */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className="w-2 h-8 bg-gradient-to-b from-red-500 to-red-800 rounded-full animate-bounce shadow-lg shadow-red-500/50"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-8 bg-gradient-to-b from-red-500 to-red-800 rounded-full animate-bounce shadow-lg shadow-red-500/50"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-8 bg-gradient-to-b from-red-500 to-red-800 rounded-full animate-bounce shadow-lg shadow-red-500/50"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>

        {/* Status text */}
        <p className="text-red-400/80 text-sm font-medium tracking-widest">一本槍 • Preparing...</p>
      </div>
    </div>
  )
}
