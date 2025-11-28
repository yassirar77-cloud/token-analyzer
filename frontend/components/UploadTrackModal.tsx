'use client';

import { useState } from 'react';
import { X, Upload as UploadIcon } from 'lucide-react';
import { trackApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface UploadTrackModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadTrackModal({ onClose, onSuccess }: UploadTrackModalProps) {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    streamingPrice: '',
    nftPrice: '',
    maxEditions: '',
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioFile) {
      toast.error('Please select an audio file');
      return;
    }

    setUploading(true);

    try {
      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append('audio', audioFile);
      if (coverFile) uploadData.append('cover', coverFile);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('genre', formData.genre);
      uploadData.append('streamingPrice', formData.streamingPrice);
      uploadData.append('nftPrice', formData.nftPrice);
      uploadData.append('maxEditions', formData.maxEditions);

      // Upload to IPFS via backend
      const response = await trackApi.upload(uploadData);

      toast.success('Track uploaded to IPFS successfully!');
      toast('Now create the track on-chain...', { icon: '⏳' });

      // Here you would call the smart contract to create the track on-chain
      // For now, we'll just show a success message

      onSuccess();
    } catch (error: any) {
      console.error('Error uploading track:', error);
      toast.error(error.response?.data?.error || 'Failed to upload track');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-2xl font-bold">Upload Track</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Audio File */}
          <div>
            <label className="block text-sm font-medium mb-2">Audio File *</label>
            <div className="border-2 border-dashed border-dark-600 rounded-lg p-8 text-center hover:border-primary-600 transition-colors cursor-pointer">
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                className="hidden"
                id="audio-upload"
              />
              <label htmlFor="audio-upload" className="cursor-pointer">
                <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                {audioFile ? (
                  <p className="text-primary-500">{audioFile.name}</p>
                ) : (
                  <p className="text-gray-400">Click to upload audio file</p>
                )}
              </label>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium mb-2">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className="input w-full"
            />
            {coverFile && <p className="text-sm text-gray-400 mt-1">{coverFile.name}</p>}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input w-full"
              placeholder="Track title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input w-full h-24 resize-none"
              placeholder="Describe your track..."
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium mb-2">Genre</label>
            <select
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="input w-full"
            >
              <option value="">Select genre</option>
              <option value="Hip Hop">Hip Hop</option>
              <option value="Rock">Rock</option>
              <option value="Electronic">Electronic</option>
              <option value="Jazz">Jazz</option>
              <option value="R&B">R&B</option>
              <option value="Pop">Pop</option>
              <option value="Indie">Indie</option>
            </select>
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Streaming Price (BSD)</label>
              <input
                type="number"
                step="0.01"
                value={formData.streamingPrice}
                onChange={(e) => setFormData({ ...formData, streamingPrice: e.target.value })}
                className="input w-full"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">NFT Price (BSD)</label>
              <input
                type="number"
                step="0.01"
                value={formData.nftPrice}
                onChange={(e) => setFormData({ ...formData, nftPrice: e.target.value })}
                className="input w-full"
                placeholder="100"
              />
            </div>
          </div>

          {/* Max Editions */}
          <div>
            <label className="block text-sm font-medium mb-2">Max NFT Editions</label>
            <input
              type="number"
              value={formData.maxEditions}
              onChange={(e) => setFormData({ ...formData, maxEditions: e.target.value })}
              className="input w-full"
              placeholder="100"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Track'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
