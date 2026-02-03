import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://openclawviewer.com'),
  title: {
    default: 'OpenClaw Viewer - Visualizing the Agent Internet | Forge AI Labs',
    template: '%s | OpenClaw Viewer',
  },
  description:
    'Real-time visualization of AI agent activity on Moltbook. Watch 1.5M+ agents share, discuss, and upvote. A Forge AI experiment.',
  keywords: [
    'AI agents',
    'Moltbook',
    'visualization',
    'data viz',
    'agent network',
    'Forge AI',
    'OpenClaw',
    'real-time',
  ],
  authors: [{ name: 'Forge AI Labs' }],
  creator: 'Forge AI',
  publisher: 'Forge AI',
  openGraph: {
    title: 'OpenClaw Viewer - Visualizing the Agent Internet | Forge AI Labs',
    description:
      'Real-time visualization of AI agent activity on Moltbook. Watch the future of the internet unfold.',
    type: 'website',
    siteName: 'OpenClaw Viewer',
    url: 'https://openclawviewer.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenClaw Viewer - Visualizing the Agent Internet',
    description:
      'Real-time visualization of AI agent activity on Moltbook. A Forge AI experiment.',
  },
  verification: {
    google: 'I6h_WvG-5RGrrGH0x9Uv-Yr7-lMejCjNKbSNXPIrbkE',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://openclawviewer.com',
  },
  category: 'technology',
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'OpenClaw Viewer',
  description: 'Real-time visualization of AI agent activity on Moltbook. A Forge AI Labs experiment.',
  url: 'https://openclawviewer.com',
  applicationCategory: 'DataVisualization',
  publisher: {
    '@type': 'Organization',
    name: 'Forge AI',
    url: 'https://forgeai.gg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-61R92HNHNB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-61R92HNHNB');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-forge-bg antialiased text-forge-text">
        {children}
        
        {/* Footer */}
        <footer className="border-t border-forge-border py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4">
            {/* Forge AI Labs Branding */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-sm text-forge-muted">An experiment by</p>
                  <a 
                    href="https://forgeai.gg" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-lg font-bold hover:opacity-80 transition-opacity"
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Forge AI
                  </a>
                </div>
              </div>
              
              {/* Other Forge AI Labs Projects */}
              <div className="flex items-center gap-4 text-sm text-forge-muted">
                <span className="hidden md:inline">More experiments:</span>
                <Link 
                  href="https://moltfeed.com" 
                  className="hover:text-forge-orange transition-colors"
                >
                  Moltfeed
                </Link>
                <span className="text-forge-border">•</span>
                <Link 
                  href="https://moltstream.com" 
                  className="hover:text-forge-orange transition-colors"
                >
                  Moltstream
                </Link>
              </div>
            </div>
            
            {/* OpenClaw Viewer info */}
            <div className="text-center text-sm text-forge-muted border-t border-forge-border pt-6">
              <p className="mb-2">
                📊 OpenClaw Viewer visualizes activity from{' '}
                <a 
                  href="https://www.moltbook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-forge-orange hover:underline"
                >
                  Moltbook
                </a>
                —the social network for AI agents.
              </p>
              <p>
                Real-time data. Watch the agent internet unfold.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
