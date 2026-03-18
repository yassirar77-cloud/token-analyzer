'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, X } from 'lucide-react';
import { trackApi, TrackData } from '@/lib/api';
import MusicPlayer from '@/components/MusicPlayer';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { resolveIpfsCover } from '@/lib/ipfs';

function TrackNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { href: '/explore', label: 'Explore' },
    { href: '/artist', label: 'Artist' },
    { href: '/profile', label: 'Profile' },
    { href: '/trending', label: 'Trending' },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-4 md:px-8 lg:px-[164px] py-[24px] lg:py-[39px]">
      <div className="flex items-center justify-between lg:gap-[173px]">
        <Link href="/" className="font-logo text-[22px] md:text-[30px] text-white whitespace-nowrap">
          Backstreet Dogs
        </Link>
        <div className="hidden md:flex items-center gap-[30px]">
          <div className="flex items-center gap-[24px] lg:gap-[44px] font-sans font-medium text-[16px] lg:text-[18px] leading-[30px] text-white">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:opacity-80 transition-opacity">
                {item.label}
              </Link>
            ))}
          </div>
          <ConnectButton.Custom>
            {({ openConnectModal, account, mounted }) => {
              if (!mounted || !account) {
                return (
                  <button onClick={openConnectModal} className="btn-gradient-sm !py-[16px] lg:!py-[21px] !px-[30px] lg:!px-[70px] text-[16px] lg:text-[18px]">
                    Connect Wallet
                  </button>
                );
              }
              return (
                <div className="btn-gradient-sm !py-[16px] lg:!py-[21px] !px-[30px] lg:!px-[40px] text-[16px] lg:text-[18px] cursor-default">
                  {account.displayName}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
        <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-bg/95 backdrop-blur-sm mt-4 px-4 py-4 rounded-lg flex flex-col gap-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-white text-lg font-sans font-medium py-2" onClick={() => setMobileMenuOpen(false)}>{item.label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default function TrackDetailPage() {
  const params = useParams();
  const { isConnected } = useAccount();
  const [track, setTrack] = useState<TrackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadTrack(params.id as string);
    }
  }, [params.id]);

  const loadTrack = async (id: string) => {
    try {
      setLoading(true);
      const response = await trackApi.getById(id);
      setTrack(response.data);
    } catch (err: any) {
      console.error('Error loading track:', err);
      setError(err.response?.status === 404 ? 'Track not found' : 'Failed to load track');
    } finally {
      setLoading(false);
    }
  };

  const coverUrl = track ? resolveIpfsCover(track.coverImage) : '/placeholder-cover.png';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const streamUrl = track ? `${apiUrl}/api/tracks/${track.id}/stream` : '';

  return (
    <div className="bg-brand-bg min-h-screen relative">
      <TrackNavbar />

      {/* Hero gradient */}
      <div className="relative h-[200px] sm:h-[280px] lg:h-[340px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-brand-bg" />
        <div className="absolute left-[20%] top-[40px] w-[400px] h-[400px] pointer-events-none">
          <div className="absolute inset-0 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #4CBAFF 0%, transparent 55%)', filter: 'blur(187px)' }} />
        </div>
        <div className="absolute right-[20%] top-[40px] w-[400px] h-[400px] pointer-events-none">
          <div className="absolute inset-0 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #FF4CA3 0%, transparent 55%)', filter: 'blur(187px)' }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative px-4 md:px-8 lg:px-[164px] -mt-[100px] sm:-mt-[140px] z-10 pb-[80px]">
        {loading ? (
          <div className="flex items-center justify-center py-[100px]">
            <div className="w-[48px] h-[48px] border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-[100px]">
            <p className="font-sans text-[18px] text-red-400 mb-[20px]">{error}</p>
            <Link href="/explore" className="btn-gradient-sm !py-[14px] !px-[30px] text-[16px]">
              Back to Explore
            </Link>
          </div>
        ) : track ? (
          <div className="max-w-[1172px]">
            {/* Track header */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
              {/* Cover */}
              <div className="w-full sm:w-[280px] lg:w-[340px] aspect-square rounded-[20px] overflow-hidden shrink-0 border-2 border-white/10">
                <img src={coverUrl} alt={track.title} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col gap-[16px] sm:gap-[24px] pt-2 sm:pt-6">
                {track.genre && (
                  <span className="inline-flex items-center self-start h-[32px] px-[20px] rounded-full bg-white/5 font-sans font-medium text-[14px] text-white leading-[30px]">
                    {track.genre}
                  </span>
                )}
                <h1 className="font-display text-[28px] sm:text-[36px] lg:text-[44px] text-white leading-tight">
                  {track.title}
                </h1>
                <p className="font-sans text-[16px] sm:text-[18px] text-white/60 leading-[30px]">
                  by {track.artistUser?.username || track.artist}
                  {track.artistUser?.isVerified && (
                    <svg className="inline-block ml-2 w-[16px] h-[16px]" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#4CBAFF"/><path d="M5 8l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-4 sm:gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="font-sans text-[12px] text-white/40 uppercase">Streams</span>
                    <span className="font-sans font-semibold text-[20px] text-white">{(track.totalStreams || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-sans text-[12px] text-white/40 uppercase">Editions</span>
                    <span className="font-sans font-semibold text-[20px] text-white">{track.mintedEditions}/{track.maxEditions}</span>
                  </div>
                  {track.streamingPrice && (
                    <div className="flex flex-col gap-1">
                      <span className="font-sans text-[12px] text-white/40 uppercase">Stream Price</span>
                      <span className="font-sans font-semibold text-[20px] text-brand-blue">{track.streamingPrice} BSD</span>
                    </div>
                  )}
                  {track.nftPrice && (
                    <div className="flex flex-col gap-1">
                      <span className="font-sans text-[12px] text-white/40 uppercase">NFT Price</span>
                      <span className="font-sans font-semibold text-[20px] text-brand-blue">{track.nftPrice} BSD</span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-4 mt-2">
                  <Link href="/explore" className="h-[48px] px-[30px] rounded-full border-2 border-white text-white font-sans font-medium text-[16px] flex items-center justify-center hover:bg-white/5 transition-colors">
                    Back to Explore
                  </Link>
                </div>
              </div>
            </div>

            {/* Description */}
            {track.description && (
              <div className="mt-[40px] sm:mt-[60px]">
                <h2 className="font-display text-[20px] text-white mb-[16px]">About this track</h2>
                <p className="font-sans text-[16px] text-white/70 leading-[28px] max-w-[700px]">
                  {track.description}
                </p>
              </div>
            )}

            {/* Audio Player */}
            {isConnected && (
              <div className="mt-[40px] sm:mt-[60px]">
                <h2 className="font-display text-[20px] text-white mb-[16px]">Player</h2>
                <MusicPlayer
                  trackUrl={streamUrl}
                  title={track.title}
                  artist={track.artistUser?.username || track.artist}
                  coverImage={coverUrl}
                />
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
