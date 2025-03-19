
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Voice } from '@/types';

interface VoiceSelectorProps {
  voices: Voice[];
  selectedVoice: Voice;
  onSelectVoice: (voice: Voice) => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  pitch: number;
  onPitchChange: (value: number) => void;
}

const VoiceSelector = ({
  voices,
  selectedVoice,
  onSelectVoice,
  speed,
  onSpeedChange,
  pitch,
  onPitchChange
}: VoiceSelectorProps) => {
  return (
    <div className="space-y-6 p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border">
      <div className="space-y-2">
        <Label htmlFor="voice-select" className="text-sm font-medium">Voice</Label>
        <Select
          value={selectedVoice.id}
          onValueChange={(value) => {
            const voice = voices.find(v => v.id === value);
            if (voice) onSelectVoice(voice);
          }}
        >
          <SelectTrigger id="voice-select" className="w-full">
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            {voices.map((voice) => (
              <SelectItem 
                key={voice.id} 
                value={voice.id}
                className="flex flex-col items-start py-2"
              >
                <span className="font-medium">{voice.name}</span>
                {voice.description && (
                  <span className="text-xs text-muted-foreground mt-1">{voice.description}</span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="speed-slider" className="text-sm font-medium">Speed</Label>
          <span className="text-xs font-medium text-muted-foreground">{speed.toFixed(1)}x</span>
        </div>
        <Slider
          id="speed-slider"
          min={0.5}
          max={2}
          step={0.1}
          value={[speed]}
          onValueChange={(values) => onSpeedChange(values[0])}
          className="py-2"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="pitch-slider" className="text-sm font-medium">Pitch</Label>
          <span className="text-xs font-medium text-muted-foreground">{pitch.toFixed(1)}</span>
        </div>
        <Slider
          id="pitch-slider"
          min={0.5}
          max={2}
          step={0.1}
          value={[pitch]}
          onValueChange={(values) => onPitchChange(values[0])}
          className="py-2"
        />
      </div>
    </div>
  );
};

export default VoiceSelector;
