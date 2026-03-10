'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ChevronDown, Music } from 'lucide-react';
import { trackApi } from '@/lib/api';
import toast from 'react-hot-toast';
import TrackCard from '@/components/TrackCard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// --- Sub-components ---

function ArtistNavbar() {
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
                className="hover:opacity-80 transition-opacity"
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

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center h-[32px] px-[20px] rounded-full bg-white/5 font-sans font-medium text-[14px] text-white leading-[30px] relative">
      {children}
      <span className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_-1px_-1px_4px_rgba(255,255,255,0.05),inset_0_4px_4px_rgba(255,255,255,0.05)]" />
    </span>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex-1 bg-brand-bg border-2 border-white rounded-[20px] p-[20px] flex flex-col gap-[14px]">
      {icon}
      <div className="flex flex-col gap-[9px] text-white">
        <p className="font-sans font-normal text-[14px] leading-[26px]">{label}</p>
        <p className="font-sans font-semibold text-[24px]">{value}</p>
      </div>
    </div>
  );
}

function GradientIcon({ src, size = 32 }: { src: string; size?: number }) {
  return (
    <div
      className="bg-gradient-card rounded-[8px] flex items-center justify-center p-[8px] relative shrink-0"
      style={{ width: size, height: size }}
    >
      <img src={src} alt="" className="w-4 h-4 object-contain" />
      <span className="absolute inset-0 rounded-[inherit] pointer-events-none shadow-[inset_-2px_-2px_4px_rgba(18,18,18,0.25)]" />
    </div>
  );
}

