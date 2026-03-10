'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { trackApi } from '@/lib/api';
import TrackCard from '@/components/TrackCard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// --- Sub-components ---

function ProfileNavbar() {
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

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center h-[32px] px-[20px] rounded-full bg-white/5 font-sans font-medium text-[14px] text-white leading-[30px] relative">
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
    <div className="flex-1 bg-brand-bg border-2 border-white rounded-[20px] p-[20px] flex flex-col gap-[14px]">
      {icon}
      <div className="flex flex-col gap-[9px] text-white">
        <p className="font-sans font-normal text-[14px] leading-[26px] text-white/50">{label}</p>
        <p className="font-sans font-semibold text-[24px]">{value}</p>
      </div>
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

// --- Main Page ---

const TABS = ['Collection', 'Activity', 'Settings'] as const;
type Tab = (typeof TABS)[number];

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>('Collection');
  const [collection, setCollection] = useState([]);
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
      <div className="relative h-[480px] w-full overflow-hidden">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0049D0 0%, #141414 50%, #F2134A 100%)',
            opacity: 0.3,
          }}
        />
        <div className="absolute inset-0 bg-brand-bg/70" />

        {/* Radial glow - blue */}
        <div className="absolute left-[10%] top-[40px] w-[500px] h-[500px] pointer-events-none">
          <div
            className="absolute inset-0 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #4CBAFF 0%, transparent 55%)', filter: 'blur(187px)' }}
          />
        </div>
        {/* Radial glow - pink */}
        <div className="absolute right-[10%] top-[40px] w-[500px] h-[500px] pointer-events-none">
          <div
            className="absolute inset-0 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #FF4CA3 0%, transparent 55%)', filter: 'blur(187px)' }}
          />
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-brand-bg to-transparent" />
      </div>

      {/* Navbar */}
      <ProfileNavbar />

      {/* Profile Avatar & Info */}
      <div className="absolute top-[340px] left-[164px] z-10">
        {/* Avatar placeholder with gradient ring */}
        <div className="relative w-[182px] h-[182px]">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: 'linear-gradient(135deg, #0049D0, #F2134A)', padding: '4px' }}
          >
            <div className="w-full h-full rounded-full bg-brand-bg flex items-center justify-center overflow-hidden">
              {isConnected ? (
                <div className="w-full h-full bg-gradient-to-br from-brand-blue/30 to-brand-red/30 flex items-center justify-center">
                  <span className="font-display text-[40px] text-white">
                    {address ? address.slice(2, 4).toUpperCase() : '??'}
                  </span>
                </div>
              ) : (
                <svg className="w-[60px] h-[60px] text-white/30" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-[400px] left-[402px] right-[164px] z-10 flex items-center justify-between">
        <div className="flex flex-col gap-[12px]">
          <p className="font-sans font-normal text-[16px] leading-[30px] text-white/50">
            COLLECTOR
          </p>
          <h1 className="font-display text-[24px] text-white whitespace-nowrap">
            {isConnected ? shortenAddress(address || '') : 'Not Connected'}
          </h1>
          {isConnected && (
            <div className="flex gap-[6px] mt-[4px]">
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
                className="btn-gradient-sm !py-[21px] !px-[30px] flex items-center gap-[10px] text-[18px]"
              >
                Connect Wallet
              </button>
            )}
          </ConnectButton.Custom>
        )}
      </div>

      {/* Main Content */}
      <div className="relative px-[164px]" style={{ marginTop: isConnected ? '120px' : '80px' }}>
        {!isConnected ? (
          /* Not Connected State */
          <div className="flex flex-col items-center justify-center py-[120px]">
            <div className="w-[120px] h-[120px] mb-[40px] rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-[50px] h-[50px] text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h2 className="font-display text-[28px] text-white mb-[16px]">Connect Your Wallet</h2>
            <p className="font-sans text-[16px] text-white/50 leading-[26px] text-center max-w-[500px] mb-[40px]">
              Connect your Web3 wallet to view your profile, collection, and activity on Backstreet Dogs.
            </p>
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="btn-gradient-sm !py-[21px] !px-[70px] text-[18px]"
                >
                  Connect Wallet
                </button>
              )}
            </ConnectButton.Custom>
          </div>
        ) : (
          /* Connected State */
          <div className="w-[1172px]">
            {/* Stats Row */}
            <div className="flex gap-[16px] mb-[50px]">
              <StatCard
                label="Tracks Owned"
                value={stats.tracksOwned}
                icon={
                  <img src="/images/artist/icon-tracks.png" alt="" className="w-[30px] h-[32px]" />
                }
              />
              <StatCard
                label="Total Spent"
                value={`${stats.totalSpent} BSD`}
                icon={
                  <img src="/images/artist/icon-revenue.png" alt="" className="w-[30px] h-[30px]" />
                }
              />
              <StatCard
                label="Listened Hours"
                value={stats.listenedHours}
                icon={
                  <img src="/images/artist/icon-streams.png" alt="" className="w-[30px] h-[30px]" />
                }
              />
              <StatCard
                label="Favorite Genre"
                value={stats.favoriteGenre}
                icon={
                  <img src="/images/artist/icon-votes.png" alt="" className="w-[32px] h-[32px]" />
                }
              />
            </div>

            {/* Tabs */}
            <div className="flex flex-col gap-[20px] mb-[50px]">
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
                  <div className="grid grid-cols-3 gap-[16px]">
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
                  <div className="flex flex-col items-center justify-center py-[80px]">
                    <div className="w-[78px] h-[86px] mb-[30px] opacity-30">
                      <svg viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path d="M14.85 5.74V39.56c-1.58-1.41-3.74-2.28-6.12-2.28C3.91 37.28 0 40.83 0 45.22c0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V15.63l28.09-4.84v23.03c-1.58-1.41-3.74-2.28-6.12-2.28-4.82 0-8.73 3.55-8.73 7.94 0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V0L14.85 5.74Z" fill="white"/>
                      </svg>
                    </div>
                    <p className="font-sans text-[18px] text-white/50 mb-[12px]">No tracks in your collection yet</p>
                    <p className="font-sans text-[14px] text-white/30 mb-[30px]">Start exploring and collecting music from underground artists</p>
                    <Link
                      href="/explore"
                      className="btn-gradient-sm !py-[14px] !px-[30px] text-[16px]"
                    >
                      Explore Music
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-[16px]">
                    {collection.map((track: any) => (
                      <TrackCard key={track.id} track={track} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Activity' && (
              <div className="flex flex-col gap-[16px]">
                {/* Activity placeholder */}
                <div className="flex flex-col items-center justify-center py-[80px]">
                  <div className="w-[80px] h-[80px] mb-[30px] rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-[36px] h-[36px] text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-sans text-[18px] text-white/50 mb-[12px]">No activity yet</p>
                  <p className="font-sans text-[14px] text-white/30">Your purchases, streams, and transactions will appear here</p>
                </div>
              </div>
            )}

            {activeTab === 'Settings' && (
              <div className="flex flex-col gap-[40px] max-w-[600px]">
                {/* Display Name */}
                <div className="flex flex-col gap-[14px]">
                  <p className="font-sans text-[16px] text-white/50 leading-[30px]">Display Name</p>
                  <div className="h-[48px] rounded-full border border-white flex items-center px-[20px]">
                    <input
                      type="text"
                      placeholder="Enter display name..."
                      className="w-full bg-transparent text-[#f0f0f0] font-sans text-[16px] leading-[30px] focus:outline-none placeholder-[#f0f0f0]/50"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-[14px]">
                  <p className="font-sans text-[16px] text-white/50 leading-[30px]">Bio</p>
                  <div className="rounded-[20px] border border-white p-[20px]">
                    <textarea
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full bg-transparent text-[#f0f0f0] font-sans text-[16px] leading-[26px] focus:outline-none placeholder-[#f0f0f0]/50 resize-none"
                    />
                  </div>
                </div>

                {/* Favorite Genres */}
                <div className="flex flex-col gap-[14px]">
                  <p className="font-sans text-[16px] text-white/50 leading-[30px]">Favorite Genres</p>
                  <div className="flex gap-[6px] flex-wrap">
                    {['Hip Hop', 'Rock', 'Electronic', 'Jazz', 'R&B', 'Pop', 'Indie', 'Ambient'].map((genre) => (
                      <TagPill key={genre}>{genre}</TagPill>
                    ))}
                  </div>
                </div>

                {/* Wallet */}
                <div className="flex flex-col gap-[14px]">
                  <p className="font-sans text-[16px] text-white/50 leading-[30px]">Wallet Address</p>
                  <div className="h-[48px] rounded-full border border-white/30 flex items-center px-[20px] bg-white/5">
                    <span className="font-sans text-[14px] text-white/70">{address || 'Not connected'}</span>
                  </div>
                </div>

                {/* Save Button */}
                <button className="btn-gradient-sm !py-[16px] !px-[50px] text-[16px] self-start">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="py-[54px]">
        <CTABanner />
      </div>

      {/* Grunge texture */}
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
