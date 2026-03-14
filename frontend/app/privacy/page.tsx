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

export default function PrivacyPolicyPage() {
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
            Privacy Policy
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
                This Privacy Policy describes how Ezy Work Asia Solution (SSM: 002944700-D) (&quot;Backstreet Dogs,&quot; &quot;BSD,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, and shares information in connection with your use of our Web3 music platform, websites, and services (collectively, the &quot;Services&quot;). This Privacy Policy does not apply to information our customers may process when using our Services.
              </p>
            </div>

            <div>
              <p>
                We may collect and receive information about users of our Services (&quot;users,&quot; &quot;you,&quot; or &quot;your&quot;) from various sources, including: (i) information you provide through your user account on the Services (your &quot;Account&quot;); (ii) your use of the Services; and (iii) from third-party websites, services, and partners. We recommend that you read this Privacy Policy in full, including the additional details referred to in each section, to ensure you are fully informed.
              </p>
            </div>

            {/* 1. Information We Collect */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">1. Information We Collect</h2>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">1.1 Information You Provide</h3>
              <p className="mb-4">
                <strong className="text-white">Account Registration.</strong> When you register for an Account, we may ask for your contact information, including items such as name, email address, and wallet address. For Creators, we may collect additional information such as artist name, bio, profile image, and payment preferences.
              </p>
              <p className="mb-4">
                <strong className="text-white">$BSD Token Wallet.</strong> When you create or connect a $BSD Token Wallet through our Services, we collect your public wallet address. We do not collect or store your private keys. Transactions made through the $BSD Token Wallet are recorded on the blockchain and are publicly accessible.
              </p>
              <p className="mb-4">
                <strong className="text-white">Content Uploads.</strong> If you are a Creator, we collect the audio files, metadata, cover art, and any other content you upload to the platform, including information about licensing terms, pricing, and royalty settings.
              </p>
              <p className="mb-4">
                <strong className="text-white">Communications.</strong> If you contact us directly, we may receive additional information about you such as your name, email address, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
              </p>
              <p>
                <strong className="text-white">Payment Information.</strong> When you make purchases or receive payments through our Services, we may collect billing information, transaction history, and other payment-related data. Cryptocurrency transactions are processed on-chain and are publicly visible.
              </p>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">1.2 Information We Collect Automatically</h3>
              <p className="mb-4">
                <strong className="text-white">Usage Data.</strong> We automatically collect information about your interactions with the Services, including the pages or content you view, the tracks you stream or purchase, search queries, and other actions on the Services, including interaction with Creators, Listeners, and other users.
              </p>
              <p className="mb-4">
                <strong className="text-white">Device Information.</strong> We collect information about the device and software you use to access our Services, including internet protocol (IP) address, browser type, operating system, device identifiers, and related data.
              </p>
              <p className="mb-4">
                <strong className="text-white">Blockchain Data.</strong> We may collect publicly available blockchain data related to your wallet address, including token balances, transaction history, NFT ownership records, and smart contract interactions involving $BSD Tokens.
              </p>
              <p>
                <strong className="text-white">Cookies and Similar Technologies.</strong> We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings and other tools. For more information, see Section 6 (Cookies) below.
              </p>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">1.3 Information We Receive from Third Parties</h3>
              <p>
                We may receive information about you from third parties, including our business partners, marketing partners, social media platforms, blockchain data providers, and publicly available sources. We may combine this information with the other information we collect about you.
              </p>
            </div>

            {/* 2. How We Use Information */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">2. How We Use Information</h2>
              <p className="mb-4">We use the information we collect in various ways, including to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, operate, and maintain our Services, including the Web3 music platform, $BSD Token ecosystem, and NFT marketplace;</li>
                <li>Process transactions, including $BSD Token transfers, $BSD Rewards distributions, music NFT purchases and sales, and streaming payments;</li>
                <li>Improve, personalize, and expand our Services, including music recommendations, Creator discovery, and personalized content feeds;</li>
                <li>Understand and analyze how you use our Services to optimize platform performance and user experience;</li>
                <li>Develop new products, services, features, and functionality;</li>
                <li>Communicate with you, including for customer service, to provide updates and other information relating to the Services, and for marketing and promotional purposes;</li>
                <li>Facilitate peer-to-peer transactions and Creator-Listener interactions;</li>
                <li>Process and manage $BSD Rewards and token distribution programs;</li>
                <li>Manage governance participation and node operator activities;</li>
                <li>Detect, prevent, and address fraud, abuse, security risks, and technical issues;</li>
                <li>Comply with applicable laws, regulations, and legal processes, including the Malaysia Personal Data Protection Act 2010 (PDPA 2010).</li>
              </ul>
            </div>

            {/* 3. How We Share Information */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">3. How We Share Information</h2>
              <p className="mb-4">We may share the information we collect in various ways, including the following:</p>

              <p className="mb-4">
                <strong className="text-white">Blockchain Networks.</strong> Transactions conducted through the Services, including $BSD Token transfers, NFT purchases, and smart contract interactions, are recorded on public blockchain networks (including Solana and Ethereum/Base). This data is publicly visible and immutable.
              </p>
              <p className="mb-4">
                <strong className="text-white">Other Users.</strong> Certain information, such as your username, profile picture, listening activity, NFT collection, and Creator content, may be visible to other users of the Services. Creators&apos; content, including tracks and associated metadata, is available to Listeners and other users.
              </p>
              <p className="mb-4">
                <strong className="text-white">Service Providers.</strong> We may share information with third-party service providers that provide services on our behalf, such as hosting, data analytics, payment processing, customer service, IPFS/decentralized storage providers, and marketing assistance.
              </p>
              <p className="mb-4">
                <strong className="text-white">Business Transfers.</strong> Information may be disclosed and otherwise transferred to any potential acquirer, successor, or assignee as part of any proposed merger, acquisition, debt financing, sale of assets, or similar transaction.
              </p>
              <p className="mb-4">
                <strong className="text-white">Legal Requirements.</strong> We may disclose your information if required to do so by law or in the good faith belief that such action is necessary to (i) comply with a legal obligation, including requirements under the PDPA 2010; (ii) protect and defend our rights or property; (iii) prevent fraud or address security or technical issues; or (iv) protect the personal safety of users of the Services or the public.
              </p>
              <p>
                <strong className="text-white">With Your Consent.</strong> We may share your information with your consent or at your direction.
              </p>
            </div>

            {/* 4. Digital Assets and Blockchain */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">4. Digital Assets and Blockchain Privacy</h2>
              <p className="mb-4">
                The Backstreet Dogs platform operates on blockchain technology. Please be aware of the following privacy considerations specific to our Web3 platform:
              </p>
              <p className="mb-4">
                <strong className="text-white">$BSD Token Transactions.</strong> All $BSD Token transactions, including $BSD Rewards, peer-to-peer transfers, and smart contract interactions, are recorded on public blockchain networks. These records are permanent, immutable, and publicly accessible.
              </p>
              <p className="mb-4">
                <strong className="text-white">NFT Ownership.</strong> When you purchase, sell, or transfer music NFTs on the Backstreet Dogs platform, ownership records are stored on the blockchain. Your wallet address and transaction history related to NFTs are publicly visible.
              </p>
              <p className="mb-4">
                <strong className="text-white">$BSD Token Wallet.</strong> Your $BSD Token Wallet address is publicly associated with your on-chain activity. While wallet addresses are pseudonymous, they may be linked to your identity if you have shared your wallet address publicly or with third parties.
              </p>
              <p>
                <strong className="text-white">Node Operators.</strong> If you operate a node on the Backstreet Dogs network, certain operational data, including your node&apos;s public address and network contributions, may be publicly visible on the blockchain.
              </p>
            </div>

            {/* 5. Creator and Listener Data */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">5. Creator and Listener Data</h2>
              <p className="mb-4">
                <strong className="text-white">Creators.</strong> If you are a Creator on Backstreet Dogs, information related to your uploaded content, including track metadata, play counts, revenue earned, and royalty distributions, may be visible to you through your Creator dashboard. Certain information such as your artist name, profile, and content catalog is publicly available on the platform.
              </p>
              <p>
                <strong className="text-white">Listeners.</strong> If you are a Listener, your streaming activity, purchase history, NFT collection, and playlist data are stored to provide you with personalized recommendations and maintain your listening history. Certain activity may be visible to other users based on your privacy settings.
              </p>
            </div>

            {/* 6. Cookies */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">6. Cookies</h2>
              <p className="mb-4">
                We use cookies and similar tracking technologies to track the activity on our Services and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
              <p>
                We use both session cookies (which expire once you close your browser) and persistent cookies (which remain on your device until you delete them) to provide you with a more personal and interactive experience on our Services. We use cookies for authentication, preferences, analytics, and performance optimization.
              </p>
            </div>

            {/* 7. Data Retention */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">7. Data Retention</h2>
              <p className="mb-4">
                We retain the information we collect for as long as it is necessary and relevant to fulfil the purposes outlined in this Privacy Policy. In addition, we retain personal information to comply with applicable law where required, prevent fraud, resolve disputes, troubleshoot problems, assist with any investigation, and take other actions permitted by law, including as described in this Privacy Policy.
              </p>
              <p>
                Please note that data recorded on blockchain networks (including $BSD Token transactions, NFT ownership records, and smart contract interactions) is permanent and cannot be deleted due to the immutable nature of blockchain technology. This data persists independently of our Services.
              </p>
            </div>

            {/* 8. Data Security */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">8. Data Security</h2>
              <p>
                We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no Internet or email transmission is ever fully secure or error-free. In particular, email sent to or from the Services may not be secure. Therefore, you should take special care in deciding what information you send to us. Please keep this in mind when disclosing any information via the Internet. We implement security measures in accordance with the requirements of the PDPA 2010.
              </p>
            </div>

            {/* 9. Your Rights and Choices */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">9. Your Rights and Choices</h2>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">9.1 Rights Under PDPA 2010</h3>
              <p className="mb-4">
                If you are a data subject under the Malaysia Personal Data Protection Act 2010 (PDPA 2010), you have the following rights:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li><strong className="text-white">Right of Access:</strong> You have the right to request access to your personal data that we process.</li>
                <li><strong className="text-white">Right to Correct:</strong> You have the right to request correction of personal data that is inaccurate, incomplete, misleading, or not up-to-date.</li>
                <li><strong className="text-white">Right to Withdraw Consent:</strong> You have the right to withdraw your consent to the processing of your personal data at any time, subject to any legal or contractual restrictions.</li>
                <li><strong className="text-white">Right to Prevent Processing:</strong> You have the right to prevent processing that is likely to cause damage or distress.</li>
                <li><strong className="text-white">Right to Prevent Direct Marketing:</strong> You have the right to request that we stop processing your personal data for direct marketing purposes.</li>
              </ul>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">9.2 Rights Under CCPA (California Residents)</h3>
              <p className="mb-4">
                If you are a California resident, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Know what personal information is being collected about you;</li>
                <li>Know whether your personal information is sold or disclosed and to whom;</li>
                <li>Say no to the sale of personal information;</li>
                <li>Access your personal information;</li>
                <li>Request deletion of your personal information;</li>
                <li>Not be discriminated against for exercising your privacy rights.</li>
              </ul>

              <h3 className="font-display text-[18px] lg:text-[20px] text-white mb-3 mt-6">9.3 Account Information</h3>
              <p>
                You may update, correct, or delete information about your Account at any time by logging into your Account or by contacting us at <a href="mailto:legal@backstreetdogs.com" className="text-brand-red hover:underline">legal@backstreetdogs.com</a>. Please note that we may retain certain information as required by law or for legitimate business purposes, and that information recorded on the blockchain cannot be modified or deleted.
              </p>
            </div>

            {/* 10. DMCA and Copyright */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">10. DMCA and Copyright</h2>
              <p className="mb-4">
                Backstreet Dogs respects the intellectual property rights of others. We have implemented a copyright strike system to address potential infringement on our platform. If you believe that content available on or through our Services infringes your copyright, please submit a notice to our designated DMCA agent at <a href="mailto:dmca@backstreetdogs.com" className="text-brand-red hover:underline">dmca@backstreetdogs.com</a>.
              </p>
              <p>
                Information collected in connection with DMCA notices and copyright claims, including the identity of the claimant, the nature of the claim, and the content at issue, will be processed in accordance with this Privacy Policy and applicable law.
              </p>
            </div>

            {/* 11. Children's Privacy */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">11. Children&apos;s Privacy</h2>
              <p className="mb-4">
                Backstreet Dogs does not knowingly collect information from children under the age of 18, in compliance with the Malaysia Personal Data Protection Act 2010 (PDPA 2010). Children under 18 are not permitted to use the Services, including creating Accounts, purchasing or selling $BSD Tokens, or engaging in NFT transactions.
              </p>
              <p>
                If we become aware that a child under the age of 18 has provided us with personal information, we will take steps to delete such information. If you believe that we might have any information from or about a child under 18, please contact us at <a href="mailto:legal@backstreetdogs.com" className="text-brand-red hover:underline">legal@backstreetdogs.com</a>.
              </p>
            </div>

            {/* 12. International Data Transfers */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">12. International Data Transfers</h2>
              <p>
                Your information may be transferred to and maintained on servers or databases located outside of your state, province, country, or other jurisdiction where the privacy laws may not be as protective as those in your location. By using the Services, you consent to the transfer of your information to such locations. We take appropriate steps to ensure that any international transfers of personal data comply with the requirements of the PDPA 2010 and other applicable data protection laws.
              </p>
            </div>

            {/* 13. Governance and Node Operators */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">13. Governance and Node Operators</h2>
              <p className="mb-4">
                Backstreet Dogs operates a decentralized governance model. If you participate in governance voting or operate a node on the BSD network, the following applies:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Governance votes and proposals may be recorded on-chain and are publicly accessible;</li>
                <li>Node operator information, including node performance data and staking records, may be publicly visible;</li>
                <li>$BSD Token staking and delegation activities are recorded on the blockchain;</li>
                <li>Participation in governance does not require disclosure of personal identity beyond your wallet address.</li>
              </ul>
            </div>

            {/* 14. Changes to This Policy */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">14. Changes to This Privacy Policy</h2>
              <p>
                We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice (such as adding a statement to our website homepage or sending you a notification). We encourage you to review the Privacy Policy whenever you access the Services to stay informed about our information practices.
              </p>
            </div>

            {/* 15. Contact Us */}
            <div>
              <h2 className="font-display text-[22px] lg:text-[26px] text-white mb-4">15. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, or if you wish to exercise your rights under the PDPA 2010 or any other applicable data protection law, please contact us at:
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
