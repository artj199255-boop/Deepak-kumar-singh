export type AppTab = 'home' | 'chat' | 'apps' | 'settings';

export type AiState = 'listening' | 'thinking' | 'speaking' | 'paused';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  confidence?: string;
  audioUrl?: string; // Base64 audio/wav or blob url
  audioDuration?: string;
  intent?: {
    type: 'alarm' | 'weather' | 'youtube' | 'maps' | 'whatsapp' | 'call' | 'time' | 'search' | 'device_control' | 'general';
    data?: {
      alarmTime?: string;
      location?: string;
      temp?: string;
      weatherDesc?: string;
      aqi?: string;
      query?: string;
      recipient?: string;
      message?: string;
      phone?: string;
      actionUrl?: string;
      note?: string;
    };
  };
}

export interface AppSettings {
  userName: string;
  userRole: string;
  primaryLang: 'hinglish' | 'hindi' | 'english' | 'marathi' | 'gujarati';
  voicePersona: 'male' | 'female';
  speechVelocity: number;
  vocalPitch: number;
  localProcessing: boolean;
  hardwareToggles: {
    microphone: boolean;
    camera: boolean;
    gps: boolean;
    contacts: boolean;
    background: boolean;
  };
}

export interface LiveTimeInfo {
  timeString: string;
  dateString: string;
  hindiWeekday: string;
  weekday: string;
  day: string;
  month: string;
  year: string;
  sunrise: string;
  sunset: string;
  temp: string;
  weatherDesc: string;
}
