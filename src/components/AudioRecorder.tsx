import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/lib/toast';

const MAX_DURATION = 180; // 3 minutes

interface AudioRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (audioUrl: string, duration: number) => void;
}

export function AudioRecorder({ isOpen, onClose, onSave }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkPermission();
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const checkPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setHasPermission(result.state === 'granted');
      result.addEventListener('change', () => setHasPermission(result.state === 'granted'));
    } catch {
      setHasPermission(null);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev + 1 >= MAX_DURATION) {
            stopRecording();
            toast.info('Rekaman otomatis berhenti (maks 3 menit)');
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error: any) {
      setHasPermission(false);
      if (error.name === 'NotAllowedError') {
        toast.error('Izin mikrofon ditolak');
      } else {
        toast.error('Gagal mengakses mikrofon');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleSave = async () => {
    if (!audioUrl) return;
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        onSave(reader.result as string, duration);
        onClose();
      };
      reader.readAsDataURL(blob);
    } catch {
      toast.error('Gagal menyimpan audio');
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 md:w-[90%] md:max-w-md"
          >
            <div className="modern-card rounded-t-3xl md:rounded-2xl p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Rekam Audio</h3>
                </div>
                <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Timer */}
              <div className="text-center mb-6">
                <div className="text-5xl font-mono font-bold tabular-nums mb-2">{formatTime(duration)}</div>
                {isRecording && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Merekam... (Maks 3:00)
                  </div>
                )}
                {audioUrl && (
                  <p className="text-sm text-muted-foreground">Durasi rekaman</p>
                )}
              </div>

              {/* Waveform Visualization */}
              {isRecording && (
                <div className="flex items-center justify-center gap-1 h-24 mb-6">
                  {[...Array(25)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary rounded-full"
                      animate={{
                        height: [12, Math.random() * 80 + 30, 12],
                      }}
                      transition={{
                        duration: 0.3 + Math.random() * 0.2,
                        repeat: Infinity,
                        delay: i * 0.03,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Permission Warning */}
              {hasPermission === false && (
                <div className="flex gap-3 p-3 mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    <p className="font-medium">Izin mikrofon diperlukan</p>
                    <p className="text-xs mt-1">Aktifkan di pengaturan browser</p>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                {!audioUrl ? (
                  isRecording ? (
                    <button
                      onClick={stopRecording}
                      className="w-16 h-16 rounded-full bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all shadow-lg"
                    >
                      <Square className="w-6 h-6 mx-auto" />
                    </button>
                  ) : (
                    <button
                      onClick={startRecording}
                      className="w-16 h-16 rounded-full bg-primary text-white hover:bg-primary/90 active:scale-95 transition-all shadow-lg"
                    >
                      <Mic className="w-6 h-6 mx-auto" />
                    </button>
                  )
                ) : (
                  <>
                    <button
                      onClick={togglePlayback}
                      className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary/80 active:scale-95 transition-all flex items-center justify-center"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" style={{ marginLeft: '2px' }} />
                      )}
                    </button>
                    <button
                      onClick={() => { setAudioUrl(null); setDuration(0); setIsPlaying(false); }}
                      className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary/80 active:scale-95 transition-all flex items-center justify-center"
                    >
                      <Trash2 className="w-5 h-5 text-destructive" />
                    </button>
                    <button
                      onClick={handleSave}
                      className="w-16 h-16 rounded-full bg-primary text-white hover:bg-primary/90 active:scale-95 transition-all shadow-lg flex items-center justify-center"
                    >
                      <Check className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {audioUrl && (
                <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
