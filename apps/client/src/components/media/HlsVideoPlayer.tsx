// ==========================================
// HlsVideoPlayer — hls.js wrapper for HLS streaming
// Safari native fallback, muted autoplay, tap-to-unmute
// ==========================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

interface HlsVideoPlayerProps {
  src: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
  aspectRatio?: string;
  onPlay?: () => void;
  onPause?: () => void;
}

const HlsVideoPlayer: React.FC<HlsVideoPlayerProps> = ({
  src,
  autoPlay = false,
  muted: initialMuted = true,
  controls = false,
  poster,
  aspectRatio = '9 / 16',
  onPlay,
  onPause,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Initialize HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        startLevel: -1,
        enableWorker: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hlsRef.current = hls;

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS
      video.src = src;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  // Track play/pause state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => { setIsPlaying(true); onPlay?.(); };
    const handlePause = () => { setIsPlaying(false); onPause?.(); };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [onPlay, onPause]);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [isPlaying, showControls]);

  return (
    <Box
      onClick={togglePlay}
      onMouseMove={() => setShowControls(true)}
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        bgcolor: '#000',
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        '& video': {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        },
      }}
    >
      <video
        ref={videoRef}
        autoPlay={autoPlay}
        muted={isMuted}
        controls={controls}
        playsInline
        loop
        poster={poster}
      />

      {/* Overlay controls */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <IconButton onClick={togglePlay} size="small" sx={{ color: '#fff' }}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>

        <IconButton onClick={toggleMute} size="small" sx={{ color: '#fff' }}>
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
      </Box>

      {/* Tap to unmute badge */}
      {isMuted && isPlaying && (
        <Box
          onClick={toggleMute}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            bgcolor: 'rgba(0,0,0,0.6)',
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <VolumeOffIcon sx={{ fontSize: 14 }} /> Tap to unmute
        </Box>
      )}
    </Box>
  );
};

export default HlsVideoPlayer;
