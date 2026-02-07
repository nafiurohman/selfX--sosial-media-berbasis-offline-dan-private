import { useState, useRef, useEffect } from 'react';
import { X, Check, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoThumbnailPickerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  onSelect: (thumbnailUrl: string) => void;
}

export function VideoThumbnailPicker({ isOpen, onClose, videoUrl, onSelect }: VideoThumbnailPickerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.src = videoUrl;
    }
  }, [isOpen, videoUrl]);

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration;
    setDuration(dur);
    generateThumbnails(dur);
  };

  const generateThumbnails = async (dur: number) => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const thumbs: string[] = [];
    const count = 6; // Generate 6 thumbnails

    for (let i = 0; i < count; i++) {
      const time = (dur / count) * i;
      video.currentTime = time;

      await new Promise<void>((resolve) => {
        video.onseeked = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          thumbs.push(canvas.toDataURL('image/jpeg', 0.7));
          resolve();
        };
      });
    }

    setThumbnails(thumbs);
  };

  const handleTimeChange = ([time]: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const captureThumbnail = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);

    const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
    onSelect(thumbnailUrl);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-4 md:inset-10 z-50 bg-background rounded-2xl flex flex-col overflow-hidden max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold">Pilih Thumbnail Video</h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Video Preview */}
            <div className="flex-1 flex items-center justify-center p-4 bg-secondary/20">
              <video
                ref={videoRef}
                onLoadedMetadata={handleLoadedMetadata}
                className="max-w-full max-h-[50vh] rounded-lg"
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-border space-y-4">
              {/* Timeline Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">
                    Waktu: {formatTime(currentTime)} / {formatTime(duration)}
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => videoRef.current?.play()}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                </div>
                <Slider
                  value={[currentTime]}
                  onValueChange={handleTimeChange}
                  min={0}
                  max={duration}
                  step={0.1}
                  disabled={!duration}
                />
              </div>

              {/* Thumbnail Grid */}
              {thumbnails.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Pilih Cepat
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {thumbnails.map((thumb, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedIndex(index);
                          const time = (duration / thumbnails.length) * index;
                          handleTimeChange([time]);
                        }}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                          selectedIndex === index
                            ? 'border-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <img
                          src={thumb}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full aspect-video object-cover"
                        />
                        {selectedIndex === index && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <Check className="w-6 h-6 text-primary" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Batal
              </Button>
              <Button onClick={captureThumbnail} className="flex-1">
                <Check className="w-4 h-4 mr-2" />
                Gunakan Frame Ini
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