function CTABanner() {
  return (
    <div className="relative w-[1172px] h-[320px] mx-auto">
      {/* Blue tilted background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[1169px] h-[294px] bg-brand-blue border-[5px] border-brand-blue rounded-[4px] rotate-[1.27deg]" />
      </div>
      {/* Red tilted background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[1169px] h-[294px] bg-brand-red border-[8px] border-brand-red rounded-[4px] -rotate-[1.1deg]" />
      </div>
      {/* Content */}
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
      {/* Trust badges row */}
      <div className="flex items-center gap-[125px] py-[18px]">
        <p className="font-logo text-[30px] text-white w-[227px]">Backstreet Dogs</p>
        <div className="flex gap-[26px] items-start">
          <div className="flex gap-[11px] items-center">
            <img src="/images/artist/icon-audit.png" alt="" className="w-[40px] h-[40px]" />
            <p className="font-sans text-[16px] text-white leading-[21px] w-[150px]">
              Smart Contract Audited
            </p>
          </div>
          <div className="flex gap-[16px] items-center">
            <img src="/images/artist/icon-blockchain.png" alt="" className="w-[40px] h-[36px]" />
            <p className="font-sans text-[16px] text-white leading-[21px] w-[150px]">
              Built on Base Blockchain
            </p>
          </div>
          <div className="flex gap-[12px] items-center">
            <img src="/images/artist/icon-paid.png" alt="" className="w-[40px] h-[40px]" />
            <p className="font-sans text-[16px] text-white leading-[21px] w-[150px]">
              $500K+ Paid to Artists
            </p>
          </div>
          <div className="flex gap-[10px] items-center">
            <img src="/images/artist/icon-worldwide.png" alt="" className="w-[40px] h-[40px]" />
            <p className="font-sans text-[16px] text-white leading-[21px] w-[81px]">
              Available Worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="gradient-divider my-[30px]" />

      {/* About + Explore */}
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

      {/* Divider */}
      <div className="gradient-divider my-[30px]" />

      {/* Copyright + Social */}
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

const GENRE_OPTIONS = ['Hip Hop', 'Rock', 'Electronic', 'Jazz', 'R&B', 'Pop', 'Indie', 'Ambient', 'Folk', 'Funk', 'EDM', 'World'];

function UploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [genre, setGenre] = useState('');
  const [subGenre, setSubGenre] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
    } else {
      toast.error('Please drop an audio file');
    }
  };

  const handleSubmit = async () => {
    if (!audioFile) {
      toast.error('Please select an audio file');
      return;
    }
    if (!title.trim()) {
      toast.error('Please enter a track title');
      return;
    }

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('audio', audioFile);
      uploadData.append('title', title);
      uploadData.append('genre', genre);
      if (price) uploadData.append('streamingPrice', price);

      await trackApi.upload(uploadData);
      toast.success('Track uploaded successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Error uploading track:', error);
      toast.error(error.response?.data?.error || 'Failed to upload track');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-[50px]">
      {/* Row 1: Track Title + Price */}
      <div className="flex gap-[20px] w-full">
        <div className="flex-1 flex flex-col gap-[14px]">
          <p className="font-sans text-[16px] text-white/50 leading-[30px]">Track Title</p>
          <div className="h-[40px] rounded-full border border-white flex items-center px-[20px]">
            <input
              type="text"
              placeholder="Type here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-[#f0f0f0] font-sans text-[16px] leading-[30px] focus:outline-none placeholder-[#f0f0f0]/50"
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-[14px]">
          <p className="font-sans text-[16px] text-white/50 leading-[30px]">Price</p>
          <div className="h-[40px] rounded-full border border-white flex items-center px-[20px]">
            <input
              type="text"
              placeholder="Type here..."
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-transparent text-[#f0f0f0] font-sans text-[16px] leading-[30px] focus:outline-none placeholder-[#f0f0f0]/50"
            />
          </div>
        </div>
      </div>

      {/* Row 2: Two Genre Dropdowns */}
      <div className="flex gap-[20px] w-full">
        <div className="flex-1 flex flex-col gap-[14px]">
          <p className="font-sans text-[16px] text-white/50 leading-[30px] uppercase">Genres</p>
          <div className="relative h-[40px] rounded-full border border-white flex items-center px-[20px]">
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-transparent text-[#f0f0f0] font-sans text-[16px] leading-[30px] focus:outline-none appearance-none cursor-pointer"
            >
              <option value="" className="bg-brand-bg">Select</option>
              {GENRE_OPTIONS.map((g) => (
                <option key={g} value={g} className="bg-brand-bg">{g}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-[14px] top-1/2 -translate-y-1/2 w-[12px] h-[12px] text-white pointer-events-none" />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-[14px]">
          <p className="font-sans text-[16px] text-white/50 leading-[30px] uppercase">Genres</p>
          <div className="relative h-[40px] rounded-full border border-white flex items-center px-[20px]">
            <select
              value={subGenre}
              onChange={(e) => setSubGenre(e.target.value)}
              className="w-full bg-transparent text-[#f0f0f0] font-sans text-[16px] leading-[30px] focus:outline-none appearance-none cursor-pointer"
            >
              <option value="" className="bg-brand-bg">Select</option>
              {GENRE_OPTIONS.map((g) => (
                <option key={g} value={g} className="bg-brand-bg">{g}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-[14px] top-1/2 -translate-y-1/2 w-[12px] h-[12px] text-white pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Drag and Drop Area */}
      <div
        className={`h-[311px] rounded-[39px] border-2 border-white flex flex-col items-center justify-center px-[20px] transition-colors ${
          dragOver ? 'border-brand-blue bg-white/5' : ''
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
          className="hidden"
        />

        {audioFile ? (
          <div className="flex flex-col items-center gap-[20px]">
            <div className="w-[78px] h-[86px]">
              <svg viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M14.85 5.74V39.56c-1.58-1.41-3.74-2.28-6.12-2.28C3.91 37.28 0 40.83 0 45.22c0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V15.63l28.09-4.84v23.03c-1.58-1.41-3.74-2.28-6.12-2.28-4.82 0-8.73 3.55-8.73 7.94 0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V0L14.85 5.74Z" fill="white"/>
              </svg>
            </div>
            <p className="font-sans text-[14px] text-white text-center leading-[26px]">
              {audioFile.name}
            </p>
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="btn-gradient-sm !py-[21px] !px-[30px] text-[18px]"
            >
              {uploading ? 'Uploading...' : 'Upload Your Track'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-[30px]">
            <div className="w-[78px] h-[86px]">
              <svg viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M14.85 5.74V39.56c-1.58-1.41-3.74-2.28-6.12-2.28C3.91 37.28 0 40.83 0 45.22c0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V15.63l28.09-4.84v23.03c-1.58-1.41-3.74-2.28-6.12-2.28-4.82 0-8.73 3.55-8.73 7.94 0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V0L14.85 5.74Z" fill="white"/>
              </svg>
            </div>
            <p className="font-sans text-[14px] text-white text-center leading-[26px]">
              Drag and Drop your track here
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-gradient-sm !py-[21px] !px-[30px] text-[18px]"
            >
              Upload Your Track
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main Page ---

const TABS = ['Bio', 'Tracks', 'Earning', 'Upload'] as const;
type Tab = (typeof TABS)[number];

export default function ArtistDashboard() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>('Earning');
  const [tracks, setTracks] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalStreams: 0,
    totalRevenue: '0',
    totalTracks: 0,
    totalSales: 0,
    totalVotes: 26,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      loadArtistData();
    } else {
      setLoading(false);
    }
  }, [isConnected, address]);

  const loadArtistData = async () => {
    try {
      const response = await trackApi.getAll({ artistId: address });
      setTracks(response.data);

      let totalStreams = 0;
      let totalRevenue = 0;
      let totalSales = 0;

      for (const track of response.data) {
        const a = await trackApi.getAnalytics(track.id);
        totalStreams += a.data.streams || 0;
        totalRevenue += parseFloat(a.data.revenue || '0');
        totalSales += a.data.purchases || 0;
      }

      setAnalytics({
        totalStreams,
        totalRevenue: totalRevenue.toString(),
        totalTracks: response.data.length,
        totalSales,
        totalVotes: 26,
      });
    } catch (error) {
      console.error('Error loading artist data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen relative">
      {/* Hero Section */}
      <div className="relative h-[746px] w-full overflow-hidden">
        <img
          src="/images/artist/hero-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Radial gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(20,20,20,0) 0%, rgba(20,20,20,1) 100%)',
            opacity: 0.5,
          }}
        />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-brand-bg to-transparent" />
      </div>

      {/* Navbar */}
      <ArtistNavbar />

      {/* Artist Profile Info */}
      <div className="absolute top-[560px] left-[164px] z-10">
        <img
          src="/images/artist/avatar.png"
          alt="Artist avatar"
          className="w-[182px] h-[182px] rounded-full object-cover"
        />
      </div>
      <div className="absolute top-[623px] left-[402px] right-[164px] z-10 flex items-center justify-between">
        <div className="flex flex-col gap-[20px]">
          <p className="font-sans font-normal text-[16px] leading-[30px] text-white">
            GUITARIST
          </p>
          <h1 className="font-display text-[24px] text-white whitespace-nowrap">
            Jasmine Pennifold
          </h1>
        </div>
        <button
          onClick={() => setActiveTab('Upload')}
          className="btn-gradient-sm !py-[21px] !px-[30px] flex items-center gap-[10px] text-[18px]"
        >
          Upload Track
          <img src="/images/artist/icon-arrow-right.png" alt="" className="w-[10px] h-[17px]" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative px-[164px] mt-[80px]" style={{ marginTop: '80px' }}>
        <div className="flex gap-[86px] items-start w-[1172px]">
          {/* Left Sidebar - Artist Details */}
          <div className="flex flex-col gap-[48px] shrink-0">
            {/* Location */}
            <div className="flex flex-col gap-[14px] w-[160px]">
              <p className="font-sans text-[16px] text-white/50 leading-[30px] uppercase">
                Location
              </p>
              <div className="flex items-center gap-[10px]">
                <img src="/images/artist/icon-flag.png" alt="" className="w-[19px] h-[13px]" />
                <p className="font-sans font-medium text-[24px] text-white leading-[30px]">
                  London, Uk
                </p>
              </div>
            </div>

            {/* Languages */}
            <div className="flex flex-col gap-[14px]">
              <p className="font-sans text-[16px] text-white/50 leading-[30px]">
                LANGUAGES
              </p>
              <div className="flex gap-[6px]">
                <TagPill>English</TagPill>
                <TagPill>French</TagPill>
              </div>
            </div>

            {/* Instruments */}
            <div className="flex flex-col gap-[14px]">
              <p className="font-sans text-[16px] text-white/50 leading-[30px]">
                INSTRUMENTS
              </p>
              <div className="flex flex-col gap-[6px]">
                <div className="flex gap-[6px]">
                  <TagPill>Electric Guitar</TagPill>
                  <TagPill>Acoustic Guitar</TagPill>
                </div>
                <div className="flex gap-[6px]">
                  <TagPill>Banjo</TagPill>
                  <TagPill>Mandolin</TagPill>
                </div>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-col gap-[14px]">
              <p className="font-sans text-[16px] text-white/50 leading-[30px]">
                GENRES
              </p>
              <div className="flex flex-col gap-[6px]">
                <div className="flex gap-[6px]">
                  <TagPill>Jazz</TagPill>
                  <TagPill>Pop</TagPill>
                  <TagPill>Rock</TagPill>
                  <TagPill>World</TagPill>
                </div>
                <div className="flex gap-[6px]">
                  <TagPill>Commercial</TagPill>
                  <TagPill>EDM</TagPill>
                  <TagPill>Folk</TagPill>
                </div>
                <div className="flex gap-[6px]">
                  <TagPill>Funk</TagPill>
                  <TagPill>Ambient</TagPill>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Tabs + Content */}
          <div className="flex-1 min-w-0 w-[776px]">
            {/* Tabs */}
            <div className="flex flex-col gap-[20px]">
              <div className="flex gap-[45px] text-[16px] leading-[30px] text-white">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`font-sans transition-opacity ${
                      activeTab === tab
                        ? 'font-medium opacity-100'
                        : 'font-normal opacity-50 hover:opacity-75'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {/* Tab indicator bar */}
              <div className="relative h-[2px] bg-white/50 rounded-full">
                <div
                  className="absolute h-[2px] rounded-full bg-gradient-card transition-all duration-300"
                  style={{
                    width: '59px',
                    left: `${TABS.indexOf(activeTab) * (59 + 45)}px`,
                  }}
                />
              </div>
            </div>

            {/* Tab Content */}
            <div className="py-[50px]">
              {/* ===== BIO TAB ===== */}
              {activeTab === 'Bio' && (
                <div className="flex flex-col gap-[30px]">
                  <p className="font-sans text-[16px] text-white leading-[26px]">
                    Jasmine Pennifold is a London-based guitarist known for her genre-defying approach to music. Blending jazz improvisation with rock energy, world music textures, and electronic production, she creates a sound that is uniquely her own.
                  </p>
                  <p className="font-sans text-[16px] text-white leading-[26px]">
                    With over a decade of performing experience across venues in London, Paris, and beyond, Jasmine has built a reputation for captivating live performances and meticulously crafted studio recordings. Her work spans commercial pop arrangements to ambient soundscapes, always anchored by her virtuosic guitar work.
                  </p>
                  <p className="font-sans text-[16px] text-white leading-[26px]">
                    Jasmine joined Backstreet Dogs to connect directly with fans and maintain full ownership of her music. She believes in a future where artists earn what they deserve — no middlemen, no gatekeepers.
                  </p>
                </div>
              )}

              {/* ===== TRACKS TAB ===== */}
              {activeTab === 'Tracks' && (
                <div>
                  {tracks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-[60px]">
                      <div className="w-[78px] h-[86px] mb-[30px] opacity-30">
                        <svg viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <path d="M14.85 5.74V39.56c-1.58-1.41-3.74-2.28-6.12-2.28C3.91 37.28 0 40.83 0 45.22c0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V15.63l28.09-4.84v23.03c-1.58-1.41-3.74-2.28-6.12-2.28-4.82 0-8.73 3.55-8.73 7.94 0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V0L14.85 5.74Z" fill="white"/>
                        </svg>
                      </div>
                      <p className="font-sans text-[16px] text-white/50 mb-[20px]">No tracks uploaded yet</p>
                      <button
                        onClick={() => setActiveTab('Upload')}
                        className="btn-gradient-sm !py-[14px] !px-[30px] text-[16px]"
                      >
                        Upload Your First Track
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-[16px]">
                      {tracks.map((track: any) => (
                        <TrackCard key={track.id} track={track} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ===== EARNING TAB ===== */}
              {activeTab === 'Earning' && (
                <div className="flex flex-col gap-[16px]">
                  {/* Row 1: 3 cards */}
                  <div className="flex gap-[16px]">
                    <MetricCard
                      icon={
                        <img
                          src="/images/artist/icon-tracks.png"
                          alt=""
                          className="w-[30px] h-[32px]"
                        />
                      }
                      label="Total Tracks"
                      value={analytics.totalTracks}
                    />
                    <MetricCard
                      icon={<GradientIcon src="/images/artist/icon-streams.png" />}
                      label="Total Streams"
                      value={analytics.totalStreams}
                    />
                    <MetricCard
                      icon={<GradientIcon src="/images/artist/icon-revenue.png" />}
                      label="Total Revenue"
                      value={`${parseFloat(analytics.totalRevenue).toFixed(2)} BSD`}
                    />
                  </div>
                  {/* Row 2: 2 cards */}
                  <div className="flex gap-[16px]">
                    <MetricCard
                      icon={
                        <img
                          src="/images/artist/icon-votes.png"
                          alt=""
                          className="w-[32px] h-[32px]"
                        />
                      }
                      label="Your Votes"
                      value={analytics.totalVotes}
                    />
                    <MetricCard
                      icon={<GradientIcon src="/images/artist/icon-sales.png" size={32} />}
                      label="Total Sales"
                      value={analytics.totalSales}
                    />
                  </div>
                </div>
              )}

              {/* ===== UPLOAD TAB ===== */}
              {activeTab === 'Upload' && (
                <UploadForm
                  onSuccess={() => {
                    loadArtistData();
                    setActiveTab('Tracks');
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-[54px]">
        <CTABanner />
      </div>

      {/* Grunge texture decoration */}
      <div className="relative w-full h-[229px] overflow-hidden opacity-30 -mx-[29px]">
        <img
          src="/images/artist/texture-grunge.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}
