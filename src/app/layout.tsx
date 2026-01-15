import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"
import ServiceWorkerProvider from "@/components/ServiceWorkerProvider"

import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://ipponyariph.com"),
  
  title: {
    default: "IPPONYARI Japanese Restaurant - Authentic Japanese Dining Philippines",
    template: "%s | IPPONYARI Japanese Restaurant"
  },
  
  description:
    "Authentic Japanese cuisine across Philippines. Premium yakitori, sushi & ramen at Santa Rosa, Calamba, Alabang, Lipa & Dasmariñas. Reserve now!",
  
  keywords: [
    // Location-specific keywords - Santa Rosa
    "Japanese restaurant Santa Rosa",
    "Japanese restaurant Santa Rosa Laguna",
    "Ipponyari Santa Rosa",
    "yakitori Santa Rosa",
    "sushi Santa Rosa",
    "ramen Santa Rosa",
    "Japanese restaurant Tagaytay Road",
    "Japanese restaurant near me Santa Rosa",
    
    // Location-specific keywords - Calamba
    "Japanese restaurant Calamba",
    "Ipponyari Calamba",
    "yakitori Calamba",
    "sushi Calamba",
    "Japanese restaurant Calamba Laguna",
    
    // Location-specific keywords - Alabang Las Piñas
    "Japanese restaurant Alabang",
    "Japanese restaurant Las Piñas",
    "Ipponyari Alabang",
    "Alabang West Parade restaurant",
    "Japanese restaurant Almanza Dos",
    "yakitori Alabang",
    "sushi Las Piñas",
    
    // Location-specific keywords - Lipa City
    "Japanese restaurant Lipa City",
    "Japanese restaurant Batangas",
    "Ipponyari Lipa",
    "LIMA Estate restaurant",
    "Outlets at LIMA restaurant",
    "yakitori Lipa City",
    "sushi Batangas",
    
    // Location-specific keywords - Dasmariñas
    "Japanese restaurant Dasmariñas",
    "Japanese restaurant Cavite",
    "Ipponyari Dasmariñas",
    "yakitori Dasmariñas",
    "sushi Cavite",
    "Japanese restaurant Cavite",
    
    // General location keywords
    "Japanese restaurant Laguna",
    "Japanese restaurant South Metro Manila",
    "Japanese restaurant Philippines",
    "best Japanese food Laguna",
    "Japanese restaurant near me",
    
    // Cuisine-specific keywords
    "authentic yakitori Philippines",
    "fresh sushi Philippines",
    "authentic ramen Philippines",
    "tonkotsu ramen Laguna",
    "Japanese BBQ Philippines",
    "takoyaki Philippines",
    "gyoza Philippines",
    
    // Experience keywords
    "authentic Japanese cuisine",
    "traditional Japanese restaurant",
    "Japanese sake bar",
    "Japanese craft beer",
    "family dining Japanese",
    
    // Occasion keywords
    "Japanese restaurant for dates",
    "business lunch Japanese",
    "family restaurant Japanese",
    "Japanese restaurant reservations",
    "private dining Japanese",
    
    // Brand
    "Ipponyari",
    "Ippon Yari",
    "Ipponyari Restaurant",
    "Ipponyari Philippines",
  ],
  
  authors: [{ name: "Ipponyari Japanese Restaurant" }],
  creator: "Ipponyari",
  publisher: "Ipponyari Restaurant Group",
  applicationName: "Ipponyari",
  referrer: "origin-when-cross-origin",
  manifest: "/manifest.json",
  
  openGraph: {
    type: "website",
    locale: "en_PH",
    alternateLocale: ["en_US", "ja_JP"],
    url: "https://ipponyariph.com",
    siteName: "Ipponyari Japanese Restaurant",
    title: "Ipponyari - Authentic Japanese Restaurant Philippines | Multiple Branches",
    description:
      "Experience authentic Japanese cuisine at Ipponyari Restaurant. Branches in Santa Rosa, Calamba, Alabang, Lipa City, and Dasmariñas. Premium yakitori, fresh sushi, ramen, and Japanese sake. Book your table now!",
    images: [
      {
        url: "https://ipponyariph.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ipponyari Japanese Restaurant Philippines",
        type: "image/jpeg",
      },
      {
        url: "https://ipponyariph.com/restaurant-exterior.jpg",
        width: 1200,
        height: 630,
        alt: "Ipponyari Restaurant Exterior",
        type: "image/jpeg",
      },
      {
        url: "https://ipponyariph.com/restaurant-interior.jpg",
        width: 1200,
        height: 630,
        alt: "Ipponyari Restaurant Interior Ambiance",
        type: "image/jpeg",
      },
      {
        url: "https://ipponyariph.com/signature-dishes.jpg",
        width: 1200,
        height: 630,
        alt: "Premium Japanese Dishes at Ipponyari",
        type: "image/jpeg",
      },
    ],
    countryName: "Philippines",
  },

  twitter: {
    card: "summary_large_image",
    title: "Ipponyari Japanese Restaurant - Authentic Japanese Dining Philippines",
    description:
      "Experience authentic Japanese cuisine at our multiple branches: Santa Rosa, Calamba, Alabang, Lipa City & Dasmariñas. Premium yakitori, sushi, ramen & sake.",
    images: ["https://ipponyariph.com/og-image.jpg"],
    creator: "@ipponyariph",
    site: "@ipponyariph",
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ipponyari Restaurant",
    startupImage: [
      {
        url: "/apple-splash-2048-2732.jpg",
        media: "(device-width: 1024px) and (device-height: 1366px)",
      },
      {
        url: "/apple-splash-1668-2388.jpg",
        media: "(device-width: 834px) and (device-height: 1194px)",
      },
    ],
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon192_rounded.png", sizes: "192x192", type: "image/png" },
      { url: "/icon512_rounded.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon180_rounded.png", sizes: "180x180", type: "image/png" },
      { url: "/icon192_rounded.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/icon512_rounded.png",
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },

  category: "restaurant",
  classification: "Japanese Restaurant",
  
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noarchive: false,
    noimageindex: false,
    nosnippet: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  alternates: {
    canonical: "https://ipponyariph.com",
    languages: {
      "en-PH": "https://ipponyariph.com",
      "en-US": "https://ipponyariph.com/en",
    },
  },
  
  verification: {
    google: "your-google-search-console-verification-code",
    yandex: "your-yandex-verification-code",
    other: {
      "facebook-domain-verification": "your-facebook-domain-verification",
    },
  },

  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#8B0000" },
    { media: "(prefers-color-scheme: dark)", color: "#6B0000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Restaurant Chain Schema - Enhanced
  const restaurantChainSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": "https://ipponyariph.com/#restaurant",
    "name": "Ipponyari Japanese Restaurant",
    "alternateName": "Ippon Yari",
    "image": [
      "https://ipponyariph.com/restaurant-exterior.jpg",
      "https://ipponyariph.com/restaurant-interior.jpg",
      "https://ipponyariph.com/signature-dishes.jpg"
    ],
    "description": "Authentic Japanese restaurant chain in Philippines. Specializing in premium yakitori, fresh sushi, authentic ramen, and curated Japanese sake selection. Multiple branches across Santa Rosa, Calamba, Alabang, Lipa City, and Dasmariñas.",
    "servesCuisine": ["Japanese", "Asian", "Yakitori", "Sushi", "Ramen"],
    "priceRange": "₱₱-₱₱₱",
    "currenciesAccepted": "PHP",
    "paymentAccepted": "Cash, Credit Card, Debit Card, GCash, Maya",
    
    "telephone": "(049) 541 1635",
    "email": "reservations@ipponyariph.com",
    "url": "https://ipponyariph.com",
    
    "menu": "https://ipponyariph.com/menu",
    "acceptsReservations": true,
    "hasMenu": "https://ipponyariph.com/menu",
    
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "11:00",
        "closes": "22:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday", "Sunday"],
        "opens": "10:00",
        "closes": "23:00"
      }
    ],
    
    "areaServed": [
      {
        "@type": "City",
        "name": "Santa Rosa",
        "containedInPlace": {
          "@type": "State",
          "name": "Laguna"
        }
      },
      {
        "@type": "City",
        "name": "Calamba",
        "containedInPlace": {
          "@type": "State",
          "name": "Laguna"
        }
      },
      {
        "@type": "City",
        "name": "Las Piñas",
        "containedInPlace": {
          "@type": "State",
          "name": "Metro Manila"
        }
      },
      {
        "@type": "City",
        "name": "Lipa City",
        "containedInPlace": {
          "@type": "State",
          "name": "Batangas"
        }
      },
      {
        "@type": "City",
        "name": "Dasmariñas",
        "containedInPlace": {
          "@type": "State",
          "name": "Cavite"
        }
      }
    ],
    
    "branchOf": [
      {
        "@type": "Restaurant",
        "name": "Ipponyari Santa Rosa",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Santa Rosa-Tagaytay Road",
          "addressLocality": "Santa Rosa",
          "addressRegion": "Laguna",
          "postalCode": "4026",
          "addressCountry": "PH"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "14.2691",
          "longitude": "121.1139"
        },
        "telephone": "(049) 541 1635",
        "url": "https://ipponyariph.com/locations/santa-rosa-laguna"
      },
      {
        "@type": "Restaurant",
        "name": "Ippon Yari Calamba",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Calamba",
          "addressRegion": "Laguna",
          "postalCode": "4027",
          "addressCountry": "PH"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "14.2114",
          "longitude": "121.1655"
        },
        "url": "https://ipponyariph.com/locations/calamba-laguna"
      },
      {
        "@type": "Restaurant",
        "name": "Ipponyari Alabang",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Alabang West Parade, Almanza Dos",
          "addressLocality": "Las Piñas",
          "addressRegion": "Metro Manila",
          "postalCode": "1750",
          "addressCountry": "PH"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "14.4165",
          "longitude": "121.0096"
        },
        "url": "https://ipponyariph.com/locations/alabang-las-pinas"
      },
      {
        "@type": "Restaurant",
        "name": "Ipponyari Lipa City",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "The Outlets at LIMA Estate",
          "addressLocality": "Lipa City",
          "addressRegion": "Batangas",
          "postalCode": "4217",
          "addressCountry": "PH"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "13.9411",
          "longitude": "121.1633"
        },
        "url": "https://ipponyariph.com/locations/lipa-city-batangas"
      },
      {
        "@type": "Restaurant",
        "name": "Ipponyari Dasmariñas",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Dasmariñas",
          "addressRegion": "Cavite",
          "postalCode": "4114",
          "addressCountry": "PH"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "14.3294",
          "longitude": "120.9366"
        },
        "url": "https://ipponyariph.com/locations/dasmarinas-cavite"
      }
    ],
    
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "128",
      "bestRating": "5",
      "worstRating": "1"
    },
    
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Free Wi-Fi",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Family Friendly",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Dine-in",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Takeout",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Wheelchair Accessible",
        "value": true
      }
    ],
    
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://ipponyariph.com/reservations",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "result": {
        "@type": "Reservation",
        "name": "Table Reservation"
      }
    }
  }

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://ipponyariph.com/#organization",
    "name": "Ipponyari Japanese Restaurant",
    "url": "https://ipponyariph.com",
    "logo": "https://ipponyariph.com/logo.png",
    "image": "https://ipponyariph.com/og-image.jpg",
    "description": "Authentic Japanese restaurant chain with multiple branches across Philippines",
    "email": "info@ipponyariph.com",
    "telephone": "(049) 541 1635",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Santa Rosa-Tagaytay Road",
      "addressLocality": "Santa Rosa",
      "addressRegion": "Laguna",
      "postalCode": "4026",
      "addressCountry": "PH"
    },
    "sameAs": [
      "https://www.facebook.com/ipponyariph",
      "https://www.instagram.com/ipponyariph",
      "https://twitter.com/ipponyariph",
      "https://www.tiktok.com/@ipponyariph"
    ],
    "foundingDate": "2020",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": "50-100"
    }
  }

  // WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://ipponyariph.com/#website",
    "url": "https://ipponyariph.com",
    "name": "Ipponyari Japanese Restaurant Philippines",
    "description": "Authentic Japanese Restaurant Chain in Philippines",
    "publisher": {
      "@id": "https://ipponyariph.com/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://ipponyariph.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en-PH"
  }

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://ipponyariph.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Locations",
        "item": "https://ipponyariph.com/locations"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Menu",
        "item": "https://ipponyariph.com/menu"
      }
    ]
  }

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Where are Ipponyari branches located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ipponyari has 5 branches across the Philippines: Santa Rosa Laguna on Tagaytay Road, Calamba Laguna, Alabang West Parade in Las Piñas Metro Manila, The Outlets at LIMA Estate in Lipa City Batangas, and Dasmariñas Cavite."
        }
      },
      {
        "@type": "Question",
        "name": "Does Ipponyari accept reservations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Ipponyari accepts reservations for all branches. You can call (049) 541 1635 or book online through our website at ipponyariph.com/reservations."
        }
      },
      {
        "@type": "Question",
        "name": "What are Ipponyari's operating hours?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ipponyari is open Monday to Friday from 11:00 AM to 10:00 PM, and Saturday to Sunday from 10:00 AM to 11:00 PM. Hours may vary by branch location."
        }
      },
      {
        "@type": "Question",
        "name": "What type of cuisine does Ipponyari serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ipponyari specializes in authentic Japanese cuisine including premium yakitori (grilled skewers), fresh sushi and sashimi, authentic ramen, takoyaki, gyoza, and a curated selection of Japanese sake and craft beer."
        }
      },
      {
        "@type": "Question",
        "name": "What payment methods does Ipponyari accept?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ipponyari accepts cash, credit cards, debit cards, GCash, and Maya for payment at all branches."
        }
      },
      {
        "@type": "Question",
        "name": "Is Ipponyari family-friendly?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Ipponyari is a family-friendly restaurant welcoming guests of all ages. We offer a comfortable dining atmosphere suitable for families, couples, and business gatherings."
        }
      }
    ]
  }

  // Menu Schema
  const menuSchema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": "https://ipponyariph.com/#menu",
    "name": "Ipponyari Menu",
    "description": "Authentic Japanese cuisine menu featuring yakitori, sushi, ramen, and more",
    "hasMenuSection": [
      {
        "@type": "MenuSection",
        "name": "Yakitori",
        "description": "Premium Japanese grilled skewers",
        "image": "https://ipponyariph.com/menu/yakitori.jpg"
      },
      {
        "@type": "MenuSection",
        "name": "Sushi & Sashimi",
        "description": "Fresh sushi and sashimi selection",
        "image": "https://ipponyariph.com/menu/sushi.jpg"
      },
      {
        "@type": "MenuSection",
        "name": "Ramen",
        "description": "Authentic Japanese ramen bowls",
        "image": "https://ipponyariph.com/menu/ramen.jpg"
      },
      {
        "@type": "MenuSection",
        "name": "Japanese Appetizers",
        "description": "Traditional Japanese starters including takoyaki and gyoza",
        "image": "https://ipponyariph.com/menu/appetizers.jpg"
      },
      {
        "@type": "MenuSection",
        "name": "Beverages",
        "description": "Japanese sake, craft beer, and specialty drinks",
        "image": "https://ipponyariph.com/menu/beverages.jpg"
      }
    ],
    "inLanguage": "en-PH"
  }

  return (
    <html lang="en-PH">
      <head>
        {/* Primary Structured Data - Restaurant Chain */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantChainSchema) }}
        />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        
        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* Menu Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(menuSchema) }}
        />
        
        {/* Open Graph Image Tags */}
        <meta property="og:image" content="https://ipponyariph.com/og-image.jpg" />
        <meta property="og:image:secure_url" content="https://ipponyariph.com/og-image.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Ipponyari Japanese Restaurant Philippines" />
        
        {/* Twitter Card Image */}
        <meta name="twitter:image" content="https://ipponyariph.com/og-image.jpg" />
        <meta name="twitter:image:alt" content="Ipponyari Japanese Restaurant" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Preload critical assets */}
        <link rel="preload" as="image" href="/hero-image.jpg" />
        
        {/* Geographic meta tags - Multiple locations */}
        <meta name="geo.region" content="PH-40;PH-41;PH-00;PH-21" />
        <meta name="geo.placename" content="Santa Rosa, Laguna; Calamba, Laguna; Las Piñas, Metro Manila; Lipa City, Batangas; Dasmariñas, Cavite" />
        <meta name="geo.position" content="14.2691;121.1139" />
        <meta name="ICBM" content="14.2691, 121.1139" />
        
        {/* Additional meta tags */}
        <meta name="format-detection" content="telephone=yes" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://ipponyariph.com" />
        
        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" href="https://ipponyariph.com/sitemap.xml" />
        
        {/* Alternative languages */}
        <link rel="alternate" hrefLang="en-ph" href="https://ipponyariph.com" />
        <link rel="alternate" hrefLang="en" href="https://ipponyariph.com/en" />
        <link rel="alternate" hrefLang="x-default" href="https://ipponyariph.com" />
      </head>
      <body>
        <ServiceWorkerProvider />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}