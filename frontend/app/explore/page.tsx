'use client';

import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { trackApi } from '@/lib/api';
import TrackCard from '@/components/TrackCard';

const genres = ['All', 'Hip Hop', 'Rock', 'Electronic', 'Jazz', 'R&B', 'Pop', 'Indie'];

export default function ExplorePage() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadTracks();
  }, [selectedGenre, sortBy]);

  const loadTracks = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 50 };

      if (selectedGenre !== 'All') {
        params.genre = selectedGenre;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await trackApi.getAll(params);
      let fetchedTracks = response.data;

      // Client-side sorting
      if (sortBy === 'popular') {
        fetchedTracks.sort((a: any, b: any) => b.totalStreams - a.totalStreams);
      } else if (sortBy === 'price-low') {
        fetchedTracks.sort((a: any, b: any) =>
          parseFloat(a.streamingPrice || '0') - parseFloat(b.streamingPrice || '0')
        );
      } else if (sortBy === 'price-high') {
        fetchedTracks.sort((a: any, b: any) =>
          parseFloat(b.streamingPrice || '0') - parseFloat(a.streamingPrice || '0')
        );
      }

      setTracks(fetchedTracks);
    } catch (error) {
      console.error('Error loading tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadTracks();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Explore Music</h1>
        <p className="text-gray-400">
          Discover underground music from talented artists worldwide
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tracks, artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full pl-12"
            />
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Genre Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="input"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          {/* Results Count */}
          <div className="ml-auto text-sm text-gray-400">
            {tracks.length} tracks found
          </div>
        </div>
      </div>

      {/* Tracks Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-square bg-dark-700 rounded-lg mb-4" />
              <div className="h-4 bg-dark-700 rounded mb-2" />
              <div className="h-3 bg-dark-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : tracks.length === 0 ? (
        <div className="card text-center py-20">
          <p className="text-gray-400 mb-4">No tracks found</p>
          <button onClick={() => { setSearchQuery(''); setSelectedGenre('All'); loadTracks(); }} className="btn-secondary">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map((track: any) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      )}
    </div>
  );
}
