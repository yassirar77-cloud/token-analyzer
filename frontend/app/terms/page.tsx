'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function LegalNavbar() {
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
                className={`hover:opacity-80 transition-opacity ${pathname === item.href ? 'opacity-100' : ''}`}
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
                return (<button onClick={openConnectModal} className="btn-gradient-sm text-[16px]">Connect Wallet</button>);
              }
              return (<div className="btn-gradient-sm text-[16px] cursor-default text-center">{account.displayName}</div>);
            }}
          </ConnectButton.Custom>
        </div>
      )}
    </nav>
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

export default function TermsOfUsePage() {
  return (
    <div className="bg-brand-bg min-h-screen relative overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-[350px] sm:h-[420px] lg:h-[500px]">
        <div className="absolute inset-0 bg-brand-bg" />
        <div className="absolute right-[10%] top-[60px] w-[250px] sm:w-[407px] h-[250px] sm:h-[407px] pointer-events-none">
          <div className="absolute inset-0 rounded-full opacity-50" style={{ background: 'radial-gradient(circle, #4CBAFF 0%, transparent 55%)', filter: 'blur(187px)' }} />
        </div>
        <div className="absolute right-[2%] top-[60px] w-[250px] sm:w-[407px] h-[250px] sm:h-[407px] pointer-events-none">
          <div className="absolute inset-0 rounded-full opacity-50" style={{ background: 'radial-gradient(circle, #FF4CA3 0%, transparent 55%)', filter: 'blur(187px)' }} />
        </div>
        <LegalNavbar />
        <div className="relative z-10 flex flex-col items-center pt-[120px] sm:pt-[160px] lg:pt-[200px] px-4">
          <h1 className="font-heading text-[30px] sm:text-[38px] lg:text-[46px] text-white text-center max-w-[848px] mb-[14px]">
            Terms of Use
          </h1>
          <p className="font-sans text-[14px] sm:text-[16px] text-white text-center leading-[30px]">
            Last Updated: March 14, 2026
          </p>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <section className="relative z-10 px-4 md:px-8 lg:px-[164px] pb-[60px] lg:pb-[100px]">
        <div className="w-full max-w-[900px] mx-auto">
          <div className="font-sans text-[16px] lg:text-[18px] text-white/90 leading-[30px] lg:leading-[34px] space-y-8">

            {/* Introduction */}
            <div>
              <p>
                Welcome to Backstreet Dogs. These Terms of Use (&quot;Terms&quot;) govern your access to and use of the Backstreet Dogs Web3 music platform, websites, applications, and services (collectively, the &quot;Services&quot;) provided by Ezy Work Asia Solution (SSM: 002944700-D) (&quot;Backstreet Dogs,&quot; &quot;BSD,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
              </p>
            </div>
            <div>
              <p>
                By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services. Please read these Terms carefully before using the Services.
              </p>
            </div>

            {/* 1. Eligibility */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">1. Eligibility</h2>
              <p className="mb-4">
                You must be at least 18 years of age to use the Services, in compliance with the Malaysia Personal Data Protection Act 2010 (PDPA 2010). By using the Services, you represent and warrant that you meet this age requirement and that you have the legal capacity to enter into these Terms.
              </p>
              <p>
                If you are using the Services on behalf of a legal entity, you represent and warrant that you have the authority to bind that entity to these Terms, and &quot;you&quot; shall refer to that entity.
              </p>
            </div>

            {/* 2. Account Registration */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">2. Account Registration</h2>
              <p className="mb-4">
                To access certain features of the Services, you must register for an Account. When you register, you agree to provide accurate, current, and complete information about yourself. You are responsible for maintaining the confidentiality of your Account credentials, including any private keys associated with your $BSD Token Wallet.
              </p>
              <p className="mb-4">
                You are responsible for all activities that occur under your Account. You agree to immediately notify us of any unauthorized use of your Account or any other breach of security. We will not be liable for any loss or damage arising from your failure to comply with this section.
              </p>
              <p>
                We reserve the right to suspend or terminate your Account at any time for any reason, including if we reasonably believe that you have violated these Terms.
              </p>
            </div>

            {/* 3. User Types */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">3. User Types: Creators and Listeners</h2>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">3.1 Creators</h3>
              <p className="mb-4">
                Creators are users who upload, publish, and distribute music and other audio content through the Services. As a Creator, you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Retain ownership of all intellectual property rights in your original content;</li>
                <li>Grant Backstreet Dogs a non-exclusive, worldwide, royalty-free license to host, store, transmit, display, and distribute your content through the Services;</li>
                <li>Are solely responsible for ensuring you have all necessary rights, licenses, and permissions for all content you upload;</li>
                <li>May set pricing for your tracks, NFTs, and streaming rates within the parameters provided by the platform;</li>
                <li>Receive revenue payments in accordance with the platform&apos;s revenue share model (90% streaming revenue, 97.5% of direct sales, and 10% resale royalties).</li>
              </ul>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">3.2 Listeners</h3>
              <p className="mb-4">
                Listeners are users who access, stream, purchase, and collect music and other content through the Services. As a Listener, you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>May stream content available on the platform subject to applicable subscription or per-play fees;</li>
                <li>May purchase music NFTs, which grant you ownership of the digital asset but not ownership of the underlying intellectual property;</li>
                <li>May resell or transfer NFTs you own, subject to the terms and conditions of the applicable smart contract;</li>
                <li>Agree not to reproduce, distribute, or publicly perform content from the platform without authorization from the Creator.</li>
              </ul>
            </div>

            {/* 4. $BSD Token */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">4. $BSD Token</h2>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">4.1 General</h3>
              <p className="mb-4">
                The $BSD Token is a digital asset that powers the Backstreet Dogs ecosystem. $BSD Tokens may be used for various purposes within the platform, including streaming payments, content purchases, governance voting, staking, and participation in $BSD Rewards programs.
              </p>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">4.2 $BSD Token Wallet</h3>
              <p className="mb-4">
                You may create or connect a $BSD Token Wallet through the Services to hold, send, and receive $BSD Tokens and other digital assets. You are solely responsible for maintaining the security of your wallet and private keys. Backstreet Dogs does not have access to your private keys and cannot recover them if lost.
              </p>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">4.3 $BSD Rewards</h3>
              <p className="mb-4">
                $BSD Rewards is a program through which users may earn $BSD Tokens based on their engagement and contributions to the platform. The terms, conditions, and distribution mechanics of $BSD Rewards may change at any time at our discretion.
              </p>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">4.4 Peer-to-Peer Transactions</h3>
              <p className="mb-4">
                The Services may facilitate peer-to-peer transactions between users. These transactions are executed through smart contracts on the blockchain and are irreversible once confirmed. Backstreet Dogs is not a party to these transactions and is not responsible for any disputes arising from peer-to-peer transactions.
              </p>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">4.5 Risks of Digital Assets</h3>
              <p>
                You acknowledge and agree that digital assets, including $BSD Tokens and music NFTs, are subject to high market volatility and risk. The value of digital assets may fluctuate significantly, and you may lose some or all of your investment. Backstreet Dogs makes no guarantees regarding the value, utility, or future availability of $BSD Tokens.
              </p>
            </div>

            {/* 5. NFTs and Digital Collectibles */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">5. NFTs and Digital Collectibles</h2>
              <p className="mb-4">
                Backstreet Dogs enables Creators to mint and sell music as NFTs (Non-Fungible Tokens) on supported blockchain networks. When you purchase an NFT on the platform:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>You acquire ownership of the NFT (the digital token), but not ownership of the underlying intellectual property or copyright in the music;</li>
                <li>You may resell or transfer the NFT, subject to the applicable smart contract terms, including Creator royalty provisions;</li>
                <li>Resale royalties (typically 10%) are automatically distributed to the original Creator through the smart contract;</li>
                <li>NFT ownership is recorded on the blockchain and is subject to the immutable nature of blockchain records;</li>
                <li>Backstreet Dogs does not guarantee the continued availability, accessibility, or value of any NFT.</li>
              </ul>
            </div>

            {/* 6. Intellectual Property */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">6. Intellectual Property</h2>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">6.1 BSD Platform IP</h3>
              <p className="mb-4">
                The Services, including all content, features, and functionality (including but not limited to design, text, graphics, logos, icons, images, audio clips, software, and the compilation thereof), are owned by Backstreet Dogs, its licensors, or other providers and are protected by intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of the Services without our prior written consent.
              </p>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">6.2 Creator Content</h3>
              <p className="mb-4">
                Creators retain all intellectual property rights in their original content uploaded to the platform. By uploading content, Creators grant Backstreet Dogs a non-exclusive, worldwide, royalty-free, sublicensable license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content in connection with operating and providing the Services.
              </p>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">6.3 Trademarks</h3>
              <p>
                &quot;Backstreet Dogs,&quot; &quot;BSD,&quot; the BSD logo, and other marks are trademarks of Ezy Work Asia Solution. You may not use these trademarks without our prior written permission.
              </p>
            </div>

            {/* 7. DMCA and Copyright */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">7. DMCA and Copyright Policy</h2>
              <p className="mb-4">
                Backstreet Dogs respects the intellectual property rights of others and expects users of the Services to do the same. We will respond to notices of alleged copyright infringement that comply with applicable law and are properly provided to us.
              </p>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">7.1 Copyright Strike System</h3>
              <p className="mb-4">
                Backstreet Dogs implements a copyright strike system. Repeated infringement may result in:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li><strong className="text-white">First Strike:</strong> Warning and content removal;</li>
                <li><strong className="text-white">Second Strike:</strong> Temporary suspension of upload privileges;</li>
                <li><strong className="text-white">Third Strike:</strong> Permanent account termination and removal of all content.</li>
              </ul>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">7.2 DMCA Takedown Notices</h3>
              <p className="mb-4">
                If you believe that content available on or through the Services infringes your copyright, you may submit a DMCA takedown notice to our designated agent at:
              </p>
              <div className="bg-white/5 border border-white/10 rounded-[14px] p-6 mb-4">
                <p className="mb-2"><strong className="text-white">DMCA Agent</strong></p>
                <p className="mb-2">Ezy Work Asia Solution</p>
                <p className="mb-2">Kuala Lumpur, Malaysia</p>
                <p>Email: <a href="mailto:dmca@backstreetdogs.com" className="text-brand-red hover:underline">dmca@backstreetdogs.com</a></p>
              </div>
              <p>
                Your notice must include: (i) identification of the copyrighted work; (ii) identification of the infringing material; (iii) your contact information; (iv) a statement of good faith belief; (v) a statement of accuracy under penalty of perjury; and (vi) your physical or electronic signature.
              </p>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">7.3 Counter-Notification</h3>
              <p>
                If you believe your content was removed in error, you may submit a counter-notification to our DMCA agent with: (i) identification of the removed material; (ii) a statement under penalty of perjury that you have a good faith belief the material was removed in error; (iii) your contact information; and (iv) a statement consenting to jurisdiction.
              </p>
            </div>

            {/* 8. Prohibited Conduct */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">8. Prohibited Conduct</h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Upload, post, or transmit any content that infringes any patent, trademark, copyright, trade secret, or other intellectual property right of any party;</li>
                <li>Use the Services for any unlawful purpose or in violation of any applicable local, state, national, or international law, including Malaysian law;</li>
                <li>Manipulate or artificially inflate play counts, streaming numbers, or other metrics on the platform;</li>
                <li>Use bots, scripts, or automated tools to access the Services or collect data without our permission;</li>
                <li>Attempt to gain unauthorized access to the Services, user accounts, or computer systems connected to the Services;</li>
                <li>Engage in market manipulation, wash trading, or other deceptive practices involving $BSD Tokens or NFTs;</li>
                <li>Upload content that is defamatory, obscene, abusive, invasive of privacy, or otherwise objectionable;</li>
                <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation with a person or entity;</li>
                <li>Interfere with or disrupt the Services, servers, or networks connected to the Services;</li>
                <li>Use the Services to launder money or finance terrorism, or engage in any activity that violates anti-money laundering laws.</li>
              </ul>
            </div>

            {/* 9. Governance */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">9. Governance and Node Operators</h2>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">9.1 Decentralized Governance</h3>
              <p className="mb-4">
                Backstreet Dogs operates a decentralized governance model that allows $BSD Token holders to participate in platform governance decisions. Governance proposals and votes may be submitted and recorded on-chain. Participation in governance is voluntary and subject to the governance rules published on the platform.
              </p>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">9.2 Node Operators</h3>
              <p>
                Users may operate nodes on the Backstreet Dogs network to support the platform&apos;s decentralized infrastructure. Node operators agree to: (i) maintain node uptime and performance standards; (ii) comply with the network&apos;s technical requirements; (iii) stake the required amount of $BSD Tokens; and (iv) abide by the governance decisions of the network. Node operator rewards and penalties are governed by the applicable smart contracts and protocol rules.
              </p>
            </div>

            {/* 10. Disclaimers */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">10. Disclaimers</h2>
              <p className="mb-4">
                THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="mb-4">
                WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICES OR THE SERVERS THAT MAKE THE SERVICES AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>
              <p>
                WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE CONTENT ON THE SERVICES OR THE CONTENT OF ANY WEBSITES LINKED TO THE SERVICES. BLOCKCHAIN TRANSACTIONS ARE IRREVERSIBLE, AND WE ARE NOT RESPONSIBLE FOR ANY LOSSES ARISING FROM BLOCKCHAIN TRANSACTIONS.
              </p>
            </div>

            {/* 11. Limitation of Liability */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">11. Limitation of Liability</h2>
              <p className="mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL BACKSTREET DOGS, EZY WORK ASIA SOLUTION, OR THEIR DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your access to or use of (or inability to access or use) the Services;</li>
                <li>Any conduct or content of any third party on the Services;</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content;</li>
                <li>Loss of $BSD Tokens, NFTs, or other digital assets;</li>
                <li>Fluctuations in the value of $BSD Tokens or other digital assets;</li>
                <li>Smart contract failures, bugs, or vulnerabilities;</li>
                <li>Any errors, mistakes, or inaccuracies of content on the Services.</li>
              </ul>
            </div>

            {/* 12. Indemnification */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">12. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless Backstreet Dogs, Ezy Work Asia Solution, and their officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising out of or relating to your violation of these Terms or your use of the Services, including but not limited to your content, any use of the Services&apos; content other than as expressly authorized in these Terms, or your use of any information obtained from the Services.
              </p>
            </div>

            {/* 13. Governing Law */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">13. Governing Law and Dispute Resolution</h2>
              <p className="mb-4">
                These Terms shall be governed by and construed in accordance with the laws of Malaysia, without regard to its conflict of law provisions. The Malaysia Personal Data Protection Act 2010 (PDPA 2010) shall apply to all matters relating to personal data processing.
              </p>
              <p>
                Any dispute arising out of or in connection with these Terms shall first be attempted to be resolved through good faith negotiations. If the dispute cannot be resolved through negotiations within thirty (30) days, it shall be referred to and finally resolved by arbitration in Kuala Lumpur, Malaysia, in accordance with the rules of the Asian International Arbitration Centre (AIAC).
              </p>
            </div>

            {/* 14. Termination */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">14. Termination</h2>
              <p className="mb-4">
                We may terminate or suspend your Account and access to the Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
              </p>
              <p className="mb-4">
                Upon termination: (i) your right to use the Services will immediately cease; (ii) any $BSD Tokens or digital assets in your wallet remain yours and accessible through the blockchain; (iii) Creator content may be removed from the platform but blockchain records remain; (iv) provisions that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
              <p>
                You may terminate your Account at any time by contacting us at <a href="mailto:legal@backstreetdogs.com" className="text-brand-red hover:underline">legal@backstreetdogs.com</a>.
              </p>
            </div>

            {/* 15. Changes to Terms */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">15. Changes to These Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Services after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </div>

            {/* 16. Contact */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">16. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-white/5 border border-white/10 rounded-[14px] p-6">
                <p className="mb-2"><strong className="text-white">Ezy Work Asia Solution</strong></p>
                <p className="mb-2">SSM: 002944700-D</p>
                <p className="mb-2">Kuala Lumpur, Malaysia</p>
                <p className="mb-2">Email: <a href="mailto:legal@backstreetdogs.com" className="text-brand-red hover:underline">legal@backstreetdogs.com</a></p>
                <p>DMCA Agent: <a href="mailto:dmca@backstreetdogs.com" className="text-brand-red hover:underline">dmca@backstreetdogs.com</a></p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== GRUNGE TEXTURE ===== */}
      <div className="relative w-full h-[229px] overflow-hidden opacity-30">
        <img src="/images/artist/texture-grunge.png" alt="" className="w-full h-full object-cover" />
      </div>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
}
