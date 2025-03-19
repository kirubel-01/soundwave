
import React, { useState } from 'react';
import { TTSResult } from '@/types';
import { Play, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface HistoryItemProps {
  item: TTSResult;
  onReplay: (item: TTSResult) => void;
}

const HistoryItem = ({ item, onReplay }: HistoryItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format the timestamp
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(item.timestamp);
  
  // Truncate text if it's too long
  const truncatedText = item.text.length > 90 
    ? `${item.text.substring(0, 90)}...` 
    : item.text;

  return (
    <div 
      className={cn(
        "relative p-4 rounded-lg border bg-white/50 backdrop-blur-sm shadow-sm",
        "transition-all duration-300 ease-in-out",
        "hover:shadow-md hover:bg-white/80",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">{formattedTime}</span>
        <span className="text-xs font-medium text-primary">{item.options.voice.name}</span>
      </div>
      
      <p className="text-sm text-foreground/90">{truncatedText}</p>
      
      <div className={cn(
        "absolute right-3 top-1/2 -translate-y-1/2 flex gap-2",
        "transition-opacity duration-200",
        isHovered ? "opacity-100" : "opacity-0"
      )}>
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8 rounded-full"
          onClick={() => onReplay(item)}
        >
          <Play className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default HistoryItem;
