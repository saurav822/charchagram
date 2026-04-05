import type { Metadata, Viewport } from 'next'
import './globals.css'
import ServiceWorkerRegistration from '../components/ServiceWorkerRegistration'
import LayoutWrapper from '@/components/Layoutwrapper'
import AxiosConfig from '@/components/AxiosConfig'
import { UserProvider } from '@/contexts/UserContext'
import { ConstituencyProvider } from '@/contexts/ConstituencyContext'
import ErrorBoundary from '@/components/ErrorBoundary'

const BUILD_VERSION = Date.now()

export const metadata: Metadata = {
  title: 'CharchaGram - Discussions into Accountability',
  description: 'CharchaGram is a digital accountability platform enabling citizens to raise concerns, foster dialogue, and hold public entities accountable. Join collective discussions powered by AI-driven insights, sentiment analysis, and real-time policy intelligence.',
  manifest: '/manifest.json',
  icons: '/mainlogonew.png',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CharchaGram',
  },
  keywords: 'accountability, democracy, political discussion, civic tech, India, elections 2025, citizen voice, governance, policy insights, Bihar, community dialogue',
  openGraph: {
    title: 'CharchaGram - Discussions into Accountability',
    description: 'A multilingual platform for collective citizen voice, real-time accountability, and policy dialogue. Participate in issue-based discussions, sentiment checks, and evidence-backed collective action.',
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.charchagram.com/',
    siteName: 'CharchaGram',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CharchaGram - Discussions into Accountability',
    description: 'Join CharchaGram to raise concerns, track sentiments, and hold leaders accountable. Turning conversations into collective action for a stronger democracy.',
  },
  robots: 'index, follow',
  authors: [{ name: 'CharchaGram Team' }],
  category: 'Civic Tech & Community Engagement',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-N7VPEYZYPM"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-N7VPEYZYPM');
            `,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CharchaManch" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="description" content="A progressive web app for messaging and community" />
        <meta name="build-version" content={BUILD_VERSION.toString()} />
      </head>
      <body className="bg-gray-50">
        <ErrorBoundary>
          <UserProvider>
            <ConstituencyProvider>
              <AxiosConfig />
              <ServiceWorkerRegistration />
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </ConstituencyProvider>
          </UserProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}