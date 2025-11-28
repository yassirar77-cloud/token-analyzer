'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Upload, TrendingUp, DollarSign, Music, Plus } from 'lucide-react';
import { trackApi } from '@/lib/api';
import toast from 'react-hot-toast';
import UploadTrackModal from '@/components/UploadTrackModal';

export default function ArtistDashboard() {
  const { address, isConnected } = useAccount();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalStreams: 0,
    totalRevenue: '0',
    totalTracks: 0,
    totalSales: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      loadArtistData();
    }
  }, [isConnected, address]);

  const loadArtistData = async () => {
    try {
      // Load artist's tracks
      const response = await trackApi.getAll({ artistId: address });
      setTracks(response.data);

      // Calculate overall analytics
      let totalStreams = 0;
      let totalRevenue = 0;
      let totalSales = 0;

      for (const track of response.data) {
        const analytics = await trackApi.getAnalytics(track.id);
        totalStreams += analytics.data.streams || 0;
        totalRevenue += parseFloat(analytics.data.revenue || '0');
        totalSales += analytics.data.purchases || 0;
      }

      setAnalytics({
        totalStreams,
        totalRevenue: totalRevenue.toString(),
        totalTracks: response.data.length,
        totalSales,
      });
    } catch (error) {
      console.error('Error loading artist data:', error);
      toast.error('Failed to load artist data');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <Music className="w-16 h-16 text-primary-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-400">
          Connect your wallet to access the artist dashboard
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Artist Dashboard</h1>
          <p className="text-gray-400">Manage your music and track your earnings</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Upload Track
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          icon={<Music className="w-6 h-6" />}
          label="Total Tracks"
          value={analytics.totalTracks}
          color="primary"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Total Streams"
          value={analytics.totalStreams.toLocaleString()}
          color="blue"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6" />}
          label="Total Revenue"
          value={`${parseFloat(analytics.totalRevenue).toFixed(2)} BSD`}
          color="green"
        />
        <StatCard
          icon={<Upload className="w-6 h-6" />}
          label="Total Sales"
          value={analytics.totalSales}
          color="purple"
        />
      </div>

      {/* Tracks List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Tracks</h2>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-20 bg-dark-700 rounded" />
              </div>
            ))}
          </div>
        ) : tracks.length === 0 ? (
          <div className="card text-center py-12">
            <Music className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No tracks uploaded yet</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary"
            >
              Upload Your First Track
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tracks.map((track: any) => (
              <TrackRow key={track.id} track={track} />
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadTrackModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            loadArtistData();
          }}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  const colorClasses = {
    primary: 'text-primary-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
  };

  return (
    <div className="card">
      <div className={`${colorClasses[color as keyof typeof colorClasses]} mb-2`}>
        {icon}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function TrackRow({ track }: { track: any }) {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await trackApi.getAnalytics(track.id);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-4">
        {track.coverImage && (
          <img
            src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${track.coverImage}`}
            alt={track.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <h3 className="font-semibold">{track.title}</h3>
          <p className="text-sm text-gray-400">{track.artist}</p>
        </div>
        {analytics && (
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-xl font-bold">{analytics.streams}</div>
              <div className="text-xs text-gray-400">Streams</div>
            </div>
            <div>
              <div className="text-xl font-bold">{analytics.purchases}</div>
              <div className="text-xs text-gray-400">Sales</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-500">
                {parseFloat(analytics.revenue || '0').toFixed(2)} BSD
              </div>
              <div className="text-xs text-gray-400">Revenue</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
