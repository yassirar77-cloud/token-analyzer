'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown, X, Menu } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { trackApi, TrackData } from '@/lib/api';
import TrackCard from '@/components/TrackCard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// --- Sub-components ---

function ExploreNavbar() {
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

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-[30px]">
          <div className="flex items-center gap-[24px] lg:gap-[44px] font-sans font-medium text-[16px] lg:text-[18px] leading-[30px] text-white">
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
                    className="btn-gradient-sm !py-[16px] lg:!py-[21px] !px-[30px] lg:!px-[70px] text-[16px] lg:text-[18px]"
                  >
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

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-bg/95 backdrop-blur-sm mt-4 px-4 py-4 rounded-lg flex flex-col gap-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-white text-lg font-sans font-medium py-2" onClick={() => setMobileMenuOpen(false)}>{item.label}</Link>
          ))}
          <ConnectButton.Custom>
            {({ openConnectModal, account, mounted }) => {
              if (!mounted || !account) {
                return (
                  <button onClick={openConnectModal} className="btn-gradient-sm text-[16px]">
                    Connect Wallet
                  </button>
                );
              }
              return (
                <div className="btn-gradient-sm text-[16px] cursor-default text-center">
                  {account.displayName}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      )}
    </nav>
  );
}

function CTABanner() {
  return (
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
        <Link
          href="/explore"
          className="relative bg-white rounded-full px-8 sm:px-[50px] lg:px-[73px] py-4 lg:py-[26px] z-10 whitespace-nowrap"
        >
          <span className="font-sans font-semibold text-[16px] lg:text-[18px] leading-[30px] text-[#252525]">
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
    <div className="w-full max-w-[1230px] mx-auto px-4 md:px-8 lg:px-0">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 lg:gap-[125px] py-[18px]">
        <p className="font-logo text-[24px] lg:text-[30px] text-white">Backstreet Dogs</p>
        <div className="grid grid-cols-2 sm:flex gap-4 lg:gap-[26px] items-start">
          <div className="flex gap-[11px] items-center">
            <img src="/images/artist/icon-audit.png" alt="" className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]" />
            <p className="font-sans text-[14px] sm:text-[16px] text-white leading-[21px]">Smart Contract Audited</p>
          </div>
          <div className="flex gap-[11px] items-center">
            <img src="/images/artist/icon-blockchain.png" alt="" className="w-[30px] h-[27px] sm:w-[40px] sm:h-[36px]" />
            <p className="font-sans text-[14px] sm:text-[16px] text-white leading-[21px]">Built on Base Blockchain</p>
          </div>
          <div className="flex gap-[11px] items-center">
            <img src="/images/artist/icon-paid.png" alt="" className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]" />
            <p className="font-sans text-[14px] sm:text-[16px] text-white leading-[21px]">$500K+ Paid to Artists</p>
          </div>
          <div className="flex gap-[10px] items-center">
            <img src="/images/artist/icon-worldwide.png" alt="" className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]" />
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
            <img src="/images/artist/icon-facebook.png" alt="Facebook" className="w-[40px] h-[40px]" />
            <img src="/images/artist/icon-instagram.png" alt="Instagram" className="w-[40px] h-[40px]" />
          </div>
          <img src="/images/artist/icon-linkedin.png" alt="LinkedIn" className="w-[40px] h-[40px]" />
        </div>
      </div>
    </div>
  );
}

