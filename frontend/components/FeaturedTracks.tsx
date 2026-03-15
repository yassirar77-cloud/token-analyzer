'use client';

import { useEffect, useState } from 'react';
import { trackApi, TrackData } from '@/lib/api';
import TrackCard from './TrackCard';

export default function FeaturedTracks() {
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      setError(null);
      const response = await trackApi.getAll({ limit: 8 });
      setTracks(response.data);
    } catch (err) {
      console.error('Error loading tracks:', err);
      setError('Failed to load tracks.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="aspect-square bg-dark-700 rounded-lg mb-4" />
            <div className="h-4 bg-dark-700 rounded mb-2" />
            <div className="h-3 bg-dark-700 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-12">
        {error}{' '}
        <button onClick={loadTracks} className="underline hover:text-red-300">Retry</button>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        No tracks available yet. Be the first to upload!
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  );
}
