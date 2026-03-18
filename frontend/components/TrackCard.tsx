'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Disc } from 'lucide-react';
import { TrackData } from '@/lib/api';
import { resolveIpfsCover } from '@/lib/ipfs';

interface TrackCardProps {
  track: TrackData;
}

export default function TrackCard({ track }: TrackCardProps) {
  const coverUrl = resolveIpfsCover(track.coverImage);

  return (
    <Link href={`/track/${track.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="card cursor-pointer group"
      >
        {/* Cover Image */}
        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
          <img
            src={coverUrl}
            alt={track.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Edition Badge */}
          {track.maxEditions && (
            <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Disc className="w-3 h-3" />
              {track.mintedEditions}/{track.maxEditions}
            </div>
          )}
        </div>

        {/* Track Info */}
        <h3 className="font-semibold mb-1 truncate">{track.title}</h3>
        <p className="text-sm text-gray-400 truncate">{track.artist}</p>

        {/* Price */}
        {track.streamingPrice && (
          <div className="mt-3 text-primary-500 font-semibold">
            {track.streamingPrice} BSD
          </div>
        )}
      </motion.div>
    </Link>
  );
}
