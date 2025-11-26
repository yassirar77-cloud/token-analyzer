import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Token Analyzer - Security Scanner',
  description: 'Analyze ERC-20 tokens for honeypots, scams, and security risks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0a]">{children}</body>
    </html>
  )
}
