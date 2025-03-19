
import { useState, useCallback } from 'react';
import { Voice, TTSOptions, TTSResult } from '@/types';

// Mock voices for the initial version
export const availableVoices: Voice[] = [
  { id: 'aria', name: 'Aria', description: 'Clear and articulate female voice' },
  { id: 'roger', name: 'Roger', description: 'Deep and resonant male voice' },
  { id: 'sarah', name: 'Sarah', description: 'Warm and friendly female voice' },
  { id: 'charlie', name: 'Charlie', description: 'Young and energetic male voice' },
  { id: 'laura', name: 'Laura', description: 'Professional female voice' },
  { id: 'george', name: 'George', description: 'Authoritative male voice' },
];

export const useTTS = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<TTSResult[]>([]);

  const generateSpeech = useCallback(async (text: string, options: TTSOptions): Promise<TTSResult | null> => {
    if (!text.trim()) {
      setError('Please enter text to convert to speech');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call an API
      // For now, we'll use the built-in Web Speech API as a fallback
      return new Promise((resolve) => {
        // Simulate API call delay
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(text);
          
          // Set voice if available in browser
          const voices = window.speechSynthesis.getVoices();
          if (voices.length) {
            utterance.voice = voices[0];
          }
          
          // Set rate and pitch
          utterance.rate = options.speed;
          utterance.pitch = options.pitch;
          
          // Speak the text
          window.speechSynthesis.speak(utterance);
          
          // Create result object
          const result: TTSResult = {
            id: Date.now().toString(),
            text,
            audio: '', // In a real app, this would be a base64 string or URL
            timestamp: new Date(),
            options
          };
          
          // Add to history
          setHistory(prev => [result, ...prev]);
          
          resolve(result);
          setIsLoading(false);
        }, 1000);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate speech');
      setIsLoading(false);
      return null;
    }
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    generateSpeech,
    clearHistory,
    isLoading,
    error,
    history,
    availableVoices
  };
};
