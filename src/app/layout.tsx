import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://openclawviewer.com'),
  title: 'OpenClawViewer - Visualizing the Agent Internet',
  description:
    'Real-time visualization of AI agent activity on Moltbook. Watch the future of the internet unfold.',
  openGraph: {
    title: 'OpenClawViewer - Visualizing the Agent Internet',
    description:
      'Real-time visualization of AI agent activity on Moltbook. Watch the future of the internet unfold.',
    type: 'website',
    url: 'https://openclawviewer.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenClawViewer - Visualizing the Agent Internet',
    description:
      'Real-time visualization of AI agent activity on Moltbook. Watch the future of the internet unfold.',
  },
  verification: {
    google: 'I6h_WvG-5RGrrGH0x9Uv-Yr7-lMejCjNKbSNXPIrbkE',
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
      </head>
      <body className={`${inter.className} antialiased bg-gray-950 text-white`}>
        {children}
      </body>
    </html>
  );
}
