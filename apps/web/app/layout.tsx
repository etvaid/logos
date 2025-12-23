import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin', 'greek'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'LOGOS - AI-Powered Classical Research Platform',
  description: 'Advanced AI-powered platform for classical studies research. Explore ancient texts, perform semantic searches, and discover connections across Greek and Latin literature with cutting-edge natural language processing.',
  keywords: [
    'classical studies',
    'AI research',
    'ancient texts',
    'Greek literature',
    'Latin literature',
    'semantic search',
    'digital humanities',
    'natural language processing',
    'academic research',
    'classical philology'
  ],
  authors: [{ name: 'LOGOS Research Team' }],
  creator: 'LOGOS',
  publisher: 'LOGOS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://logos-research.com'),
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'LOGOS - AI-Powered Classical Research Platform',
    description: 'Advanced AI-powered platform for classical studies research. Explore ancient texts, perform semantic searches, and discover connections across Greek and Latin literature.',
    siteName: 'LOGOS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LOGOS - AI-Powered Classical Research Platform',
        type: 'image/png',
      },
      {
        url: '/og-image-square.png',
        width: 1200,
        height: 1200,
        alt: 'LOGOS - Classical Research Platform',
        type: 'image/png',
      }
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'LOGOS - AI-Powered Classical Research Platform',
    description: 'Advanced AI-powered platform for classical studies research. Explore ancient texts with cutting-edge natural language processing.',
    creator: '@logos_research',
    site: '@logos_research',
    images: ['/twitter-image.png'],
  },

  // Additional meta tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Icons
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#1a365d' },
      { rel: 'manifest', url: '/site.webmanifest' }
    ]
  },

  // Additional metadata
  manifest: '/site.webmanifest',
  category: 'education',
  classification: 'Academic Research Platform',
  
  // Verification (add your verification codes)
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
  },

  // Additional Open Graph properties
  other: {
    'theme-color': '#1a365d',
    'msapplication-TileColor': '#1a365d',
    'msapplication-config': '/browserconfig.xml',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />

        {/* Google Fonts for Greek text */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Serif+Pro:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap"
          rel="stylesheet"
        />

        {/* Additional Greek font support */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&subset=greek,greek-ext&display=swap"
          rel="stylesheet"
        />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />

        {/* Canonical URL will be set by individual pages */}
        <link rel="canonical" href={process.env.NEXT_PUBLIC_BASE_URL || 'https://logos-research.com'} />

        {/* Additional meta tags */}
        <meta name="application-name" content="LOGOS" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LOGOS" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Color scheme */}
        <meta name="color-scheme" content="dark light" />
      </head>
      
      <body 
        className={`
          min-h-screen 
          bg-gray-50 
          dark:bg-gray-900 
          text-gray-900 
          dark:text-gray-50
          font-sans
          antialiased
          transition-colors
          duration-300
        `}
        suppressHydrationWarning
      >
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all"
        >
          Skip to main content
        </a>

        {children}

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              `}
            </Script>
          </>
        )}

        {/* Google Tag Manager (alternative to GA) */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
            `}
          </Script>
        )}

        {/* Schema.org structured data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "LOGOS",
              "description": "AI-Powered Classical Research Platform for ancient texts and literature",
              "url": process.env.NEXT_PUBLIC_BASE_URL || 'https://logos-research.com',
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://logos-research.com'}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "LOGOS",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://logos-research.com'}/logo-512x512.png`
                }
              }
            })
          }}
        />

        {/* Theme detection and prevention of flash */}
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.className = document.documentElement.className.replace(/\\s*(light|dark)\\s*/, ' ' + theme + ' ');
              } catch (e) {
                document.documentElement.className += ' dark';
              }
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code