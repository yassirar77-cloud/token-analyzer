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
          <ConnectButton.Custom>
            {({ openConnectModal, account, mounted }) => {
              if (!mounted || !account) {
                return <button onClick={openConnectModal} className="btn-gradient-sm text-[16px]">Connect Wallet</button>;
              }
              return <div className="btn-gradient-sm text-[16px] cursor-default text-center">{account.displayName}</div>;
            }}
          </ConnectButton.Custom>
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

      {/* Grunge texture */}
      <div className="relative w-full h-[229px] overflow-hidden opacity-30 mt-[50px] lg:mt-[80px]">
        <img src="/images/artist/texture-grunge.png" alt="" className="w-full h-full object-cover" />
      </div>

      {/* CTA Section */}
      <div className="py-[30px] lg:py-[54px]">
        <div className="relative w-full max-w-[1172px] min-h-[250px] lg:h-[320px] mx-auto px-4 md:px-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[calc(100%-8px)] lg:w-[1169px] h-[85%] lg:h-[294px] bg-brand-blue border-[3px] sm:border-[5px] border-brand-blue rounded-[4px] rotate-[1.27deg]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[calc(100%-8px)] lg:w-[1169px] h-[85%] lg:h-[294px] bg-brand-red border-4 sm:border-[8px] border-brand-red rounded-[4px] -rotate-[1.1deg]" />
          </div>
          <div className="absolute inset-0 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 md:px-[91px] gap-6">
            <div className="flex flex-col gap-[20px] lg:gap-[30px] max-w-[604px] text-white z-10 text-center sm:text-left">
              <h2 className="font-display text-[24px] sm:text-[30px] lg:text-[35px] leading-normal">
                Discover music before everyone else
              </h2>
              <p className="font-sans font-normal text-[14px] sm:text-[16px] leading-[26px] max-w-[526px]">
                Support underground artists. Own exclusive tracks. Build your collection.
              </p>
            </div>
            <Link href="/explore" className="relative bg-white rounded-full px-8 sm:px-[50px] lg:px-[73px] py-4 lg:py-[26px] z-10 whitespace-nowrap">
              <span className="font-sans font-semibold text-[16px] lg:text-[18px] leading-[30px] text-[#252525]">Explore Music</span>
              <span className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_-1px_-1px_4px_rgba(0,0,0,0.25),inset_0_4px_4px_rgba(0,0,0,0.25)]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-[1230px] mx-auto px-4 md:px-8 lg:px-0">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 lg:gap-[125px] py-[18px]">
          <p className="font-logo text-[24px] lg:text-[30px] text-white">Backstreet Dogs</p>
          <div className="grid grid-cols-2 sm:flex gap-4 lg:gap-[26px] items-start">
            <div className="flex gap-[11px] items-center">
              <svg className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="white" fillOpacity="0.1"/><path d="M20 10L22.35 16.65L29.5 17.25L24 22.1L25.7 29.5L20 25.85L14.3 29.5L16 22.1L10.5 17.25L17.65 16.65L20 10Z" fill="white"/></svg>
              <p className="font-sans text-[14px] sm:text-[16px] text-white leading-[21px]">Smart Contract Audited</p>
            </div>
            <div className="flex gap-[11px] items-center">
              <svg className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="white" fillOpacity="0.1"/><path d="M12 14h16v2H12v-2zm0 5h16v2H12v-2zm0 5h16v2H12v-2zm-2-12v16h20V12H10z" fill="white"/></svg>
              <p className="font-sans text-[14px] sm:text-[16px] text-white leading-[21px]">Built on Base Blockchain</p>
            </div>
            <div className="flex gap-[11px] items-center">
              <svg className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="white" fillOpacity="0.1"/><path d="M20 10c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm1 17.93c-.32.05-.66.07-1 .07s-.68-.02-1-.07V25h2v2.93zM17 20c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3zm7.9 6.49A8.02 8.02 0 0027.93 21H25v-2h2.93A8.02 8.02 0 0024.9 13.51 4.98 4.98 0 0121 17v-2.93c.34-.05.66-.07 1-.07s.68.02 1 .07V17a4.98 4.98 0 01-3.9-3.49A8.02 8.02 0 0012.07 19H15v2h-2.93a8.02 8.02 0 003.03 5.49A4.98 4.98 0 0119 23v2.93c-.34.05-.66.07-1 .07s-.68-.02-1-.07V23a4.98 4.98 0 013.9 3.49z" fill="white"/></svg>
              <p className="font-sans text-[14px] sm:text-[16px] text-white leading-[21px]">$500K+ Paid to Artists</p>
            </div>
            <div className="flex gap-[10px] items-center">
              <svg className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="white" fillOpacity="0.1"/><circle cx="20" cy="20" r="9" stroke="white" strokeWidth="2" fill="none"/><ellipse cx="20" cy="20" rx="4" ry="9" stroke="white" strokeWidth="1.5" fill="none"/><line x1="11" y1="20" x2="29" y2="20" stroke="white" strokeWidth="1.5"/></svg>
              <p className="font-sans text-[14px] sm:text-[16px] text-white leading-[21px]">Available Worldwide</p>
            </div>
          </div>
        </div>
        <div className="gradient-divider my-[20px] lg:my-[30px]" />
        <div className="flex flex-col md:flex-row gap-8 lg:gap-[93px] items-start">
          <div className="flex flex-col gap-[25px] w-full md:max-w-[519px]">
            <h3 className="font-display text-[20px] text-white">About us</h3>
            <p className="font-sans text-[16px] lg:text-[18px] text-white leading-[30px]">
              The first platform where musicians keep 90% of streaming revenue and 97.5% of sales. No labels. No middlemen. Just music.
            </p>
          </div>
          <div className="flex flex-col gap-[25px] lg:gap-[31px] w-full md:max-w-[531px]">
            <h3 className="font-display text-[20px] text-white">Explore</h3>
            <div className="flex flex-col gap-[25px] lg:gap-[31px] font-sans font-medium text-[16px] lg:text-[18px] text-white leading-[30px]">
              <div className="flex flex-wrap gap-4 lg:gap-[44px] items-center">
                <Link href="/explore" className="hover:opacity-80">Explore</Link>
                <Link href="/artist" className="hover:opacity-80">Artist</Link>
                <Link href="/profile" className="hover:opacity-80">Profile</Link>
                <span>Connect Wallet</span>
                <Link href="/privacy" className="hover:opacity-80">Privacy Policy</Link>
              </div>
              <Link href="/terms" className="hover:opacity-80">Terms &amp; Conditions</Link>
            </div>
          </div>
        </div>
        <div className="gradient-divider my-[20px] lg:my-[30px]" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-[40px]">
          <p className="font-sans text-[14px] sm:text-[16px] lg:text-[18px] text-white leading-[30px] text-center sm:text-left">
            Copyright {new Date().getFullYear()}. All rights reserved. Backstreet Dogs
          </p>
          <div className="flex gap-[16px] items-center">
            <div className="flex gap-[19px] items-center">
              <a href="#" aria-label="Facebook" className="w-[40px] h-[40px] rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-[40px] h-[40px] rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="white" stroke="none"/></svg>
              </a>
            </div>
            <a href="#" aria-label="LinkedIn" className="w-[40px] h-[40px] rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2V9zm2-6a2 2 0 110 4 2 2 0 010-4z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
