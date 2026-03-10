'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { trackApi } from '@/lib/api';
import TrackCard from '@/components/TrackCard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// --- Sub-components ---

function TrendingNavbar() {
  const pathname = usePathname();
  const navItems = [
    { href: '/explore', label: 'Explore' },
    { href: '/artist', label: 'Artist' },
    { href: '/profile', label: 'Profile' },
    { href: '/trending', label: 'Trending' },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-[164px] py-[39px]">
      <div className="flex items-center gap-[173px]">
        <Link href="/" className="font-logo text-[30px] text-white whitespace-nowrap">
          Backstreet Dogs
        </Link>
        <div className="flex items-center gap-[30px]">
          <div className="flex items-center gap-[44px] font-sans font-medium text-[18px] leading-[30px] text-white">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:opacity-80 transition-opacity ${
                  pathname === item.href ? 'opacity-100' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <ConnectButton.Custom>
            {({ openConnectModal, account, mounted }) => {
              if (!mounted || !account) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="btn-gradient-sm !py-[21px] !px-[70px] text-[18px]"
                  >
                    Connect Wallet
                  </button>
                );
              }
              return (
                <div className="btn-gradient-sm !py-[21px] !px-[40px] text-[18px] cursor-default">
                  {account.displayName}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </nav>
  );
}

function TrendingTrackRow({
  rank,
  track,
  change,
}: {
  rank: number;
  track: any;
  change: 'up' | 'down' | 'same';
}) {
  const coverUrl = track.coverImage
    ? `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${track.coverImage}`
    : '/placeholder-cover.png';

  return (
    <Link href={`/track/${track.id}`}>
      <div className="flex items-center gap-[20px] py-[20px] px-[24px] rounded-[14px] hover:bg-white/5 transition-colors group cursor-pointer">
        {/* Rank */}
        <div className="w-[50px] flex items-center gap-[8px]">
          <span className="font-stencil text-[28px] text-white/80 leading-none">{String(rank).padStart(2, '0')}</span>
        </div>

        {/* Change indicator */}
        <div className="w-[20px] flex items-center justify-center">
          {change === 'up' && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2L10 8H2L6 2Z" fill="#4ADE80" />
            </svg>
          )}
          {change === 'down' && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 10L2 4H10L6 10Z" fill="#F87171" />
            </svg>
          )}
          {change === 'same' && (
            <div className="w-[8px] h-[2px] bg-white/30 rounded-full" />
          )}
        </div>

        {/* Cover */}
        <div className="w-[64px] h-[64px] rounded-[12px] overflow-hidden shrink-0">
          <img src={coverUrl} alt={track.title} className="w-full h-full object-cover" />
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <p className="font-sans font-medium text-[16px] text-white leading-[22px] truncate">{track.title}</p>
          <p className="font-sans text-[14px] text-white/50 leading-[20px] truncate">{track.artist || 'Unknown Artist'}</p>
        </div>

        {/* Genre */}
        <span className="font-sans text-[14px] text-white/50 w-[100px] text-center">{track.genre || '—'}</span>

        {/* Streams */}
        <div className="w-[120px] text-right">
          <span className="font-sans font-medium text-[14px] text-white">{(track.totalStreams || 0).toLocaleString()}</span>
          <span className="font-sans text-[12px] text-white/30 ml-[4px]">streams</span>
        </div>

        {/* Price */}
        <span className="font-sans font-medium text-[14px] text-brand-blue w-[100px] text-right">
          {track.streamingPrice ? `${track.streamingPrice} BSD` : 'Free'}
        </span>
      </div>
    </Link>
  );
}

