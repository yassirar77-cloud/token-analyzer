'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Music, Disc3, Users, TrendingUp } from 'lucide-react';
import FeaturedTracks from '@/components/FeaturedTracks';

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          Back Street Dogs
        </h1>
        <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          The decentralized music platform for underground musicians.
          Sell your music, own your art, connect with fans.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/explore" className="btn-primary text-lg px-8 py-3">
            Explore Music
          </Link>
          <Link href="/artist" className="btn-secondary text-lg px-8 py-3">
            Become an Artist
          </Link>
        </div>
      </motion.section>

      {/* Features */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={<Music className="w-8 h-8" />}
          title="Stream & Own"
          description="Buy streaming access or limited edition NFTs of your favorite tracks"
        />
        <FeatureCard
          icon={<Disc3 className="w-8 h-8" />}
          title="Limited Editions"
          description="Collect rare music NFTs with automatic artist royalties on resales"
        />
        <FeatureCard
          icon={<Users className="w-8 h-8" />}
          title="Direct Support"
          description="70% of revenue goes directly to artists, empowering creators"
        />
        <FeatureCard
          icon={<TrendingUp className="w-8 h-8" />}
          title="BSD Rewards"
          description="Earn reflections on every transaction with BSD tokens"
        />
      </section>

      {/* Featured Tracks */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Featured Tracks</h2>
        <FeaturedTracks />
      </section>

      {/* Stats */}
      <section className="bg-dark-800 rounded-2xl p-12">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-500 mb-2">10K+</div>
            <div className="text-gray-400">Tracks Available</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-500 mb-2">5K+</div>
            <div className="text-gray-400">Active Artists</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-500 mb-2">$2M+</div>
            <div className="text-gray-400">Paid to Artists</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <StepCard
            number="1"
            title="Connect Wallet"
            description="Connect your MetaMask wallet to get started"
          />
          <StepCard
            number="2"
            title="Discover Music"
            description="Browse tracks from underground musicians worldwide"
          />
          <StepCard
            number="3"
            title="Buy & Support"
            description="Purchase streaming access or NFTs with BSD tokens"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="card text-center"
    >
      <div className="text-primary-500 mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

function StepCard({ number, title, description }: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="card relative">
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-2xl font-bold">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 mt-4">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