// --- Genre pills for the filter bar ---
function GenrePill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-[40px] px-[16px] sm:px-[20px] rounded-full font-sans text-[13px] sm:text-[14px] leading-[30px] transition-all duration-200 ${
        active
          ? 'bg-gradient-brand text-white border border-transparent'
          : 'bg-brand-bg text-white border border-white hover:border-white/70'
      }`}
    >
      {label}
    </button>
  );
}

// --- Track row item for list view ---
function TrackRow({
  index,
  track,
}: {
  index: number;
  track: TrackData;
}) {
  const coverUrl = track.coverImage
    ? `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${track.coverImage}`
    : '/placeholder-cover.png';

  return (
    <Link href={`/track/${track.id}`}>
      <div className="flex items-center gap-3 sm:gap-[20px] py-[12px] sm:py-[16px] px-3 sm:px-[20px] rounded-[14px] hover:bg-white/5 transition-colors group cursor-pointer">
        <span className="font-sans text-[16px] text-white/50 w-[30px] text-center">{index}</span>
        <div className="w-[40px] h-[40px] sm:w-[56px] sm:h-[56px] rounded-[10px] overflow-hidden shrink-0">
          <img src={coverUrl} alt={track.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans font-medium text-[14px] sm:text-[16px] text-white leading-[22px] truncate">{track.title}</p>
          <p className="font-sans text-[12px] sm:text-[14px] text-white/50 leading-[20px] truncate">{track.artist || 'Unknown Artist'}</p>
        </div>
        <span className="font-sans text-[14px] text-white/50 w-[80px] text-center hidden sm:inline">{track.genre || '—'}</span>
        <span className="font-sans font-medium text-[14px] text-white w-auto sm:w-[100px] text-right whitespace-nowrap">
          {track.streamingPrice ? `${track.streamingPrice} BSD` : 'Free'}
        </span>
      </div>
    </Link>
  );
}

// --- Main Page ---

const genres = ['All', 'Hip Hop', 'Rock', 'Electronic', 'Jazz', 'R&B', 'Pop', 'Indie'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

export default function ExplorePage() {
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadTracks();
  }, [selectedGenre, sortBy]);

  const loadTracks = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string | number> = { limit: 50 };

      if (selectedGenre !== 'All') {
        params.genre = selectedGenre;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await trackApi.getAll(params);
      let fetchedTracks = response.data;

      if (sortBy === 'popular') {
        fetchedTracks.sort((a, b) => b.totalStreams - a.totalStreams);
      } else if (sortBy === 'price-low') {
        fetchedTracks.sort((a, b) =>
          parseFloat(a.streamingPrice || '0') - parseFloat(b.streamingPrice || '0')
        );
      } else if (sortBy === 'price-high') {
        fetchedTracks.sort((a, b) =>
          parseFloat(b.streamingPrice || '0') - parseFloat(a.streamingPrice || '0')
        );
      }

      setTracks(fetchedTracks);
    } catch (err) {
      console.error('Error loading tracks:', err);
      setError('Failed to load tracks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadTracks();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery || selectedGenre !== 'All' || sortBy !== 'newest';

  return (
    <div className="bg-brand-bg min-h-screen relative overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-[400px] sm:h-[500px] lg:h-[597px]">
        <div className="absolute inset-0 bg-brand-bg pointer-events-none" />

        {/* Radial glow - blue */}
        <div className="absolute right-[10%] top-[60px] w-[250px] sm:w-[407px] h-[250px] sm:h-[407px] pointer-events-none">
          <div
            className="absolute inset-0 rounded-full opacity-50"
            style={{ background: 'radial-gradient(circle, #4CBAFF 0%, transparent 55%)', filter: 'blur(187px)' }}
          />
        </div>
        {/* Radial glow - pink */}
        <div className="absolute right-[2%] top-[60px] w-[250px] sm:w-[407px] h-[250px] sm:h-[407px] pointer-events-none">
          <div
            className="absolute inset-0 rounded-full opacity-50"
            style={{ background: 'radial-gradient(circle, #FF4CA3 0%, transparent 55%)', filter: 'blur(187px)' }}
          />
        </div>

        <ExploreNavbar />

        {/* Hero Content - centered */}
        <div className="relative z-10 flex flex-col items-center pt-[120px] sm:pt-[140px] lg:pt-[168px] px-4">
          {/* Music notes decoration */}
          <div className="w-[150px] sm:w-[238px] h-[40px] sm:h-[62px] mb-[30px] lg:mb-[45px]">
            <svg viewBox="0 0 238 62" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M70.85 5.74V39.56c-1.58-1.41-3.74-2.28-6.12-2.28-4.82 0-8.73 3.55-8.73 7.94 0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V15.63l28.09-4.84v23.03c-1.58-1.41-3.74-2.28-6.12-2.28-4.82 0-8.73 3.55-8.73 7.94 0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V0L70.85 5.74Z" fill="white"/>
              <path d="M148.85 5.74V39.56c-1.58-1.41-3.74-2.28-6.12-2.28-4.82 0-8.73 3.55-8.73 7.94 0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V15.63l28.09-4.84v23.03c-1.58-1.41-3.74-2.28-6.12-2.28-4.82 0-8.73 3.55-8.73 7.94 0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V0L148.85 5.74Z" fill="white"/>
            </svg>
          </div>

          <h1 className="font-heading text-[30px] sm:text-[38px] lg:text-[46px] text-white text-center max-w-[848px] mb-[14px]">
            Explore Music
          </h1>
          <p className="font-sans text-[14px] sm:text-[16px] text-white text-center leading-[30px]">
            Discover underground music from talented artists worldwide
          </p>
        </div>
      </section>

      {/* ===== SEARCH & FILTERS ===== */}
      <section className="relative z-10 px-4 md:px-8 lg:px-[164px] -mt-[20px]">
        <div className="w-full max-w-[1172px]">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-[24px]">
            <div className="relative w-full h-[56px] sm:h-[73px] rounded-[39px] border-2 border-white bg-brand-bg overflow-hidden flex items-center">
              <Search className="absolute left-[16px] sm:left-[24px] w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Search tracks, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full bg-transparent text-white font-sans text-[14px] sm:text-[16px] leading-[30px] pl-[44px] sm:pl-[56px] pr-[100px] sm:pr-[140px] focus:outline-none placeholder-white/40"
              />
              <button
                type="submit"
                className="absolute right-[8px] btn-gradient-sm !py-[10px] sm:!py-[14px] !px-[20px] sm:!px-[30px] text-[14px] sm:text-[16px]"
              >
                Search
              </button>
            </div>
          </form>

          {/* Genre Pills Row */}
          <div className="flex items-center gap-[8px] sm:gap-[10px] mb-[20px] flex-wrap">
            {genres.map((genre) => (
              <GenrePill
                key={genre}
                label={genre === 'All' ? 'All Genres' : genre}
                active={selectedGenre === genre}
                onClick={() => setSelectedGenre(genre)}
              />
            ))}
          </div>

          {/* Sort & View Controls */}
          <div className="flex flex-wrap items-center gap-[14px]">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none h-[40px] px-[16px] sm:px-[20px] pr-[40px] rounded-full border border-white bg-brand-bg text-white font-sans text-[13px] sm:text-[14px] leading-[30px] focus:outline-none cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-brand-bg">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-[14px] top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-[6px] ml-[10px]">
              <button
                onClick={() => setViewMode('grid')}
                className={`w-[36px] h-[36px] rounded-[8px] flex items-center justify-center transition-colors ${
                  viewMode === 'grid' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="0" y="0" width="7" height="7" rx="1" fill="white"/>
                  <rect x="9" y="0" width="7" height="7" rx="1" fill="white"/>
                  <rect x="0" y="9" width="7" height="7" rx="1" fill="white"/>
                  <rect x="9" y="9" width="7" height="7" rx="1" fill="white"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`w-[36px] h-[36px] rounded-[8px] flex items-center justify-center transition-colors ${
                  viewMode === 'list' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="0" y="0" width="16" height="3" rx="1" fill="white"/>
                  <rect x="0" y="5" width="16" height="3" rx="1" fill="white"/>
                  <rect x="0" y="10" width="16" height="3" rx="1" fill="white"/>
                </svg>
              </button>
            </div>

            {/* Track Count */}
            <div className="ml-auto">
              <span className="font-sans text-[14px] text-white/50 leading-[30px]">
                {tracks.length} Tracks Found
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRACKS SECTION ===== */}
      <section className="px-4 md:px-8 lg:px-[164px] mt-[50px] lg:mt-[80px]">
        <div className="w-full max-w-[1172px]">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-[30px] lg:mb-[50px]">
            <h2 className="font-heading text-[22px] lg:text-[26px] text-white leading-[26px]">
              Tracks Found
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-[9px] font-sans text-[14px] text-white/70 hover:text-white transition-colors"
              >
                Clear Filter
                <X className="w-[12px] h-[12px]" />
              </button>
            )}
          </div>

          {/* Tracks Display */}
          {loading ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[20px] lg:gap-x-[40px] gap-y-[30px] lg:gap-y-[41px]' : 'flex flex-col'}>
              {[...Array(viewMode === 'grid' ? 9 : 6)].map((_, i) => (
                <div key={i}>
                  {viewMode === 'grid' ? (
                    <div className="bg-brand-bg border-2 border-white/10 rounded-[20px] overflow-hidden animate-pulse">
                      <div className="aspect-square bg-dark-700" />
                      <div className="p-5">
                        <div className="h-4 bg-dark-700 rounded mb-3 w-3/4" />
                        <div className="h-3 bg-dark-700 rounded mb-4 w-1/2" />
                        <div className="h-3 bg-dark-700 rounded w-1/3" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-[20px] py-[16px] px-[20px] animate-pulse">
                      <div className="w-[30px] h-[20px] bg-dark-700 rounded" />
                      <div className="w-[56px] h-[56px] bg-dark-700 rounded-[10px]" />
                      <div className="flex-1">
                        <div className="h-4 bg-dark-700 rounded mb-2 w-1/3" />
                        <div className="h-3 bg-dark-700 rounded w-1/5" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-[60px] lg:py-[100px]">
              <p className="font-sans text-[18px] text-red-400 mb-[20px]">{error}</p>
              <button
                onClick={loadTracks}
                className="btn-gradient-sm !py-[14px] !px-[30px] text-[16px]"
              >
                Retry
              </button>
            </div>
          ) : tracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[60px] lg:py-[100px]">
              <div className="w-[78px] h-[86px] mb-[30px] opacity-30">
                <svg viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M14.85 5.74V39.56c-1.58-1.41-3.74-2.28-6.12-2.28C3.91 37.28 0 40.83 0 45.22c0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V15.63l28.09-4.84v23.03c-1.58-1.41-3.74-2.28-6.12-2.28-4.82 0-8.73 3.55-8.73 7.94 0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V0L14.85 5.74Z" fill="white"/>
                </svg>
              </div>
              <p className="font-sans text-[18px] text-white/50 mb-[20px]">No tracks found</p>
              <button
                onClick={clearFilters}
                className="btn-gradient-sm !py-[14px] !px-[30px] text-[16px]"
              >
                Clear Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[20px] lg:gap-x-[40px] gap-y-[30px] lg:gap-y-[41px]">
              {tracks.map((track: TrackData) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col">
              {/* List Header */}
              <div className="hidden sm:flex items-center gap-[20px] py-[12px] px-[20px] border-b border-white/10 mb-[8px]">
                <span className="font-sans text-[12px] text-white/30 uppercase w-[30px] text-center">#</span>
                <span className="font-sans text-[12px] text-white/30 uppercase w-[56px]">Cover</span>
                <span className="font-sans text-[12px] text-white/30 uppercase flex-1">Title</span>
                <span className="font-sans text-[12px] text-white/30 uppercase w-[80px] text-center">Genre</span>
                <span className="font-sans text-[12px] text-white/30 uppercase w-[100px] text-right">Price</span>
              </div>
              {tracks.map((track: any, idx: number) => (
                <TrackRow key={track.id} index={idx + 1} track={track} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== GRUNGE TEXTURE ===== */}
      <div className="relative w-full h-[229px] overflow-hidden opacity-30 mt-[50px] lg:mt-[80px]">
        <img
          src="/images/artist/texture-grunge.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* ===== CTA SECTION ===== */}
      <div className="py-[30px] lg:py-[54px]">
        <CTABanner />
      </div>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
}
