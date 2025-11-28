'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  trackUrl: string;
  title: string;
  artist: string;
  coverImage?: string;
}

export default function MusicPlayer({ trackUrl, title, artist, coverImage }: MusicPlayerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  useEffect(() => {
    if (!waveformRef.current) return;

    // Initialize WaveSurfer
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4a4a4a',
      progressColor: '#d946ef',
      cursorColor: '#d946ef',
      barWidth: 2,
      barRadius: 3,
      height: 80,
      normalize: true,
      backend: 'WebAudio',
    });

    // Load audio
    wavesurfer.current.load(trackUrl);

    // Event listeners
    wavesurfer.current.on('ready', () => {
      setDuration(formatTime(wavesurfer.current?.getDuration() || 0));
    });

    wavesurfer.current.on('audioprocess', () => {
      setCurrentTime(formatTime(wavesurfer.current?.getCurrentTime() || 0));
    });

    wavesurfer.current.on('finish', () => {
      setPlaying(false);
    });

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [trackUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setPlaying(!playing);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    wavesurfer.current?.setVolume(newVolume);
    if (newVolume > 0) setMuted(false);
  };

  const toggleMute = () => {
    if (muted) {
      wavesurfer.current?.setVolume(volume);
      setMuted(false);
    } else {
      wavesurfer.current?.setVolume(0);
      setMuted(true);
    }
  };

  const skipBackward = () => {
    const current = wavesurfer.current?.getCurrentTime() || 0;
    wavesurfer.current?.seekTo(Math.max(0, current - 10) / (wavesurfer.current?.getDuration() || 1));
  };

  const skipForward = () => {
    const current = wavesurfer.current?.getCurrentTime() || 0;
    const duration = wavesurfer.current?.getDuration() || 0;
    wavesurfer.current?.seekTo(Math.min(duration, current + 10) / duration);
  };

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
      {/* Track Info */}
      <div className="flex items-center gap-4 mb-6">
        {coverImage && (
          <img
            src={coverImage}
            alt={title}
            className="w-16 h-16 rounded-lg object-cover"
          />
        )}
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-gray-400">{artist}</p>
        </div>
      </div>

      {/* Waveform */}
      <div ref={waveformRef} className="waveform-container mb-4" />

      {/* Time */}
      <div className="flex justify-between text-sm text-gray-400 mb-4">
        <span>{currentTime}</span>
        <span>{duration}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={skipBackward}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          <button
            onClick={togglePlayPause}
            className="bg-primary-600 hover:bg-primary-700 rounded-full p-3 transition-colors"
          >
            {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
          <button
            onClick={skipForward}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="text-gray-400 hover:text-white">
            {muted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
}
