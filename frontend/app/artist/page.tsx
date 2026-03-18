'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ChevronDown, Menu, X as XIcon } from 'lucide-react';
import { trackApi, userApi, TrackData, UserProfile } from '@/lib/api';
import toast from 'react-hot-toast';
import TrackCard from '@/components/TrackCard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// --- Sub-components ---

function ArtistNavbar() {
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
          {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center h-[32px] px-[16px] sm:px-[20px] rounded-full bg-white/5 font-sans font-medium text-[13px] sm:text-[14px] text-white leading-[30px] relative">
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
    <div className="flex-1 min-w-[140px] bg-brand-bg border-2 border-white rounded-[20px] p-4 sm:p-[20px] flex flex-col gap-[14px]">
      {icon}
      <div className="flex flex-col gap-[9px] text-white">
        <p className="font-sans font-normal text-[12px] sm:text-[14px] leading-[26px]">{label}</p>
        <p className="font-sans font-semibold text-[18px] sm:text-[24px]">{value}</p>
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
  );
}

function Footer() {
  return (
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
    <div className="flex flex-col gap-[30px] sm:gap-[50px]">
      {/* Row 1: Track Title + Price */}
      <div className="flex flex-col sm:flex-row gap-[20px] w-full">
        <div className="flex-1 flex flex-col gap-[14px]">
          <p className="font-sans text-[14px] sm:text-[16px] text-white/50 leading-[30px]">Track Title</p>
          <div className="h-[40px] rounded-full border border-white flex items-center px-[16px] sm:px-[20px]">
            <input
              type="text"
              placeholder="Type here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-[#f0f0f0] font-sans text-[14px] sm:text-[16px] leading-[30px] focus:outline-none placeholder-[#f0f0f0]/50"
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-[14px]">
          <p className="font-sans text-[14px] sm:text-[16px] text-white/50 leading-[30px]">Price</p>
          <div className="h-[40px] rounded-full border border-white flex items-center px-[16px] sm:px-[20px]">
            <input
              type="text"
              placeholder="Type here..."
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-transparent text-[#f0f0f0] font-sans text-[14px] sm:text-[16px] leading-[30px] focus:outline-none placeholder-[#f0f0f0]/50"
            />
          </div>
        </div>
      </div>

      {/* Row 2: Two Genre Dropdowns */}
      <div className="flex flex-col sm:flex-row gap-[20px] w-full">
        <div className="flex-1 flex flex-col gap-[14px]">
          <p className="font-sans text-[14px] sm:text-[16px] text-white/50 leading-[30px] uppercase">Genres</p>
          <div className="relative h-[40px] rounded-full border border-white flex items-center px-[16px] sm:px-[20px]">
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-transparent text-[#f0f0f0] font-sans text-[14px] sm:text-[16px] leading-[30px] focus:outline-none appearance-none cursor-pointer"
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
          <p className="font-sans text-[14px] sm:text-[16px] text-white/50 leading-[30px] uppercase">Genres</p>
          <div className="relative h-[40px] rounded-full border border-white flex items-center px-[16px] sm:px-[20px]">
            <select
              value={subGenre}
              onChange={(e) => setSubGenre(e.target.value)}
              className="w-full bg-transparent text-[#f0f0f0] font-sans text-[14px] sm:text-[16px] leading-[30px] focus:outline-none appearance-none cursor-pointer"
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
        className={`h-[250px] sm:h-[311px] rounded-[20px] sm:rounded-[39px] border-2 border-white flex flex-col items-center justify-center px-[20px] transition-colors ${
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
            <div className="w-[60px] sm:w-[78px] h-[66px] sm:h-[86px]">
              <svg viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M14.85 5.74V39.56c-1.58-1.41-3.74-2.28-6.12-2.28C3.91 37.28 0 40.83 0 45.22c0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V15.63l28.09-4.84v23.03c-1.58-1.41-3.74-2.28-6.12-2.28-4.82 0-8.73 3.55-8.73 7.94 0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V0L14.85 5.74Z" fill="white"/>
              </svg>
            </div>
            <p className="font-sans text-[14px] text-white text-center leading-[26px] break-all max-w-full">
              {audioFile.name}
            </p>
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="btn-gradient-sm !py-[16px] sm:!py-[21px] !px-[30px] text-[16px] sm:text-[18px]"
            >
              {uploading ? 'Uploading...' : 'Upload Your Track'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-[20px] sm:gap-[30px]">
            <div className="w-[60px] sm:w-[78px] h-[66px] sm:h-[86px]">
              <svg viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M14.85 5.74V39.56c-1.58-1.41-3.74-2.28-6.12-2.28C3.91 37.28 0 40.83 0 45.22c0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V15.63l28.09-4.84v23.03c-1.58-1.41-3.74-2.28-6.12-2.28-4.82 0-8.73 3.55-8.73 7.94 0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V0L14.85 5.74Z" fill="white"/>
              </svg>
            </div>
            <p className="font-sans text-[14px] text-white text-center leading-[26px]">
              Drag and Drop your track here
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-gradient-sm !py-[16px] sm:!py-[21px] !px-[30px] text-[16px] sm:text-[18px]"
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
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
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
      // Load profile
      try {
        const profileRes = await userApi.getProfile();
        setProfile(profileRes.data);
      } catch {
        // Not authenticated yet — profile will be null
      }

      const response = await trackApi.getAll({ artistId: address });
      setTracks(response.data);

      let totalStreams = 0;
      let totalRevenue = 0;
      let totalSales = 0;

      for (const track of response.data) {
        try {
          const a = await trackApi.getAnalytics(track.id);
          totalStreams += a.data.streams || 0;
          totalRevenue += parseFloat(a.data.revenue || '0');
          totalSales += a.data.purchases || 0;
        } catch {
          // Analytics may require auth — skip if not available
        }
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
      <div className="relative h-[400px] sm:h-[550px] lg:h-[746px] w-full overflow-hidden">
        <img
          src="/images/artist/hero-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(20,20,20,0) 0%, rgba(20,20,20,1) 100%)',
            opacity: 0.5,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-brand-bg to-transparent pointer-events-none" />
      </div>

      {/* Navbar */}
      <ArtistNavbar />

      {/* Artist Profile Info - relative positioning for mobile */}
      <div className="relative px-4 md:px-8 lg:px-[164px] -mt-[100px] sm:-mt-[140px] lg:-mt-[186px] z-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-8">
          <img
            src={profile?.profileImage || '/images/artist/avatar.png'}
            alt="Artist avatar"
            className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] lg:w-[182px] lg:h-[182px] rounded-full object-cover shrink-0"
          />
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between flex-1 gap-4 text-center sm:text-left w-full">
            <div className="flex flex-col gap-[12px] sm:gap-[20px]">
              <p className="font-sans font-normal text-[14px] sm:text-[16px] leading-[30px] text-white">
                {profile?.isArtist ? 'ARTIST' : 'LISTENER'}
              </p>
              <h1 className="font-display text-[20px] sm:text-[24px] text-white">
                {profile?.username || address?.slice(0, 6) + '...' + address?.slice(-4) || 'Unknown'}
              </h1>
            </div>
            {profile?.isArtist ? (
              <button
                onClick={() => setActiveTab('Upload')}
                className="btn-gradient-sm !py-[16px] sm:!py-[21px] !px-[30px] flex items-center gap-[10px] text-[16px] sm:text-[18px]"
              >
                Upload Track
                <img src="/images/artist/icon-arrow-right.png" alt="" className="w-[10px] h-[17px]" />
              </button>
            ) : profile && (
              <button
                onClick={async () => {
                  try {
                    await userApi.updateProfile({ isArtist: true });
                    toast.success('You are now an artist! Reloading...');
                    setTimeout(() => window.location.reload(), 1000);
                  } catch {
                    toast.error('Failed to register as artist.');
                  }
                }}
                className="btn-gradient-sm !py-[16px] sm:!py-[21px] !px-[30px] flex items-center gap-[10px] text-[16px] sm:text-[18px]"
              >
                Become an Artist
                <img src="/images/artist/icon-arrow-right.png" alt="" className="w-[10px] h-[17px]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative px-4 md:px-8 lg:px-[164px] mt-[40px] sm:mt-[60px] lg:mt-[80px]">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[86px] items-start w-full max-w-[1172px]">
          {/* Left Sidebar - Artist Details */}
          <div className="flex flex-row lg:flex-col gap-6 lg:gap-[48px] shrink-0 overflow-x-auto lg:overflow-visible w-full lg:w-auto pb-4 lg:pb-0">
            {/* Wallet */}
            <div className="flex flex-col gap-[14px] min-w-[140px] lg:w-[200px]">
              <p className="font-sans text-[14px] sm:text-[16px] text-white/50 leading-[30px] uppercase">
                Wallet
              </p>
              <p className="font-sans font-medium text-[14px] sm:text-[16px] text-white leading-[30px] break-all">
                {address || 'Not connected'}
              </p>
            </div>

            {/* Role */}
            <div className="flex flex-col gap-[14px] min-w-[140px]">
              <p className="font-sans text-[14px] sm:text-[16px] text-white/50 leading-[30px] uppercase">
                Role
              </p>
              <div className="flex gap-[6px] flex-wrap">
                <TagPill>{profile?.isArtist ? 'Artist' : 'Listener'}</TagPill>
                {profile?.isVerified && <TagPill>Verified</TagPill>}
              </div>
            </div>

            {/* Email */}
            {profile?.email && (
              <div className="flex flex-col gap-[14px] min-w-[140px]">
                <p className="font-sans text-[14px] sm:text-[16px] text-white/50 leading-[30px] uppercase">
                  Email
                </p>
                <p className="font-sans font-medium text-[14px] sm:text-[16px] text-white leading-[30px]">
                  {profile.email}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="flex flex-col gap-[14px] min-w-[140px]">
              <p className="font-sans text-[14px] sm:text-[16px] text-white/50 leading-[30px] uppercase">
                Stats
              </p>
              <div className="flex gap-[6px] flex-wrap">
                <TagPill>{analytics.totalTracks} Tracks</TagPill>
                <TagPill>{analytics.totalStreams} Streams</TagPill>
              </div>
            </div>
          </div>

          {/* Right Content - Tabs + Content */}
          <div className="flex-1 min-w-0 w-full">
            {/* Tabs */}
            <div className="flex flex-col gap-[20px]">
              <div className="flex gap-[24px] sm:gap-[45px] text-[14px] sm:text-[16px] leading-[30px] text-white overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`font-sans transition-opacity whitespace-nowrap ${
                      activeTab === tab
                        ? 'font-medium opacity-100'
                        : 'font-normal opacity-50 hover:opacity-75'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
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
            <div className="py-[30px] sm:py-[50px]">
              {/* ===== BIO TAB ===== */}
              {activeTab === 'Bio' && (
                <div className="flex flex-col gap-[20px] sm:gap-[30px]">
                  {profile?.bio ? (
                    <p className="font-sans text-[14px] sm:text-[16px] text-white leading-[26px]">
                      {profile.bio}
                    </p>
                  ) : (
                    <p className="font-sans text-[14px] sm:text-[16px] text-white/50 leading-[26px]">
                      No bio yet. Update your profile to add a bio.
                    </p>
                  )}
                </div>
              )}

              {/* ===== TRACKS TAB ===== */}
              {activeTab === 'Tracks' && (
                <div>
                  {tracks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-[40px] sm:py-[60px]">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
                    <MetricCard
                      icon={
                        <img
                          src="/images/artist/icon-tracks.png"
                          alt=""
                          className="w-[24px] h-[26px] sm:w-[30px] sm:h-[32px]"
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                    <MetricCard
                      icon={
                        <img
                          src="/images/artist/icon-votes.png"
                          alt=""
                          className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px]"
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
                profile?.isArtist ? (
                  <UploadForm
                    onSuccess={() => {
                      loadArtistData();
                      setActiveTab('Tracks');
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-[40px] sm:py-[60px]">
                    <p className="font-sans text-[16px] text-white/50 mb-[20px]">
                      You need artist privileges to upload tracks.
                    </p>
                    <button
                      onClick={async () => {
                        try {
                          await userApi.updateProfile({ isArtist: true });
                          toast.success('You are now an artist! Reloading...');
                          setTimeout(() => window.location.reload(), 1000);
                        } catch {
                          toast.error('Failed to register as artist.');
                        }
                      }}
                      className="btn-gradient-sm !py-[14px] !px-[30px] text-[16px]"
                    >
                      Become an Artist
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-[30px] lg:py-[54px]">
        <CTABanner />
      </div>

      {/* Grunge texture decoration */}
      <div className="relative w-full h-[229px] overflow-hidden opacity-30">
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
