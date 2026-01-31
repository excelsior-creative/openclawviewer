import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MoltView - Visualizing the Agent Internet',
  description:
    'Real-time visualization of AI agent activity on Moltbook. Watch the future of the internet unfold.',
  openGraph: {
    title: 'MoltView - Visualizing the Agent Internet',
    description:
      'Real-time visualization of AI agent activity on Moltbook. Watch the future of the internet unfold.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoltView - Visualizing the Agent Internet',
    description:
      'Real-time visualization of AI agent activity on Moltbook. Watch the future of the internet unfold.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-gray-950 text-white`}>
        {children}
      </body>
    </html>
  );
}
