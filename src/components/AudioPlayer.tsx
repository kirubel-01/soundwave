
import React from 'react';
import { Play, Pause, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface AudioPlayerProps {
  isGenerating: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  className?: string;
  audioSrc?: string; // Added audioSrc prop to access the audio data
}

const AudioPlayer = ({ 
  isGenerating, 
  isPlaying, 
  onPlay, 
  onPause,
  audioSrc,
  className 
}: AudioPlayerProps) => {
  const { toast } = useToast();
  
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };
  
  const handleDownload = () => {
    if (!audioSrc) {
      toast({
        title: "No audio available",
        description: "Please generate audio first before downloading.",
        variant: "destructive",
      });
      return;
    }

    // Create a temporary anchor element
    const downloadLink = document.createElement('a');
    downloadLink.href = audioSrc;
    downloadLink.download = `speech-${Date.now()}.mp3`; // Name the downloaded file
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    toast({
      title: "Download started",
      description: "Your audio file is being downloaded.",
      variant: "default",
    });
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="audio-visualizer flex items-end h-12 gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-2 bg-primary/80 rounded-full transition-all",
              isPlaying 
                ? `h-${Math.floor(Math.random() * 8) + 2} animate-pulse` 
                : "h-2",
              isGenerating && "animate-pulse"
            )}
            style={{
              height: isPlaying ? `${Math.floor(Math.random() * 24) + 8}px` : '8px',
              animationDelay: `${i * 0.1}s`
            }}
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
          disabled={isGenerating || !audioSrc}
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
