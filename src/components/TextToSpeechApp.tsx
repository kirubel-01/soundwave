import React, { useState, useEffect } from 'react';
import { useTTS, availableVoices } from '@/hooks/useTTS';
import TextInput from '@/components/TextInput';
import VoiceSelector from '@/components/VoiceSelector';
import AudioPlayer from '@/components/AudioPlayer';
import HistoryItem from '@/components/HistoryItem';
import { TTSResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, Settings, History, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
const TextToSpeechApp = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(availableVoices[0]);
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [activeTab, setActiveTab] = useState('convert');
  const {
    generateSpeech,
    stopSpeech,
    isLoading,
    error,
    history,
    isSpeaking,
    currentAudioUrl
  } = useTTS();
  const {
    toast
  } = useToast();

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Force prefetch voices
      window.speechSynthesis.getVoices();
    }
  }, []);
  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: "Text is required",
        description: "Please enter some text to convert to speech.",
        variant: "destructive"
      });
      return;
    }
    const options = {
      voice: selectedVoice,
      speed,
      pitch
    };
    const result = await generateSpeech(text, options);
    if (result) {
      toast({
        title: "Speech generated",
        description: "Your text has been converted to speech."
      });
    }
  };
  const handleStopSpeech = () => {
    stopSpeech();
  };
  const handleReplay = (item: TTSResult) => {
    setText(item.text);
    setSelectedVoice(item.options.voice);
    setSpeed(item.options.speed);
    setPitch(item.options.pitch);

    // Generate speech with the same options
    generateSpeech(item.text, item.options);

    // Switch to convert tab
    setActiveTab('convert');
  };
  return <div className="max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in">
      <div className="flex flex-col space-y-6">
        <header className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-3">
            <Mic className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Text to Speech</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Convert your text into natural-sounding speech with customizable voices and settings.
          </p>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="convert" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              <span>Convert</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span>History</span>
              {history.length > 0 && <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                  {history.length}
                </span>}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="convert" className="mt-6 animate-scale-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <TextInput value={text} onChange={setText} className="glass shadow-lg" />
                
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <AudioPlayer isGenerating={isLoading} isPlaying={isSpeaking} onPlay={handleGenerate} onPause={handleStopSpeech} audioSrc={currentAudioUrl || undefined} />
                  
                  <Button onClick={handleGenerate} disabled={isLoading || !text.trim()} className="w-full sm:w-auto min-w-[140px] bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all">
                    {isLoading ? <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </> : 'Generate Speech'}
                  </Button>
                </div>
                
                {error && <Alert variant="destructive" className="mt-4 animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>}
              </div>
              
              <div>
                <div className="sticky top-6">
                  <div className="flex items-center mb-4">
                    <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Voice Settings</h3>
                  </div>
                  
                  <VoiceSelector voices={availableVoices} selectedVoice={selectedVoice} onSelectVoice={setSelectedVoice} speed={speed} onSpeedChange={setSpeed} pitch={pitch} onPitchChange={setPitch} />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6 animate-scale-in">
            {history.length > 0 ? <div className="space-y-4">
                {history.map(item => <HistoryItem key={item.id} item={item} onReplay={handleReplay} />)}
              </div> : <div className="text-center py-12">
                <History className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No history yet</h3>
                <p className="text-muted-foreground">
                  Generate some speech to see your history here.
                </p>
              </div>}
          </TabsContent>
        </Tabs>
      </div>
      
      <Separator className="my-8 opacity-50" />
      
      <footer className="text-center text-sm text-muted-foreground">
        <p>Text to Speech Converter
Build by Kirubel Daniel March 19 2025</p>
      </footer>
    </div>;
};
export default TextToSpeechApp;