'use client';

import { useState } from 'react';
import { analyzeToken, CHAINS } from '@/lib/goplusApi';
import { TokenAnalysis } from '@/types/token';
import TokenAnalyzer from '@/components/TokenAnalyzer';

export default function Home() {
  const [address, setAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState(1);
  const [analysis, setAnalysis] = useState<TokenAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError('Please enter a valid contract address (0x...)');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeToken(selectedChain, address);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze token');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Token Security Analyzer
          </h1>
          <p className="text-gray-400 text-lg">
            Detect honeypots, scams, and security risks in ERC-20 tokens
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-8">
          {/* Chain Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-300">
              Select Blockchain
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {CHAINS.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => setSelectedChain(chain.id)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                    selectedChain === chain.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-sm">{chain.shortName}</div>
                  <div className="text-xs opacity-70 hidden md:block">{chain.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Address Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Token Contract Address
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="0x..."
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
              />
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>

          {/* Example Addresses */}
          <div className="text-xs text-gray-500">
            <span className="mr-2">Try example:</span>
            <button
              onClick={() => setAddress('0xdAC17F958D2ee523a2206206994597C13D831ec7')}
              className="text-blue-400 hover:text-blue-300 underline mr-3"
            >
              USDT (ETH)
            </button>
            <button
              onClick={() => {
                setSelectedChain(56);
                setAddress('0x55d398326f99059fF775485246999027B3197955');
              }}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              USDT (BSC)
            </button>
          </div>
        </div>

        {/* Results */}
        <TokenAnalyzer analysis={analysis} loading={loading} error={error} />

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Powered by GoPlus Security API</p>
          <p className="mt-2">
            Always DYOR (Do Your Own Research) before investing in any token
          </p>
        </div>
      </div>
    </main>
  );
}
