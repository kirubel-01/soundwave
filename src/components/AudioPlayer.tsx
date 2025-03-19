
import React, { useState } from 'react';
import { Play, Pause, Volume2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AudioPlayerProps {
  isGenerating: boolean;
  onPlay: () => void;
  className?: string;
}

const AudioPlayer = ({ isGenerating, onPlay, className }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      onPlay();
    } else {
      window.speechSynthesis.cancel();
    }
  };
  
  const handleDownload = () => {
    // In a real app, this would download the audio file
    console.log('Download not implemented in this demo');
  };

  return (
    <div className={cn("flex flex-col items-center gap-4 p-4", className)}>
      <div className="audio-visualizer">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "bar h-full",
              isPlaying ? `bg-primary animate-wave-${i + 1}` : "bg-muted-foreground/30",
              isGenerating && "animate-pulse-slow"
            )}
          />
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          disabled={isGenerating}
          onClick={handlePlayPause}
          className="w-12 h-12 rounded-full shadow-sm transition-all duration-300 hover:shadow-md"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>
        
        <Button
          size="icon"
          variant="outline"
          disabled={isGenerating || !isPlaying}
          onClick={handleDownload}
          className="w-10 h-10 rounded-full shadow-sm transition-all duration-300 hover:shadow-md"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AudioPlayer;
