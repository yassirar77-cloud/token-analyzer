'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

/* ==================== SUB-COMPONENTS ==================== */

function ValueCard({
  icon,
  iconClass = 'w-[48px] h-[55px]',
  title,
  description,
  cta,
  tag,
}: {
  icon: string;
  iconClass?: string;
  title: string;
  description: string;
  cta: string;
  tag: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="relative w-full max-w-[356px] h-[397px] shrink-0 mx-auto"
    >
      <div
        className="absolute bg-brand-bg border-6 border-white rounded-[20px]"
        style={{ top: '12.09%', left: 0, right: 0, bottom: '6.8%' }}
      />
      <div
        className="absolute top-0 left-0 w-[76px] h-[76px]"
        style={{
          transform: 'rotate(-11.59deg)',
          background: 'linear-gradient(to bottom, #C11D65, #403AAD)',
          borderRadius: 13,
          filter: 'blur(12.5px)',
        }}
      />
      <div className={'absolute top-[4%] left-[5%] ' + iconClass}>
        <img src={icon} alt="" className="w-full h-full object-contain" />
      </div>
      <div
        className="absolute flex flex-col gap-[23px]"
        style={{ top: '31%', left: '4.78%', right: '8.99%', bottom: '25%' }}
      >
        <div className="flex flex-col gap-[25px]">
          <h3 className="font-heading text-[20px] text-white">{title}</h3>
          <p className="font-body text-base text-white leading-[26px]">{description}</p>
        </div>
        <div className="flex items-center gap-[9px]">
          <span className="font-heading text-[17px] text-brand-red">{cta}</span>
          <div className="w-[52px] h-[23px]">
            <img src="/images/icon-arrow.svg" alt="" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
      <div
        className="absolute flex items-center justify-center rounded-[20px] border-6 border-[#4439AA]"
        style={{
          bottom: 0,
          left: '11.8%',
          right: '11.8%',
          height: 55,
          background: 'linear-gradient(to right, #373DB2, #C71C61)',
        }}
      >
        <span className="font-body font-bold text-[20px] text-white">{tag}</span>
      </div>
    </motion.div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-[3px] text-white w-full sm:w-[219px]">
      <span className="font-stencil text-[40px] sm:text-[60px] lg:text-[90px] leading-none">{value}</span>
      <span className="font-body font-semibold text-xs sm:text-base leading-[26px] text-center">{label}</span>
    </div>
  );
}

function StatDivider() {
  return (
    <div className="hidden sm:flex h-[100px] lg:h-[224px] w-0 items-center justify-center">
      <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-white/30 to-transparent" />
    </div>
  );
}

function ComparisonRow({
  feature,
  spotify,
  sound,
  bsd,
}: {
  feature: string;
  spotify: string;
  sound: string;
  bsd: string;
}) {
  return (
    <div className="mb-7">
      <div className="flex items-center font-body font-bold">
        <span className="text-sm sm:text-base text-white w-[100px] sm:w-[230px] leading-[30px] shrink-0">{feature}</span>
        <span className="text-sm sm:text-base text-white flex-1 text-center leading-[30px]">{spotify}</span>
        <span className="text-sm sm:text-base text-white flex-1 text-center leading-[30px]">{sound}</span>
        <span className="text-sm sm:text-base text-white flex-1 text-center leading-[30px]">{bsd}</span>
      </div>
      <div className="gradient-divider mt-7" />
    </div>
  );
}

function TestimonialCard({
  quote,
  avatar,
  name,
}: {
  quote: string;
  avatar: string;
  name: string;
}) {
  return (
    <div className="relative w-full max-w-[356px] mx-auto">
      <div className="bg-brand-bg border-6 border-white rounded-[20px] p-5 h-auto min-h-[175px] relative">
        <div className="absolute top-4 right-4 w-[40px] h-[40px]">
          <img src="/images/quote-icon.svg" alt="" className="w-full h-full object-contain" />
        </div>
        <p className="font-body text-base text-white leading-[26px] pr-12">{quote}</p>
      </div>
      <div
        className="mx-auto mt-[-10px] flex items-center gap-[10px] px-4 py-2 rounded-[20px] border-6 border-[#4439AA] w-fit"
        style={{ background: 'linear-gradient(to right, #373DB2, #C71C61)' }}
      >
        <img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover" />
        <span className="font-body font-medium text-sm sm:text-base text-white leading-[18px]">{name}</span>
      </div>
    </div>
  );
}

function TrustBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 shrink-0">
        <img src={icon} alt="" className="w-full h-full object-contain" />
      </div>
      <span className="font-body text-sm sm:text-base text-white leading-[21px]">{label}</span>
    </div>
  );
}

function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({ openConnectModal, account }) => {
        const label = account ? account.displayName : 'Connect Wallet';
        return (
          <button onClick={openConnectModal} className="btn-gradient-sm text-base lg:text-lg font-body font-semibold !px-6 lg:!px-12">
            {label}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}

function HeroWalletButton() {
  return (
    <ConnectButton.Custom>
      {({ openConnectModal, account }) => {
        const label = account ? account.displayName : 'Connect Wallet';
        return (
          <button onClick={openConnectModal} className="btn-gradient text-base lg:text-lg font-body font-semibold !px-8 lg:!px-16">
            {label}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}

/* ==================== MAIN PAGE ==================== */

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-brand-bg overflow-hidden">

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full min-h-[600px] lg:min-h-[840px]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-brand-bg" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "url('/images/noise-texture.png')",
              backgroundSize: '1024px 1024px',
            }}
          />
        </div>

        {/* CSS glow effects */}
        <div className="absolute right-[10%] -top-5 w-[300px] md:w-[613px] h-[300px] md:h-[613px] pointer-events-none">
          <div className="absolute inset-0 rounded-full opacity-50" style={{ background: 'radial-gradient(circle, #4CBAFF 0%, transparent 55%)', filter: 'blur(187px)' }} />
        </div>
        <div className="absolute right-[2%] -top-5 w-[300px] md:w-[613px] h-[300px] md:h-[613px] pointer-events-none">
          <div className="absolute inset-0 rounded-full opacity-50" style={{ background: 'radial-gradient(circle, #FF4CA3 0%, transparent 55%)', filter: 'blur(187px)' }} />
        </div>

        <div className="absolute right-0 top-[85px] w-[746px] h-[638px] pointer-events-none hidden lg:block">
          <img src="/images/hero-dogs.png" alt="Backstreet Dogs Characters" className="w-full h-full object-cover" />
        </div>

        {/* Navigation */}
        <nav className="relative z-50 flex items-center justify-between max-w-[1336px] mx-auto px-4 md:px-8 lg:px-[164px] pt-[24px] lg:pt-[39px]">
          <span className="font-logo text-[22px] md:text-[30px] text-white whitespace-nowrap">Backstreet Dogs</span>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-[30px]">
            <div className="flex items-center gap-[24px] lg:gap-[44px] font-body font-medium">
              <Link href="/explore" className="text-white text-base lg:text-lg leading-[30px] hover:opacity-80 transition-opacity">Explore</Link>
              <Link href="/artist" className="text-white text-base lg:text-lg leading-[30px] hover:opacity-80 transition-opacity">Artist</Link>
              <Link href="/profile" className="text-white text-base lg:text-lg leading-[30px] hover:opacity-80 transition-opacity">Profile</Link>
              <Link href="/trending" className="text-white text-base lg:text-lg leading-[30px] hover:opacity-80 transition-opacity">Trending</Link>
            </div>
            <WalletButton />
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-brand-bg/95 backdrop-blur-sm px-4 py-4 flex flex-col gap-4">
            <Link href="/explore" className="text-white text-lg font-body font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Explore</Link>
            <Link href="/artist" className="text-white text-lg font-body font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Artist</Link>
            <Link href="/profile" className="text-white text-lg font-body font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
            <Link href="/trending" className="text-white text-lg font-body font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Trending</Link>
            <WalletButton />
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 px-4 md:px-8 lg:px-[153px] pt-[60px] lg:pt-[110px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-[605px]"
          >
            <div className="relative mb-5">
              <h1 className="font-heading text-[32px] sm:text-[42px] lg:text-[62px] leading-[1.1] text-white">
                <span className="block">Where</span>
                <span className="block mt-3">Underground Music Meets</span>
              </h1>
              <div className="relative h-[80px] sm:h-[100px] lg:h-[137px] w-full max-w-[591px] mt-2">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full max-w-[586px] h-[60px] sm:h-[80px] lg:h-[100px] bg-brand-blue border-[3px] sm:border-[5px] border-brand-blue rounded-[4px] rotate-[3.62deg]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center" style={{ top: '6%' }}>
                  <div className="w-full max-w-[586px] h-[60px] sm:h-[80px] lg:h-[100px] bg-brand-red border-4 sm:border-8 border-[#F1134A] rounded-[4px] rotate-[2.01deg]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-heading text-[36px] sm:text-[50px] lg:text-[70px] text-white tracking-[2.8px] rotate-[2.01deg]">Ownership</span>
                </div>
              </div>
              {/* Music notes decoration */}
              <div className="absolute top-0 right-0 w-[48px] sm:w-[72px] h-[48px] sm:h-[72px]">
                <svg viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.85 5.74V39.56c-1.58-1.41-3.74-2.28-6.12-2.28C3.91 37.28 0 40.83 0 45.22c0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V15.63l28.09-4.84v23.03c-1.58-1.41-3.74-2.28-6.12-2.28-4.82 0-8.73 3.55-8.73 7.94 0 4.38 3.91 7.93 8.73 7.93 4.82 0 8.73-3.55 8.73-7.93V0L14.85 5.74Z" fill="white"/>
                </svg>
              </div>
            </div>

            <p className="font-body text-base lg:text-lg text-white leading-[26px] lg:leading-[30px] max-w-[519px] mb-[28px] lg:mb-[38px]">
              The first platform where musicians keep 90% of streaming revenue and 97.5% of sales. No labels. No middlemen. Just music.
            </p>

            <div className="flex flex-col sm:flex-row gap-[14px] mb-7">
              <HeroWalletButton />
              <Link href="/explore" className="btn-outline text-base lg:text-lg text-center font-body font-semibold w-full sm:w-auto sm:min-w-[200px] lg:min-w-[276px]">
                Explore Music
              </Link>
            </div>

            <p className="font-body text-base lg:text-lg text-white leading-[30px]">
              {'"Join 500+ underground artists earning what they deserve"'}
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-brand-bg blur-[22px] pointer-events-none" />
      </section>

      {/* ===== VALUE PROPOSITION ===== */}
      <section className="px-4 md:px-8 lg:px-[164px] pt-20 pb-12">
        <div className="text-center mb-10 max-w-[883px] mx-auto">
          <h2 className="font-heading text-[24px] sm:text-[30px] lg:text-[35px] text-white mb-[27px]">VALUE PROPOSITION</h2>
          <p className="font-body text-base text-white leading-[30px]">
            The first platform where musicians keep 90% of streaming revenue and 97.5% of sales. No labels. No middlemen. Just music.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
          <ValueCard
            icon="/images/icon-income.svg"
            title="Keep What You Earn"
            description="The first platform where musicians keep 90% of streaming revenue and 97.5% of sales. No labels. No middlemen. Just music."
            cta="Start Uploading"
            tag="For Musicians"
          />
          <ValueCard
            icon="/images/icon-music-note.svg"
            title="Own Music, Not Just Listen"
            description="Buy exclusive tracks as NFTs. Support artists directly. Resell anytime. Stream everything for $10/month in BSD tokens."
            cta="Browse Collection"
            tag="For Collectors"
          />
          <ValueCard
            icon="/images/icon-arrow.svg"
            iconClass="w-[48px] h-[55px]"
            title="Music Meets DeFi"
            description="Buy exclusive tracks as NFTs. Support artists directly. Resell anytime. Stream everything for $10/month in BSD tokens."
            cta="Get BSD Tokens"
            tag="For Traders"
          />
        </div>
      </section>

      {/* ===== CITY SKYLINE DIVIDER ===== */}
      <section className="relative w-full h-[300px] sm:h-[400px] lg:h-[611px] overflow-hidden">
        <div className="absolute left-0 sm:left-5 bottom-0 sm:top-[382px] w-full sm:w-[1558px] h-[229px]">
          <img src="/images/city-bg.svg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-brand-bg blur-[22px] pointer-events-none" />
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="px-4 md:px-8 lg:px-[164px] py-8 lg:py-12">
        <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-6 sm:gap-0">
          <StatItem value="90%" label="Artist Revenue Share" />
          <StatDivider />
          <StatItem value="$0" label="Fees To Join & Upload" />
          <StatDivider />
          <StatItem value="10%" label="Royalties Forever" />
          <StatDivider />
          <StatItem value="24/7" label="Global Marketplace" />
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="px-4 md:px-8 lg:px-[164px] py-10 lg:py-16">
        <h2 className="font-heading text-[24px] sm:text-[30px] lg:text-[35px] text-white text-center mb-2">HOW IT WORKS</h2>
        <p className="font-body text-base text-white text-center mb-10 lg:mb-16">Simple 3-step</p>

        {/* Step 1 */}
        <div className="flex flex-col sm:flex-row items-center gap-8 lg:gap-[219px] mb-12 lg:mb-20">
          <div className="flex flex-col gap-[18px]">
            <span className="font-stencil text-[50px] lg:text-[70px] text-brand-gray leading-none">01</span>
            <div className="flex flex-col gap-[20px] lg:gap-[27px]">
              <h3 className="font-heading text-[20px] text-white">{'Upload & Mint'}</h3>
              <p className="font-body text-base text-white leading-[26px] max-w-[526px]">
                Turn your track into an NFT in 2 minutes. Set your price and royalty rate.
              </p>
            </div>
          </div>
          <div className="w-[100px] h-[100px] lg:w-[164px] lg:h-[164px] shrink-0">
            <img src="/images/icon-upload.svg" alt="Upload" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-8 max-w-[1007px] mb-12 lg:mb-20">
          <div className="w-[100px] h-[100px] lg:w-[164px] lg:h-[164px] shrink-0">
            <img src="/images/icon-earn.svg" alt="Earn" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col gap-[18px]">
            <span className="font-stencil text-[50px] lg:text-[70px] text-brand-gray leading-none">02</span>
            <div className="flex flex-col gap-[20px] lg:gap-[27px]">
              <h3 className="font-heading text-[20px] lg:text-[25px] text-white">Earn Instantly</h3>
              <p className="font-body text-base text-white leading-[26px] max-w-[431px]">
                Get paid in crypto when fans buy. Keep 97.5% of every sale.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col sm:flex-row items-center gap-8 lg:gap-[219px] mb-12 lg:mb-20">
          <div className="flex flex-col gap-[18px]">
            <span className="font-stencil text-[50px] lg:text-[70px] text-brand-gray leading-none">03</span>
            <div className="flex flex-col gap-[20px] lg:gap-[27px]">
              <h3 className="font-heading text-[20px] lg:text-[25px] text-white">Earn Forever</h3>
              <p className="font-body text-base text-white leading-[26px] max-w-[526px]">
                Receive 10% every time your NFT is resold. Plus 90% of streaming revenue.
              </p>
            </div>
          </div>
          <div className="w-[100px] h-[100px] lg:w-[164px] lg:h-[164px] shrink-0">
            <img src="/images/icon-forever.svg" alt="Forever" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="px-4 md:px-8 lg:px-[164px] py-12">
        <div className="relative border-6 border-white rounded-[20px] overflow-hidden min-h-[200px] lg:h-[279px]">
          <div className="absolute inset-0 bg-brand-bg pointer-events-none" />
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "url('/images/noise-texture-2.png')",
              backgroundSize: '715px 715px',
            }}
          />
          <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-[80px] px-5 lg:px-[45px] py-6 lg:py-[29px] h-full">
            <div className="flex flex-col gap-[20px] lg:gap-[30px] max-w-[604px]">
              <h3 className="font-heading text-[24px] sm:text-[30px] lg:text-[35px] text-white leading-tight">
                Ready to earn what you deserve?
              </h3>
              <p className="font-body text-base text-white leading-[26px] max-w-[526px]">
                Upload your first track. Free forever. Keep 90% of streaming and 97.5% of sales.
              </p>
            </div>
            <div className="relative shrink-0 hidden md:block">
              <div
                className="w-[250px] lg:w-[333px] h-[170px] lg:h-[227px] bg-[#262626] rounded-[25px]"
                style={{
                  boxShadow: '-5px 5px 14px rgba(0,73,208,0.7), 4px -4px 8px rgba(242,19,74,0.6), inset -6px 0 6px rgba(255,255,255,0.04), inset 1px 0 4px rgba(0,73,208,0.71), inset 2px 0 4px rgba(255,255,255,0.25)',
                }}
              />
              <div className="absolute top-[25px] left-[-63px] w-[249px] h-[181px]">
                <img src="/images/cta-phone.svg" alt="" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOR FANS ===== */}
      <section className="px-4 md:px-8 lg:px-[164px] py-10 lg:py-16">
        <div className="flex items-center gap-4 lg:gap-[49px] mb-[35px] lg:mb-[55px]">
          <h2 className="font-heading text-[24px] sm:text-[30px] lg:text-[35px] text-white whitespace-nowrap">For Fans</h2>
          <div className="flex-1 h-[49px] hidden sm:block">
            <img src="/images/fan-decorative.svg" alt="" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="flex flex-col gap-7">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-[20px] lg:gap-[27px]">
              <h3 className="font-heading text-[20px] text-white">Connect Wallet</h3>
              <p className="font-body text-base text-white leading-[26px]">Use MetaMask or any Web3 wallet. Takes 30 seconds.</p>
            </div>
            <div className="w-[80px] h-[60px] lg:w-[121px] lg:h-[94px] shrink-0">
              <img src="/images/icon-wallet.svg" alt="Wallet" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="w-full max-w-[1103px]">
            <div className="gradient-divider mb-[25px] lg:mb-[35px]" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-[201px]">
              <div className="flex flex-col gap-[20px] lg:gap-[27px]">
                <h3 className="font-heading text-[20px] text-white">Buy or Stream</h3>
                <p className="font-body text-base text-white leading-[26px]">
                  Own exclusive tracks as NFTs, or subscribe to stream everything for $10/month.
                </p>
              </div>
              <div className="w-[80px] h-[60px] lg:w-[135px] lg:h-[93px] shrink-0">
                <img src="/images/icon-stream.svg" alt="Stream" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          <div className="w-full max-w-[1103px]">
            <div className="gradient-divider mb-[25px] lg:mb-[35px]" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-[20px] lg:gap-[27px]">
                <h3 className="font-heading text-[20px] text-white">Support Direct</h3>
                <p className="font-body text-base text-white leading-[26px]">Your money goes to artists, not labels. Trade NFTs anytime.</p>
              </div>
              <div className="w-[70px] h-[70px] lg:w-[94px] lg:h-[94px] shrink-0">
                <img src="/images/icon-support.svg" alt="Support" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="gradient-divider mt-[22px]" />
          </div>
        </div>
      </section>

      {/* ===== CITY SKYLINE 2 ===== */}
      <section className="relative w-full h-[200px] sm:h-[300px] lg:h-[400px] overflow-hidden">
        <div className="absolute left-0 sm:left-5 bottom-0 sm:top-[100px] w-full sm:w-[1558px] h-[229px]">
          <img src="/images/city-bg.svg" alt="" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* ===== COMPARISON TABLE ===== */}
      <section className="px-4 md:px-8 lg:px-[164px] py-10 lg:py-16">
        <div className="text-center mb-10 max-w-[883px] mx-auto">
          <h2 className="font-heading text-[24px] sm:text-[30px] lg:text-[35px] text-white mb-[27px]">VALUE PROPOSITION</h2>
          <p className="font-body text-base text-white leading-[30px]">
            The first platform where musicians keep 90% of streaming revenue and 97.5% of sales. No labels. No middlemen. Just music.
          </p>
        </div>

        <div className="relative border-4 sm:border-7 border-white rounded-[20px] overflow-x-auto">
          <div
            className="absolute right-0 top-0 bottom-0 w-1/4 lg:w-[343px] border-4 sm:border-7 border-brand-blue rounded-r-[20px]"
            style={{ background: 'linear-gradient(132deg, #0049D0 5.7%, #F1134A 105%)' }}
          />
          <div className="relative z-10 p-4 sm:p-6 lg:p-10 min-w-[500px]">
            <div className="flex items-center mb-8 lg:mb-11 font-heading">
              <span className="text-sm sm:text-[20px] text-white w-[100px] sm:w-[230px] shrink-0">Feature</span>
              <span className="text-sm sm:text-[20px] text-white flex-1 text-center">Spotify</span>
              <span className="text-sm sm:text-[20px] text-white flex-1 text-center">Sound.xyz</span>
              <span className="text-sm sm:text-[20px] text-white flex-1 text-center">Backstreet Dogs</span>
            </div>
            <ComparisonRow feature="Artist Revenue" spotify="30%" sound="95% (one-time)" bsd="90% + 97.5% + 10%" />
            <ComparisonRow feature="Streaming" spotify="Yes" sound="No" bsd="Yes" />
            <ComparisonRow feature="NFT Sales" spotify="No" sound="Yes" bsd="Yes" />
            <ComparisonRow feature="Resale Royalties" spotify="No" sound="Yes" bsd="Yes" />
            <ComparisonRow feature="Platform Token" spotify="No" sound="Yes" bsd="Yes (BSD)" />
            <div className="flex items-center font-body font-bold">
              <span className="text-sm sm:text-base text-white w-[100px] sm:w-[230px] leading-[30px] shrink-0">Focus</span>
              <span className="text-sm sm:text-base text-white flex-1 text-center leading-[30px]">Mainstream</span>
              <span className="text-sm sm:text-base text-white flex-1 text-center leading-[30px]">Established</span>
              <span className="text-sm sm:text-base text-white flex-1 text-center leading-[30px]">Underground</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="px-4 md:px-8 lg:px-[164px] py-10 lg:py-16">
        <h2 className="font-heading text-[24px] sm:text-[30px] lg:text-[35px] text-white text-center mb-10">TESTIMONIALS</h2>
        <div className="flex flex-col md:flex-row gap-8 lg:gap-[34px] justify-center items-center md:items-start">
          <TestimonialCard
            quote={'"Finally, a platform that doesn\'t rob artists. I made more in 1 month than 2 years on Spotify."'}
            avatar="/images/avatar-1.png"
            name="DJ Shadow (Underground Producer)"
          />
          <TestimonialCard
            quote={'"Sold my track for $500 as an NFT, then earned $200 more from streaming. This is the future."'}
            avatar="/images/avatar-2.png"
            name="Luna Beats (Independent Artist)"
          />
          <TestimonialCard
            quote={'"Bought a track for $100, resold for $300. Artist still got their 10%. Everyone wins!"'}
            avatar="/images/avatar-3.png"
            name="Mike (Collector)"
          />
        </div>
      </section>

      {/* ===== DISCOVER CTA ===== */}
      <section className="px-4 md:px-8 lg:px-[164px] py-10 lg:py-16">
        <div className="relative min-h-[250px] lg:h-[320px] w-full max-w-[1172px] mx-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[calc(100%-4px)] lg:w-[1169px] h-[85%] lg:h-[294px] bg-brand-blue border-[3px] sm:border-[5px] border-brand-blue rounded-[4px] rotate-[1.27deg]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[calc(100%-4px)] lg:w-[1169px] h-[85%] lg:h-[294px] bg-brand-red border-4 sm:border-8 border-[#F1134A] rounded-[4px]" style={{ transform: 'rotate(-1.1deg)' }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-[170px]">
              <div className="flex flex-col gap-[20px] lg:gap-[30px] text-white text-center lg:text-left">
                <h3 className="font-heading text-[24px] sm:text-[30px] lg:text-[35px] leading-tight">Discover music before everyone else</h3>
                <p className="font-body text-base leading-[26px] max-w-[526px]">
                  Support underground artists. Own exclusive tracks. Build your collection.
                </p>
              </div>
              <Link
                href="/explore"
                className="bg-white text-brand-dark font-body font-semibold text-base lg:text-lg leading-[30px] px-8 sm:px-[50px] lg:px-[73px] py-4 lg:py-[26px] rounded-full hover:scale-105 transition-transform whitespace-nowrap"
                style={{
                  boxShadow: 'inset -1px -1px 4px rgba(0,0,0,0.25), inset 0 4px 4px rgba(0,0,0,0.25)',
                }}
              >
                Explore Music
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="px-4 md:px-8 lg:px-[164px] pt-12 pb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 lg:gap-[125px] mb-6">
          <span className="font-logo text-[24px] lg:text-[30px] text-white">Backstreet Dogs</span>
          <div className="grid grid-cols-2 sm:flex gap-4 lg:gap-[26px]">
            <TrustBadge icon="/images/badge-audit.svg" label="Smart Contract Audited" />
            <TrustBadge icon="/images/badge-base.svg" label="Built on Base Blockchain" />
            <TrustBadge icon="/images/badge-paid.svg" label="$500K+ Paid to Artists" />
            <TrustBadge icon="/images/badge-global.svg" label="Available Worldwide" />
          </div>
        </div>

        <div className="gradient-divider my-8" />

        <div className="flex flex-col md:flex-row gap-8 lg:gap-[93px] mb-12">
          <div className="w-full md:max-w-[519px]">
            <h4 className="font-heading text-[20px] text-white mb-[25px]">About us</h4>
            <p className="font-body text-base lg:text-lg text-white leading-[30px]">
              The first platform where musicians keep 90% of streaming revenue and 97.5% of sales. No labels. No middlemen. Just music.
            </p>
          </div>
          <div className="w-full md:max-w-[531px]">
            <h4 className="font-heading text-[20px] text-white mb-[25px] lg:mb-[31px]">Explore</h4>
            <div className="flex flex-wrap gap-4 lg:gap-[44px] font-body font-medium text-base lg:text-lg text-white leading-[30px] mb-[25px] lg:mb-[31px]">
              <Link href="/explore" className="hover:opacity-80 transition-opacity">Explore</Link>
              <Link href="/artist" className="hover:opacity-80 transition-opacity">Artist</Link>
              <Link href="/profile" className="hover:opacity-80 transition-opacity">Profile</Link>
              <Link href="/trending" className="hover:opacity-80 transition-opacity">Trending</Link>
              <span className="cursor-pointer hover:opacity-80 transition-opacity">Connect Wallet</span>
              <Link href="/privacy" className="cursor-pointer hover:opacity-80 transition-opacity">Privacy Policy</Link>
            </div>
            <Link href="/terms" className="font-body font-medium text-base lg:text-lg text-white leading-[30px] hover:opacity-80 transition-opacity">{'Terms & Conditions'}</Link>
          </div>
        </div>

        <div className="gradient-divider my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm sm:text-base lg:text-lg text-white leading-[30px] text-center sm:text-left">Copyright {new Date().getFullYear()}. All rights reserved. Backstreet Dogs</p>
          <div className="flex gap-4 items-center">
            <a href="#" className="w-10 h-10 hover:opacity-80 transition-opacity">
              <img src="/images/social-x.svg" alt="X" className="w-full h-full" />
            </a>
            <a href="#" className="w-10 h-10 hover:opacity-80 transition-opacity">
              <img src="/images/social-discord.svg" alt="Discord" className="w-full h-full" />
            </a>
            <a href="#" className="w-10 h-10 hover:opacity-80 transition-opacity">
              <img src="/images/social-telegram.svg" alt="Telegram" className="w-full h-full" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
