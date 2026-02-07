import { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LazyVideoProps {
  src: string;
  className?: string;
  aspectRatio?: string;
  autoPlay?: boolean;
}

export function LazyVideo({ src, className, aspectRatio, autoPlay = false }: LazyVideoProps) {
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden bg-secondary/30 group', className)}
      style={{ aspectRatio }}
    >
      {isInView ? (
        <>
          <video
            ref={videoRef}
            src={src}
            className="w-full h-full object-cover"
            loop
            playsInline
            preload="metadata"
            autoPlay={autoPlay}
            muted={autoPlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          
          {/* Play/Pause overlay */}
          {!autoPlay && (
            <button
              onClick={togglePlay}
              className={cn(
                'absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity',
                isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
              )}
            >
              {!isPlaying && (
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                  <Play className="w-8 h-8 text-black ml-1" />
                </div>
              )}
            </button>
          )}
        </>
      ) : (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-secondary/30 via-secondary/50 to-secondary/30" />
      )}
    </div>
  );
}