function TopArtistCard({
  rank,
  name,
  genre,
  tracks,
}: {
  rank: number;
  name: string;
  genre: string;
  tracks: number;
}) {
  return (
    <div className="flex items-center gap-[16px] bg-brand-bg border-2 border-white rounded-[20px] p-[20px] hover:border-brand-blue/50 transition-colors">
      <span className="font-stencil text-[32px] text-white/30 w-[40px]">{rank}</span>
      <div className="w-[56px] h-[56px] rounded-full bg-gradient-to-br from-brand-blue/30 to-brand-red/30 flex items-center justify-center shrink-0">
        <span className="font-display text-[18px] text-white">{name.charAt(0)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans font-medium text-[16px] text-white leading-[22px] truncate">{name}</p>
        <p className="font-sans text-[14px] text-white/50 leading-[20px]">{genre}</p>
      </div>
      <div className="text-right">
        <p className="font-sans font-semibold text-[16px] text-white">{tracks}</p>
        <p className="font-sans text-[12px] text-white/30">tracks</p>
      </div>
    </div>
  );
}

function StatHighlight({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="flex-1 flex flex-col items-center gap-[8px] py-[30px]">
      <span className="font-stencil text-[56px] text-white leading-none">{value}</span>
      <span className="font-sans font-medium text-[14px] text-white/60 leading-[26px]">{label}</span>
    </div>
  );
}

function CTABanner() {
  return (
    <div className="relative w-[1172px] h-[320px] mx-auto">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[1169px] h-[294px] bg-brand-blue border-[5px] border-brand-blue rounded-[4px] rotate-[1.27deg]" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[1169px] h-[294px] bg-brand-red border-[8px] border-brand-red rounded-[4px] -rotate-[1.1deg]" />
      </div>
      <div className="absolute inset-0 flex items-center justify-between px-[39px] md:px-[91px]">
        <div className="flex flex-col gap-[30px] max-w-[604px] text-white z-10">
          <h2 className="font-display text-[35px] leading-normal">
            Discover music before everyone else
          </h2>
          <p className="font-sans font-normal text-[16px] leading-[26px] max-w-[526px]">
            Support underground artists. Own exclusive tracks. Build your collection.
          </p>
        </div>
        <Link
          href="/explore"
          className="relative bg-white rounded-full px-[73px] py-[26px] z-10"
        >
          <span className="font-sans font-semibold text-[18px] leading-[30px] text-[#252525]">
            Explore Music
          </span>
          <span className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_-1px_-1px_4px_rgba(0,0,0,0.25),inset_0_4px_4px_rgba(0,0,0,0.25)]" />
        </Link>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="w-[1230px] mx-auto">
      <div className="flex items-center gap-[125px] py-[18px]">
        <p className="font-logo text-[30px] text-white w-[227px]">Backstreet Dogs</p>
        <div className="flex gap-[26px] items-start">
          <div className="flex gap-[11px] items-center">
            <img src="/images/artist/icon-audit.png" alt="" className="w-[40px] h-[40px]" />
            <p className="font-sans text-[16px] text-white leading-[21px] w-[150px]">Smart Contract Audited</p>
          </div>
          <div className="flex gap-[16px] items-center">
            <img src="/images/artist/icon-blockchain.png" alt="" className="w-[40px] h-[36px]" />
            <p className="font-sans text-[16px] text-white leading-[21px] w-[150px]">Built on Base Blockchain</p>
          </div>
          <div className="flex gap-[12px] items-center">
            <img src="/images/artist/icon-paid.png" alt="" className="w-[40px] h-[40px]" />
            <p className="font-sans text-[16px] text-white leading-[21px] w-[150px]">$500K+ Paid to Artists</p>
          </div>
          <div className="flex gap-[10px] items-center">
            <img src="/images/artist/icon-worldwide.png" alt="" className="w-[40px] h-[40px]" />
            <p className="font-sans text-[16px] text-white leading-[21px] w-[81px]">Available Worldwide</p>
          </div>
        </div>
      </div>
      <div className="gradient-divider my-[30px]" />
      <div className="flex gap-[93px] items-start">
        <div className="flex flex-col gap-[25px] w-[519px]">
          <h3 className="font-display text-[20px] text-white">About us</h3>
          <p className="font-sans text-[18px] text-white leading-[30px]">
            The first platform where musicians keep 90% of streaming revenue and 97.5% of sales. No labels. No middlemen. Just music.
          </p>
        </div>
        <div className="flex flex-col gap-[31px] w-[531px]">
          <h3 className="font-display text-[20px] text-white">Explore</h3>
          <div className="flex flex-col gap-[31px] font-sans font-medium text-[18px] text-white leading-[30px]">
            <div className="flex gap-[44px] items-center">
              <Link href="/explore" className="hover:opacity-80">Explore</Link>
              <Link href="/artist" className="hover:opacity-80">Artist</Link>
              <Link href="/profile" className="hover:opacity-80">Profile</Link>
              <span>Connect Wallet</span>
              <span>Policy</span>
            </div>
            <p>Terms &amp; Condition</p>
          </div>
        </div>
      </div>
      <div className="gradient-divider my-[30px]" />
      <div className="flex items-center justify-between pb-[40px]">
        <p className="font-sans text-[18px] text-white leading-[30px]">
          Copyright 2025. All right are Reserved. Backstreet Dogs
        </p>
        <div className="flex gap-[16px] items-center">
          <div className="flex gap-[19px] items-center">
            <img src="/images/artist/icon-facebook.png" alt="Facebook" className="w-[40px] h-[40px]" />
            <img src="/images/artist/icon-instagram.png" alt="Instagram" className="w-[40px] h-[40px]" />
          </div>
          <img src="/images/artist/icon-linkedin.png" alt="LinkedIn" className="w-[40px] h-[40px]" />
        </div>
      </div>
    </div>
  );
}

