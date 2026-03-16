'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { trackApi, TrackData } from '@/lib/api';
import TrackCard from '@/components/TrackCard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

// --- Sub-components ---

function ProfileNavbar() {
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

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center h-[32px] px-[16px] sm:px-[20px] rounded-full bg-white/5 font-sans font-medium text-[13px] sm:text-[14px] text-white leading-[30px] relative">
      {children}
      <span className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_-1px_-1px_4px_rgba(255,255,255,0.05),inset_0_4px_4px_rgba(255,255,255,0.05)]" />
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-w-[140px] bg-brand-bg border-2 border-white rounded-[20px] p-4 sm:p-[20px] flex flex-col gap-[14px]">
      {icon}
      <div className="flex flex-col gap-[9px] text-white">
        <p className="font-sans font-normal text-[12px] sm:text-[14px] leading-[26px] text-white/50">{label}</p>
        <p className="font-sans font-semibold text-[18px] sm:text-[24px]">{value}</p>
      </div>
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

// --- Main Page ---

const TABS = ['Collection', 'Activity', 'Settings'] as const;
type Tab = (typeof TABS)[number];

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>('Collection');
  const [collection, setCollection] = useState<TrackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    tracksOwned: 0,
    totalSpent: '0',
    listenedHours: 0,
    favoriteGenre: 'N/A',
  });

  useEffect(() => {
    if (isConnected && address) {
      loadProfileData();
    } else {
      setLoading(false);
    }
  }, [isConnected, address]);

  const loadProfileData = async () => {
    try {
      const response = await trackApi.getAll({ limit: 50 });
      setCollection(response.data);
      setStats({
        tracksOwned: response.data.length,
        totalSpent: '0.00',
        listenedHours: 0,
        favoriteGenre: response.data.length > 0 ? (response.data[0] as any).genre || 'N/A' : 'N/A',
      });
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const shortenAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  return (
    <div className="bg-brand-bg min-h-screen relative">
      {/* Hero Section */}
      <div className="relative h-[350px] sm:h-[400px] lg:h-[480px] w-full overflow-hidden">
        {/* Gradient background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #0049D0 0%, #141414 50%, #F2134A 100%)',
            opacity: 0.3,
          }}
        />
        <div className="absolute inset-0 bg-brand-bg/70 pointer-events-none" />

        {/* Radial glow - blue */}
        <div className="absolute left-[10%] top-[40px] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] pointer-events-none">
          <div
            className="absolute inset-0 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #4CBAFF 0%, transparent 55%)', filter: 'blur(187px)' }}
          />
        </div>
        {/* Radial glow - pink */}
        <div className="absolute right-[10%] top-[40px] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] pointer-events-none">
          <div
            className="absolute inset-0 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #FF4CA3 0%, transparent 55%)', filter: 'blur(187px)' }}
          />
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-brand-bg to-transparent pointer-events-none" />
      </div>

      {/* Navbar */}
      <ProfileNavbar />

      {/* Profile Avatar & Info - now relative/flow-based on mobile */}
      <div className="relative px-4 md:px-8 lg:px-[164px] -mt-[100px] sm:-mt-[120px] z-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-8">
          {/* Avatar */}
          <div className="relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] lg:w-[182px] lg:h-[182px] shrink-0">
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: 'linear-gradient(135deg, #0049D0, #F2134A)', padding: '4px' }}
            >
              <div className="w-full h-full rounded-full bg-brand-bg flex items-center justify-center overflow-hidden">
                {isConnected ? (
                  <div className="w-full h-full bg-gradient-to-br from-brand-blue/30 to-brand-red/30 flex items-center justify-center">
                    <span className="font-display text-[28px] sm:text-[36px] lg:text-[40px] text-white">
                      {address ? address.slice(2, 4).toUpperCase() : '??'}
                    </span>
                  </div>
                ) : (
                  <svg className="w-[40px] sm:w-[60px] h-[40px] sm:h-[60px] text-white/30" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between flex-1 gap-4 text-center sm:text-left">
            <div className="flex flex-col gap-[8px] sm:gap-[12px]">
              <p className="font-sans font-normal text-[14px] sm:text-[16px] leading-[30px] text-white/50">
                COLLECTOR
              </p>
              <h1 className="font-display text-[20px] sm:text-[24px] text-white">
                {isConnected ? shortenAddress(address || '') : 'Not Connected'}
              </h1>
              {isConnected && (
                <div className="flex flex-wrap justify-center sm:justify-start gap-[6px] mt-[4px]">
                  <TagPill>Music Collector</TagPill>
                  <TagPill>Early Supporter</TagPill>
                </div>
              )}
            </div>
            {!isConnected && (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="btn-gradient-sm !py-[16px] sm:!py-[21px] !px-[30px] flex items-center gap-[10px] text-[16px] sm:text-[18px]"
                  >
                    Connect Wallet
                  </button>
                )}
              </ConnectButton.Custom>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative px-4 md:px-8 lg:px-[164px] mt-[40px] sm:mt-[60px]">
        {!isConnected ? (
          /* Not Connected State */
          <div className="flex flex-col items-center justify-center py-[80px] lg:py-[120px]">
            <div className="w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] mb-[30px] lg:mb-[40px] rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h2 className="font-display text-[22px] sm:text-[28px] text-white mb-[16px] text-center">Connect Your Wallet</h2>
            <p className="font-sans text-[14px] sm:text-[16px] text-white/50 leading-[26px] text-center max-w-[500px] mb-[30px] lg:mb-[40px]">
              Connect your Web3 wallet to view your profile, collection, and activity on Backstreet Dogs.
            </p>
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="btn-gradient-sm !py-[16px] sm:!py-[21px] !px-[40px] sm:!px-[70px] text-[16px] sm:text-[18px]"
                >
                  Connect Wallet
                </button>
              )}
            </ConnectButton.Custom>
          </div>
        ) : (
          /* Connected State */
          <div className="w-full max-w-[1172px]">
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:flex gap-[12px] sm:gap-[16px] mb-[30px] lg:mb-[50px]">
              <StatCard
                label="Tracks Owned"
                value={stats.tracksOwned}
                icon={
                  <img src="/images/artist/icon-tracks.png" alt="" className="w-[24px] h-[26px] sm:w-[30px] sm:h-[32px]" />
                }
              />
              <StatCard
                label="Total Spent"
                value={`${stats.totalSpent} BSD`}
                icon={
                  <img src="/images/artist/icon-revenue.png" alt="" className="w-[24px] h-[24px] sm:w-[30px] sm:h-[30px]" />
                }
              />
              <StatCard
                label="Listened Hours"
                value={stats.listenedHours}
                icon={
                  <img src="/images/artist/icon-streams.png" alt="" className="w-[24px] h-[24px] sm:w-[30px] sm:h-[30px]" />
                }
              />
              <StatCard
                label="Favorite Genre"
                value={stats.favoriteGenre}
                icon={
                  <img src="/images/artist/icon-votes.png" alt="" className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px]" />
                }
              />
            </div>

            {/* Tabs */}
            <div className="flex flex-col gap-[20px] mb-[30px] lg:mb-[50px]">
              <div className="flex gap-[24px] sm:gap-[45px] text-[14px] sm:text-[16px] leading-[30px] text-white">
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
              <div className="relative h-[2px] bg-white/50 rounded-full">
                <div
                  className="absolute h-[2px] rounded-full bg-gradient-card transition-all duration-300"
                  style={{
                    width: '80px',
                    left: `${TABS.indexOf(activeTab) * (80 + 45)}px`,
                  }}
                />
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'Collection' && (
              <div>
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-brand-bg border-2 border-white/10 rounded-[20px] overflow-hidden animate-pulse">
                        <div className="aspect-square bg-dark-700" />
                        <div className="p-5">
                          <div className="h-4 bg-dark-700 rounded mb-3 w-3/4" />
                          <div className="h-3 bg-dark-700 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : collection.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-[60px] lg:py-[80px]">
                    <div className="w-[78px] h-[86px] mb-[30px] opacity-30">
                      <svg viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path d="M14.85 5.74V39.56c-1.58-1.41-3.74-2.28-6.12-2.28C3.91 37.28 0 40.83 0 45.22c0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V15.63l28.09-4.84v23.03c-1.58-1.41-3.74-2.28-6.12-2.28-4.82 0-8.73 3.55-8.73 7.94 0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V0L14.85 5.74Z" fill="white"/>
                      </svg>
                    </div>
                    <p className="font-sans text-[16px] sm:text-[18px] text-white/50 mb-[12px]">No tracks in your collection yet</p>
                    <p className="font-sans text-[13px] sm:text-[14px] text-white/30 mb-[30px] text-center">Start exploring and collecting music from underground artists</p>
                    <Link
                      href="/explore"
                      className="btn-gradient-sm !py-[14px] !px-[30px] text-[16px]"
                    >
                      Explore Music
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                    {collection.map((track: any) => (
                      <TrackCard key={track.id} track={track} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Activity' && (
              <div className="flex flex-col gap-[16px]">
                <div className="flex flex-col items-center justify-center py-[60px] lg:py-[80px]">
                  <div className="w-[80px] h-[80px] mb-[30px] rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-[36px] h-[36px] text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-sans text-[16px] sm:text-[18px] text-white/50 mb-[12px]">No activity yet</p>
                  <p className="font-sans text-[13px] sm:text-[14px] text-white/30 text-center">Your purchases, streams, and transactions will appear here</p>
                </div>
              </div>
            )}

            {activeTab === 'Settings' && (
              <div className="flex flex-col gap-[30px] sm:gap-[40px] max-w-[600px]">
                {/* Display Name */}
                <div className="flex flex-col gap-[14px]">
                  <p className="font-sans text-[14px] sm:text-[16px] text-white/50 leading-[30px]">Display Name</p>
                  <div className="h-[44px] sm:h-[48px] rounded-full border border-white flex items-center px-[16px] sm:px-[20px]">
                    <input
                      type="text"
                      placeholder="Enter display name..."
                      className="w-full bg-transparent text-[#f0f0f0] font-sans text-[14px] sm:text-[16px] leading-[30px] focus:outline-none placeholder-[#f0f0f0]/50"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-[14px]">
                  <p className="font-sans text-[14px] sm:text-[16px] text-white/50 leading-[30px]">Bio</p>
                  <div className="rounded-[20px] border border-white p-[16px] sm:p-[20px]">
                    <textarea
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full bg-transparent text-[#f0f0f0] font-sans text-[14px] sm:text-[16px] leading-[26px] focus:outline-none placeholder-[#f0f0f0]/50 resize-none"
                    />
                  </div>
                </div>

                {/* Favorite Genres */}
                <div className="flex flex-col gap-[14px]">
                  <p className="font-sans text-[14px] sm:text-[16px] text-white/50 leading-[30px]">Favorite Genres</p>
                  <div className="flex gap-[6px] flex-wrap">
                    {['Hip Hop', 'Rock', 'Electronic', 'Jazz', 'R&B', 'Pop', 'Indie', 'Ambient'].map((genre) => (
                      <TagPill key={genre}>{genre}</TagPill>
                    ))}
                  </div>
                </div>

                {/* Wallet */}
                <div className="flex flex-col gap-[14px]">
                  <p className="font-sans text-[14px] sm:text-[16px] text-white/50 leading-[30px]">Wallet Address</p>
                  <div className="h-[44px] sm:h-[48px] rounded-full border border-white/30 flex items-center px-[16px] sm:px-[20px] bg-white/5">
                    <span className="font-sans text-[12px] sm:text-[14px] text-white/70 truncate">{address || 'Not connected'}</span>
                  </div>
                </div>

                {/* Save Button */}
                <button className="btn-gradient-sm !py-[14px] sm:!py-[16px] !px-[40px] sm:!px-[50px] text-[14px] sm:text-[16px] self-start">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="py-[30px] lg:py-[54px]">
        <CTABanner />
      </div>

      {/* Grunge texture */}
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
