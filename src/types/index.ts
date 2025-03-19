
export interface Voice {
  id: string;
  name: string;
  description?: string;
}

export interface TTSOptions {
  voice: Voice;
  speed: number;
  pitch: number;
}

export interface TTSResult {
  id: string;
  text: string;
  audio: string; // base64 or URL
  timestamp: Date;
  options: TTSOptions;
}
