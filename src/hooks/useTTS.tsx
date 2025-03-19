
import { useState, useCallback, useEffect } from 'react';
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Force load voices
      speechSynthesis.getVoices();
      
      // Handle speech end
      const handleSpeechEnd = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesis.addEventListener('end', handleSpeechEnd);
      
      return () => {
        speechSynthesis.removeEventListener('end', handleSpeechEnd);
        // Cancel any ongoing speech when component unmounts
        speechSynthesis.cancel();
      };
    }
  }, []);

  const generateSpeech = useCallback(async (text: string, options: TTSOptions): Promise<TTSResult | null> => {
    if (!text.trim()) {
      setError('Please enter text to convert to speech');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if Speech Synthesis is supported
      if (!('speechSynthesis' in window)) {
        throw new Error('Your browser does not support speech synthesis');
      }
      
      return new Promise((resolve) => {
        // Simulate API call delay
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(text);
          
          // Set voice if available in browser
          const voices = window.speechSynthesis.getVoices();
          // Try to match by name or fallback to first voice
          const matchingVoice = voices.find(v => 
            v.name.toLowerCase().includes(options.voice.name.toLowerCase())
          ) || voices[0];
          
          if (matchingVoice) {
            utterance.voice = matchingVoice;
          }
          
          // Set rate and pitch
          utterance.rate = options.speed;
          utterance.pitch = options.pitch;
          
          // Handle speech start
          utterance.onstart = () => {
            setIsSpeaking(true);
          };
          
          // Handle speech end
          utterance.onend = () => {
            setIsSpeaking(false);
            setIsLoading(false);
          };
          
          // Handle speech error
          utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            setError('Speech synthesis failed');
            setIsSpeaking(false);
            setIsLoading(false);
          };
          
          // Speak the text
          window.speechSynthesis.cancel(); // Cancel any ongoing speech
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
        }, 500);
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
  
  const stopSpeech = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    generateSpeech,
    clearHistory,
    stopSpeech,
    isLoading,
    error,
    history,
    availableVoices,
    isSpeaking
  };
};
