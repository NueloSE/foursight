import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://foursight.vercel.app'),
  title: 'FourSight — Meme Coin Intelligence',
  description: 'AI-powered audit reports and shareable score cards for every BNB Chain meme token. Scan any token in seconds.',
  keywords: ['meme coin', 'BNB Chain', 'token audit', 'crypto safety', 'four.meme', 'BSC'],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'FourSight — Meme Coin Intelligence',
    description: 'Scan any BNB Chain meme token. Know before you ape.',
    type: 'website',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
