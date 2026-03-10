'use client';

import './globals.css';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { wagmiConfig, chains } from '@/lib/wagmi';
import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isFullWidth = isHome || pathname === '/artist' || pathname === '/explore' || pathname === '/profile' || pathname === '/trending';

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Climate+Crisis&family=Tektur:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-brand-bg text-white min-h-screen">
        <WagmiConfig config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider chains={chains}>
              {!isFullWidth && <Navbar />}
              <main className={isFullWidth ? '' : 'container mx-auto px-4 py-8'}>
                {children}
              </main>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#1a1a1a',
                    color: '#fff',
                  },
                }}
              />
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
