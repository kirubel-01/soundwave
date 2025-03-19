
import React from 'react';
import TextToSpeechApp from '@/components/TextToSpeechApp';
import Navigation from '@/components/Navigation';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 py-8 px-4">
        <TextToSpeechApp />
      </div>
    </div>
  );
};

export default Index;
