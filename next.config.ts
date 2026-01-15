import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  
  // Hide readable source maps 
  productionBrowserSourceMaps: false,
  
  // 📦 Increase API body size limit for file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  
async headers() {
  // 🚫 Disable security headers in development
  if (process.env.NODE_ENV !== "production") {
    return [];
  }

  return [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains"
        },
        {
          key: "X-Frame-Options",
          value: "SAMEORIGIN"
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff"
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin"
        },
        {
          key: "X-XSS-Protection",
          value: "0"
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()"
        },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "connect-src 'self' https://infinitech-api12.site http://localhost:8000",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "font-src 'self' data:",
            "img-src * blob: data:",
            "media-src 'self' blob: data:",
            "frame-src https://*.google.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'"
          ].join("; ") + ";"
        }
      ]
    }
  ];
}

};

export default nextConfig;
