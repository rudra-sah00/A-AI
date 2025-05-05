"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  stream: MediaStream | null;
  cameraId: string;
  cameraName: string;
  muted?: boolean;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  forceUpdate?: number; 
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  stream,
  cameraId,
  cameraName,
  muted = true,
  onFullscreenChange,
  forceUpdate
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(muted);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playAttempts, setPlayAttempts] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef<boolean>(false);
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Setup video element once on mount
  useEffect(() => {
    mountedRef.current = true;
    
    // Clean up on component unmount
    return () => {
      mountedRef.current = false;
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
      
      // Stop all tracks to ensure proper cleanup
      if (videoRef.current && videoRef.current.srcObject) {
        try {
          const mediaStream = videoRef.current.srcObject as MediaStream;
          mediaStream.getTracks().forEach(track => track.stop());
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  // Handle stream update with better error handling
  useEffect(() => {
    let isMounted = true;
    const videoElement = videoRef.current;
    
    if (!videoElement || !stream) return;

    const attemptPlay = async () => {
      if (!isMounted || !videoElement || !stream) return;
      
      try {
        // Make sure video is not detached from DOM
        if (!videoElement.isConnected) {
          return;
        }
        
        videoElement.srcObject = stream;
        videoElement.muted = isMuted;
        
        // Small delay before play to ensure stable playback
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!isMounted) return;
        
        // Attempt to play with timeout
        const playPromise = videoElement.play();
        
        // Using await inside a try/catch to handle any play failures
        await playPromise;
        
        if (isMounted) {
          setIsPlaying(true);
          console.log(`Video playing for camera ${cameraId}`);
        }
      } catch (err) {
        if (!isMounted) return;
        
        console.warn(`Play attempt failed for camera ${cameraId}:`, err);
        
        // Auto retry with increasing delay
        if (playAttempts < 5) {
          const retryDelay = Math.min(1000 * Math.pow(1.5, playAttempts), 10000);
          console.log(`Retrying play in ${retryDelay}ms (attempt ${playAttempts + 1})`);
          
          if (playTimeoutRef.current) {
            clearTimeout(playTimeoutRef.current);
          }
          
          playTimeoutRef.current = setTimeout(() => {
            if (isMounted) {
              setPlayAttempts(prev => prev + 1);
            }
          }, retryDelay);
        } else {
          // Last resort: always mute and try one more time
          try {
            videoElement.muted = true;
            await videoElement.play();
            setIsPlaying(true);
            if (isMounted) {
              setIsMuted(true);
            }
            console.log(`Video playing muted for camera ${cameraId} as fallback`);
          } catch (finalErr) {
            console.error(`All play attempts failed for camera ${cameraId}:`, finalErr);
          }
        }
      }
    };

    // Set stream first, then schedule play attempt
    videoElement.srcObject = stream;
    
    // Use requestAnimationFrame to ensure the browser is ready
    requestAnimationFrame(() => {
      if (isMounted) {
        attemptPlay();
      }
    });

    return () => {
      isMounted = false;
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, [stream, cameraId, isMuted, playAttempts, forceUpdate]);

  // Handle muted state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Setup video element event listeners
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handlePlaying = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleStalled = () => {
      console.warn(`Video stalled for camera ${cameraId}`);
      // Don't set isPlaying to false immediately, as it might recover
    };
    const handleError = (e: Event) => {
      console.error(`Video error for camera ${cameraId}:`, e);
      setIsPlaying(false);
      
      // Attempt to reconnect on serious errors
      if (videoElement.error && videoElement.error.code > 2) {
        setPlayAttempts(prev => prev + 1);
      }
    };
    
    videoElement.addEventListener('playing', handlePlaying);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('stalled', handleStalled);
    
    return () => {
      videoElement.removeEventListener('playing', handlePlaying);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('stalled', handleStalled);
    };
  }, [cameraId]);

  // Handle fullscreen toggle
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    
    try {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        } else if ((containerRef.current as any).mozRequestFullScreen) {
          await (containerRef.current as any).mozRequestFullScreen();
        } else if ((containerRef.current as any).msRequestFullscreen) {
          await (containerRef.current as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  // Setup fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement = 
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement;
      
      const isCurrentlyFullscreen = fullscreenElement === containerRef.current;
      setIsFullscreen(isCurrentlyFullscreen);
      
      // In fullscreen mode, unmute video
      if (isCurrentlyFullscreen && isMuted) {
        setIsMuted(false);
      } else if (!isCurrentlyFullscreen && !isMuted && isFullscreen) {
        // When exiting fullscreen, mute the video again
        setIsMuted(true);
      }
      
      // Notify parent component
      if (onFullscreenChange) {
        onFullscreenChange(isCurrentlyFullscreen);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isFullscreen, isMuted, onFullscreenChange]);

  // Toggle audio
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Handle double-click to fullscreen
  const handleDoubleClick = async (e: React.MouseEvent) => {
    // Prevent if clicking on controls
    if ((e.target as HTMLElement).closest('button')) return;
    await toggleFullscreen();
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative bg-black overflow-hidden h-full w-full ${isFullscreen ? 'fixed top-0 left-0 z-50' : ''}`}
      onDoubleClick={handleDoubleClick}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        autoPlay
        playsInline
        muted={isMuted}
      />
      
      {/* Camera name overlay */}
      <div className="absolute top-1 left-1 bg-black/50 rounded px-2 py-1 text-white text-xs font-medium">
        {cameraName}
      </div>
      
      {/* Controls overlay */}
      <div className="absolute bottom-1 right-1 flex space-x-1">
        <Button
          onClick={toggleMute}
          variant="secondary"
          size="icon"
          className="h-7 w-7 bg-black/50 hover:bg-black/70 text-white"
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </Button>
        
        <Button
          onClick={toggleFullscreen}
          variant="secondary"
          size="icon"
          className="h-7 w-7 bg-black/50 hover:bg-black/70 text-white"
        >
          {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
        </Button>
      </div>
      
      {/* Loading indicator */}
      {(!isPlaying && stream) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;