// --- Time period filter ---
const TIME_PERIODS = ['Today', 'This Week', 'This Month', 'All Time'] as const;
type TimePeriod = (typeof TIME_PERIODS)[number];

// --- Main Page ---

export default function TrendingPage() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('This Week');

  useEffect(() => {
    loadTrendingData();
  }, [timePeriod]);

  const loadTrendingData = async () => {
    try {
      setLoading(true);
      const response = await trackApi.getAll({ limit: 20 });
      const sorted = [...response.data].sort(
        (a: any, b: any) => (b.totalStreams || 0) - (a.totalStreams || 0)
      );
      setTracks(sorted);
    } catch (error) {
      console.error('Error loading trending data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChangeIndicator = (index: number): 'up' | 'down' | 'same' => {
    if (index < 3) return 'up';
    if (index > 7) return 'down';
    return 'same';
  };

  const topArtists = [
    { name: 'DJ Shadow', genre: 'Hip Hop / Electronic', tracks: 12 },
    { name: 'Luna Beats', genre: 'Indie / Ambient', tracks: 8 },
    { name: 'Metro Vinyl', genre: 'Jazz / Funk', tracks: 15 },
    { name: 'Neon Pulse', genre: 'EDM / Electronic', tracks: 6 },
    { name: 'Ruby Streets', genre: 'R&B / Pop', tracks: 10 },
  ];

  return (
    <div className="bg-brand-bg min-h-screen relative overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-[520px]">
        <div className="absolute inset-0 bg-brand-bg" />

        {/* Radial glow - blue */}
        <div className="absolute left-[15%] top-[80px] w-[500px] h-[500px] pointer-events-none">
          <div
            className="absolute inset-0 rounded-full opacity-40"
            style={{ background: 'radial-gradient(circle, #4CBAFF 0%, transparent 55%)', filter: 'blur(187px)' }}
          />
        </div>
        {/* Radial glow - pink */}
        <div className="absolute right-[15%] top-[80px] w-[500px] h-[500px] pointer-events-none">
          <div
            className="absolute inset-0 rounded-full opacity-40"
            style={{ background: 'radial-gradient(circle, #FF4CA3 0%, transparent 55%)', filter: 'blur(187px)' }}
          />
        </div>

        <TrendingNavbar />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center pt-[168px]">
          {/* Fire icon */}
          <div className="w-[60px] h-[60px] mb-[30px]">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path d="M12 23c-4.97 0-9-3.58-9-8 0-3.19 2.13-6.01 3.5-7.5.31-.34.85-.09.85.34v1.66c0 1.1.9 2 2 2s2-.9 2-2V3.46c0-.47.49-.78.91-.56C16.42 5.07 21 9.58 21 15c0 4.42-4.03 8-9 8z" fill="url(#fire-grad)"/>
              <defs>
                <linearGradient id="fire-grad" x1="3" y1="23" x2="21" y2="3">
                  <stop stopColor="#F2134A"/>
                  <stop offset="1" stopColor="#FF6B35"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h1 className="font-heading text-[46px] text-white text-center mb-[14px]">
            Trending Now
          </h1>
          <p className="font-sans text-[16px] text-white/70 text-center leading-[30px] max-w-[600px]">
            The hottest tracks and artists on Backstreet Dogs right now
          </p>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="px-[164px] -mt-[20px] relative z-10">
        <div className="w-[1172px] border-2 border-white rounded-[20px] bg-brand-bg overflow-hidden">
          <div className="flex items-center">
            <StatHighlight value="1.2K" label="Tracks This Week" />
            <div className="w-[1px] h-[80px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <StatHighlight value="340" label="Active Artists" />
            <div className="w-[1px] h-[80px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <StatHighlight value="89K" label="Total Streams" />
            <div className="w-[1px] h-[80px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <StatHighlight value="$12K" label="Artist Earnings" />
          </div>
        </div>
      </section>

      {/* ===== TIME PERIOD FILTER ===== */}
      <section className="px-[164px] mt-[60px]">
        <div className="w-[1172px]">
          <div className="flex items-center gap-[10px]">
            {TIME_PERIODS.map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`h-[40px] px-[24px] rounded-full font-sans text-[14px] leading-[30px] transition-all duration-200 ${
                  timePeriod === period
                    ? 'bg-gradient-brand text-white border border-transparent'
                    : 'bg-brand-bg text-white border border-white hover:border-white/70'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRENDING TRACKS ===== */}
      <section className="px-[164px] mt-[50px]">
        <div className="w-[1172px]">
          <div className="flex items-center gap-[14px] mb-[40px]">
            <h2 className="font-heading text-[26px] text-white leading-[26px]">
              Top Tracks
            </h2>
            <div className="flex-1 gradient-divider" />
          </div>

          {loading ? (
            <div className="flex flex-col gap-[4px]">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-[20px] py-[20px] px-[24px] animate-pulse">
                  <div className="w-[50px] h-[28px] bg-dark-700 rounded" />
                  <div className="w-[20px] h-[12px] bg-dark-700 rounded" />
                  <div className="w-[64px] h-[64px] bg-dark-700 rounded-[12px]" />
                  <div className="flex-1">
                    <div className="h-4 bg-dark-700 rounded mb-2 w-1/3" />
                    <div className="h-3 bg-dark-700 rounded w-1/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : tracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[80px]">
              <div className="w-[78px] h-[86px] mb-[30px] opacity-30">
                <svg viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M14.85 5.74V39.56c-1.58-1.41-3.74-2.28-6.12-2.28C3.91 37.28 0 40.83 0 45.22c0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V15.63l28.09-4.84v23.03c-1.58-1.41-3.74-2.28-6.12-2.28-4.82 0-8.73 3.55-8.73 7.94 0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V0L14.85 5.74Z" fill="white"/>
                </svg>
              </div>
              <p className="font-sans text-[18px] text-white/50 mb-[12px]">No trending tracks yet</p>
              <p className="font-sans text-[14px] text-white/30">Check back soon for the latest hits</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* List Header */}
              <div className="flex items-center gap-[20px] py-[12px] px-[24px] border-b border-white/10 mb-[4px]">
                <span className="font-sans text-[12px] text-white/30 uppercase w-[50px]">Rank</span>
                <span className="w-[20px]" />
                <span className="font-sans text-[12px] text-white/30 uppercase w-[64px]">Cover</span>
                <span className="font-sans text-[12px] text-white/30 uppercase flex-1">Track</span>
                <span className="font-sans text-[12px] text-white/30 uppercase w-[100px] text-center">Genre</span>
                <span className="font-sans text-[12px] text-white/30 uppercase w-[120px] text-right">Streams</span>
                <span className="font-sans text-[12px] text-white/30 uppercase w-[100px] text-right">Price</span>
              </div>
              {tracks.map((track: any, idx: number) => (
                <TrendingTrackRow
                  key={track.id}
                  rank={idx + 1}
                  track={track}
                  change={getChangeIndicator(idx)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== TOP ARTISTS ===== */}
      <section className="px-[164px] mt-[80px]">
        <div className="w-[1172px]">
          <div className="flex items-center gap-[14px] mb-[40px]">
            <h2 className="font-heading text-[26px] text-white leading-[26px]">
              Top Artists
            </h2>
            <div className="flex-1 gradient-divider" />
          </div>

          <div className="grid grid-cols-2 gap-[16px]">
            {topArtists.map((artist, idx) => (
              <TopArtistCard
                key={artist.name}
                rank={idx + 1}
                name={artist.name}
                genre={artist.genre}
                tracks={artist.tracks}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED TRACKS GRID ===== */}
      {tracks.length > 0 && (
        <section className="px-[164px] mt-[80px]">
          <div className="w-[1172px]">
            <div className="flex items-center gap-[14px] mb-[40px]">
              <h2 className="font-heading text-[26px] text-white leading-[26px]">
                Hot Picks
              </h2>
              <div className="flex-1 gradient-divider" />
              <Link
                href="/explore"
                className="font-sans text-[14px] text-brand-blue hover:text-brand-blue/80 transition-colors flex items-center gap-[8px]"
              >
                View All
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-x-[40px] gap-y-[41px]">
              {tracks.slice(0, 6).map((track: any) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== GRUNGE TEXTURE ===== */}
      <div className="relative w-full h-[229px] overflow-hidden opacity-30 mt-[80px] -mx-[29px]">
        <img
          src="/images/artist/texture-grunge.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* ===== CTA SECTION ===== */}
      <div className="py-[54px]">
        <CTABanner />
      </div>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
}
