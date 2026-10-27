import { useState, useEffect, useRef } from 'react';
import { AppTab, AiState, ChatMessage, AppSettings, LiveTimeInfo } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ChatScreen } from './components/ChatScreen';
import { AppsScreen } from './components/AppsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { VoiceHudModal } from './components/VoiceHudModal';
import { CameraModal, WhatsAppModal, ZenModal } from './components/ActionModals';
import {
  sendChatMessage,
  synthesizeSpeech,
  playAudioOrFallback,
  stopAudioPlayback,
  createSpeechRecognizer,
  ContinuousConversationEngine,
} from './services/aiService';

const INITIAL_SETTINGS: AppSettings = {
  userName: 'Vikramaditya Sharma',
  userRole: 'Root Tier Master Node',
  primaryLang: 'hinglish',
  voicePersona: 'female', // Natural female voice by default
  speechVelocity: 0.98,
  vocalPitch: 0.8,
  localProcessing: true,
  hardwareToggles: {
    microphone: true,
    camera: true,
    gps: true,
    contacts: true,
    background: true,
  },
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    text: 'Shree, kal subah 7 baje ka alarm set karo aur Mumbai ka weather report batao.',
    timestamp: '7:14 PM',
  },
  {
    id: 'msg-2',
    sender: 'assistant',
    text: 'Ji Boss! Kal subah 7:00 AM ka wake-up alarm set kar diya hai.\n\nKya aapko morning briefing summary bhi chahiye?',
    timestamp: '7:14 PM',
    audioDuration: '0:08s',
    intent: {
      type: 'alarm',
      data: {
        alarmTime: '07:00 AM',
        location: 'Mumbai',
        temp: '29°C',
        weatherDesc: 'Halki Dhoop & Clear Sky',
        aqi: '84',
      },
    },
  },
  {
    id: 'msg-3',
    sender: 'user',
    text: 'WhatsApp par Priya ko message bhejo: “Main 15 minute mein meeting mein pahunch raha hoon.”',
    timestamp: '7:15 PM',
  },
  {
    id: 'msg-4',
    sender: 'assistant',
    text: 'Ji Boss! Priya (+91 98201 XXXXX) ke liye WhatsApp message draft ready hai. Kripya niche diye card par Send Now dabakar push karein.',
    timestamp: '7:15 PM',
    audioDuration: '0:06s',
    intent: {
      type: 'whatsapp',
      data: {
        recipient: 'Priya (+91 98201 XXXXX)',
        message: 'Main 15 minute mein meeting mein pahunch raha hoon.',
      },
    },
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('home');
  const [aiState, setAiState] = useState<AiState>('listening');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);

  // Modals & Overlays
  const [isVoiceHudOpen, setIsVoiceHudOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isZenOpen, setIsZenOpen] = useState(false);

  // Continuous Conversation Mode States & Engine
  const [isContinuousActive, setIsContinuousActive] = useState(false);
  const isContinuousActiveRef = useRef(false);
  const continuousEngineRef = useRef<ContinuousConversationEngine | null>(null);

  // Audio & Speech States
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Voice HUD Live Transcripts
  const [hudTranscript, setHudTranscript] = useState('Hey Shree, WhatsApp par papa ko call lagao...');
  const [hudResponse, setHudResponse] = useState(
    'Main Papa (+91 98765 XXXXX) ko WhatsApp audio call connect kar rahi hoon...'
  );
  const [hudActionTelemetry, setHudActionTelemetry] = useState('android.intent.action.CALL');

  // WhatsApp Modal Props
  const [waRecipient, setWaRecipient] = useState('Priya (+91 98201 XXXXX)');
  const [waMessage, setWaMessage] = useState('Main 15 minute mein meeting mein pahunch raha hoon.');

  // Live Toast Notification
  const [toastText, setToastText] = useState<string | null>(null);
  const toastTimeoutRef = useRef<any>(null);

  // Time & Weather
  const [timeInfo, setTimeInfo] = useState<LiveTimeInfo>({
    timeString: '09:41 AM',
    dateString: 'Wednesday, 23 October 2026',
    hindiWeekday: 'Somvaar',
    weekday: 'Wednesday',
    day: '23',
    month: 'October',
    year: '2026',
    sunrise: '06:12 AM',
    sunset: '06:45 PM',
    temp: '27°C',
    weatherDesc: 'Clear 27°C',
  });

  const recognizerRef = useRef<any>(null);
  const stopAudioRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    isContinuousActiveRef.current = isContinuousActive;
  }, [isContinuousActive]);

  // Fetch Live Time on Mount
  useEffect(() => {
    fetch('/api/time')
      .then((res) => res.json())
      .then((data) => {
        if (data.timeString) {
          setTimeInfo(data);
        }
      })
      .catch((e) => console.warn('Could not fetch server time:', e));
  }, []);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastText(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastText(null);
    }, 2400);
  };

  // Start Continuous Conversation Mode
  const handleStartContinuous = async () => {
    // 1. Verify Microphone Permission
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release immediate test stream
        stream.getTracks().forEach((t) => t.stop());
      }
    } catch (permErr: any) {
      showToast('MICROPHONE ACCESS REQUIRED');
      console.warn('Microphone permission not granted:', permErr);
      return;
    }

    // Stop single-shot mic if active
    if (recognizerRef.current) {
      recognizerRef.current.stop();
      recognizerRef.current = null;
    }

    stopAudioPlayback();

    // 2. Initialize Continuous Conversation Engine
    const engine = new ContinuousConversationEngine({
      silenceDelayMs: 1400,
      lang: settings.primaryLang === 'hindi' ? 'hi-IN' : 'hi-IN',
      onUserSpeaking: (interim) => {
        setHudTranscript(interim);
        setAiState('listening');
      },
      onUserSentenceComplete: (finalText) => {
        // Automatically pause listening while assistant processes & speaks
        engine.notifyAssistantSpeakingStart();
        setAiState('thinking');
        setHudTranscript(finalText);
        handleProcessPrompt(finalText, isVoiceHudOpen, true);
      },
      onError: (msg) => {
        showToast(msg.toUpperCase());
        if (msg.includes('denied')) {
          setIsContinuousActive(false);
        }
      },
      onListeningStateChange: (listening) => {
        setIsListening(listening);
      },
    });

    const started = engine.start();
    if (started) {
      continuousEngineRef.current = engine;
      setIsContinuousActive(true);
      setAiState('listening');
      showToast('CONTINUOUS CONVERSATION ACTIVE');
    } else {
      showToast('SPEECH RECOGNITION NOT AVAILABLE IN BROWSER');
    }
  };

  // End Continuous Conversation Mode
  const handleEndContinuous = () => {
    if (continuousEngineRef.current) {
      continuousEngineRef.current.stop();
      continuousEngineRef.current = null;
    }
    stopAudioPlayback();
    setIsContinuousActive(false);
    setIsListening(false);
    setAiState('listening');
    showToast('CONVERSATION SESSION ENDED');
  };

  // Toggle Pause/Resume in Continuous Mode
  const handleTogglePauseContinuous = () => {
    if (!continuousEngineRef.current) return;
    if (aiState === 'paused') {
      continuousEngineRef.current.resume();
      setAiState('listening');
      showToast('CONVERSATION RESUMED');
    } else {
      continuousEngineRef.current.pause();
      stopAudioPlayback();
      setAiState('paused');
      showToast('CONVERSATION PAUSED');
    }
  };

  // User Interrupts Assistant Speech
  const handleInterrupt = () => {
    stopAudioPlayback();
    if (continuousEngineRef.current) {
      continuousEngineRef.current.interrupt();
    }
    setAiState('listening');
    showToast('INTERRUPTED • LISTENING TO YOU');
  };

  // Process a text or speech prompt through SHREE AI with conversational memory
  const handleProcessPrompt = async (
    prompt: string,
    fromHud: boolean = false,
    isContinuous: boolean = false
  ) => {
    if (!prompt.trim()) return;

    setAiState('thinking');

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setHudTranscript(prompt);

    try {
      // Pass full conversation history context so follow-ups work!
      const response = await sendChatMessage(prompt, messages, settings);
      const replyText = response.text || 'Ji Boss, main samajh gayi.';
      const intent = response.intent || { type: 'general', data: {} };

      setHudResponse(replyText);
      if (intent.type === 'call') {
        setHudActionTelemetry('android.intent.action.CALL');
      } else if (intent.type === 'whatsapp') {
        setHudActionTelemetry('android.intent.action.SEND');
      } else if (intent.type === 'maps') {
        setHudActionTelemetry('com.google.android.apps.maps');
      } else if (intent.type === 'youtube') {
        setHudActionTelemetry('com.google.android.youtube');
      } else {
        setHudActionTelemetry('shree.ai.core.FEMALE_SYNTHESIS');
      }

      // Generate speech synthesis
      let audioUrl: string | undefined = undefined;
      const ttsResult = await synthesizeSpeech(replyText, settings);
      if (ttsResult.audioUrl) {
        audioUrl = ttsResult.audioUrl;
      }

      const assistantMsgId = `asst-${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audioDuration: '0:08s',
        audioUrl,
        intent,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setAiState('speaking');

      // Play natural female voice response with automatic turn-taking completion callback
      handlePlayVoice(replyText, audioUrl, assistantMsgId, () => {
        // ON SPEECH PLAYBACK END:
        if (isContinuousActiveRef.current || isContinuous) {
          // Re-arm continuous listening automatically without any user tap
          continuousEngineRef.current?.notifyAssistantSpeakingEnd();
          setAiState('listening');
        } else {
          setAiState('listening');
        }
      });

      // If user invoked specific shortcut intents
      if (intent.type === 'whatsapp' && !fromHud) {
        setWaRecipient(intent.data?.recipient || 'Priya (+91 98201 XXXXX)');
        setWaMessage(intent.data?.message || prompt);
      }
    } catch (err) {
      console.error('Prompt processing error:', err);
      setAiState('listening');
      if (isContinuousActiveRef.current || isContinuous) {
        continuousEngineRef.current?.notifyAssistantSpeakingEnd();
      }
    }
  };

  // Play voice synthesis audio (server WAV or browser female speech)
  const handlePlayVoice = (
    text: string,
    audioUrl?: string,
    msgId?: string,
    onPlaybackComplete?: () => void
  ) => {
    if (isAudioPlaying && activePlayingId === msgId) {
      stopAudioPlayback();
      setIsAudioPlaying(false);
      setActivePlayingId(null);
      setAiState('listening');
      return;
    }

    setIsAudioPlaying(true);
    setActivePlayingId(msgId || null);
    setAiState('speaking');

    stopAudioRef.current = playAudioOrFallback(
      text,
      audioUrl,
      settings,
      () => {
        setIsAudioPlaying(true);
      },
      () => {
        setIsAudioPlaying(false);
        setActivePlayingId(null);
        onPlaybackComplete?.();
      }
    );
  };

  // Microphone Speech Recognition Toggle (Single-shot fallback)
  const handleToggleMic = () => {
    // If continuous mode is already running, toggle pause/resume or end
    if (isContinuousActive) {
      handleTogglePauseContinuous();
      return;
    }

    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
      setAiState('listening');
      return;
    }

    if (isMuted) {
      showToast('MICROPHONE CURRENTLY MUTED');
      return;
    }

    setIsListening(true);
    setAiState('listening');

    const recognizer = createSpeechRecognizer(
      (transcript: string, isFinal: boolean) => {
        setHudTranscript(transcript);
        if (isFinal) {
          setIsListening(false);
          handleProcessPrompt(transcript, isVoiceHudOpen, false);
        }
      },
      (err: string) => {
        console.warn('Speech recognition notice:', err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      },
      settings.primaryLang === 'hindi' ? 'hi-IN' : 'hi-IN'
    );

    recognizerRef.current = recognizer;
    if (recognizer) {
      try {
        recognizer.start();
      } catch (e) {
        console.warn('Recognizer start notice:', e);
      }
    } else {
      // Browser fallback speech query
      setTimeout(() => {
        const samples = [
          'Subah ka weather kaisa hai?',
          'YouTube par workout music chalao',
          'Google Maps par traffic check karo',
          'Kal subah 7 baje ka alarm set karo',
        ];
        const selected = samples[Math.floor(Math.random() * samples.length)];
        setIsListening(false);
        handleProcessPrompt(selected, isVoiceHudOpen, false);
      }, 2500);
    }
  };

  // Shortcut Click Handlers
  const handleOpenShortcut = (shortcut: string) => {
    switch (shortcut) {
      case 'youtube':
        window.open('https://www.youtube.com', '_blank');
        showToast('LAUNCHING YOUTUBE MEDIA STREAM');
        break;
      case 'search':
        setCurrentTab('chat');
        handleProcessPrompt('Google AI search: latest updates in India');
        break;
      case 'maps':
        window.open('https://www.google.com/maps', '_blank');
        showToast('LAUNCHING GOOGLE MAPS NAVIGATION');
        break;
      case 'whatsapp':
        setWaRecipient('Priya (+91 98201 XXXXX)');
        setWaMessage('Main 15 minute mein meeting mein pahunch rahi hoon.');
        setIsWhatsAppOpen(true);
        break;
      case 'call': {
        const phone = '+919876500000';
        window.location.href = `tel:${phone}`;
        showToast('OPENING CELLULAR DIALER');
        break;
      }
      case 'camera':
        setIsCameraOpen(true);
        break;
      default:
        break;
    }
  };

  // Macro Routines Execution
  const handleRunMacro = (macro: 'morning' | 'drive' | 'focus') => {
    if (macro === 'morning') {
      setCurrentTab('chat');
      handleProcessPrompt('Shree, morning routine chalu karo: Weather aur aaj ki taaza khabar batao.');
      showToast('MORNING ROUTINE ENGAGED');
    } else if (macro === 'drive') {
      setCurrentTab('chat');
      handleProcessPrompt('Drive mode protocol active: Google Maps par traffic check karo.');
      showToast('DRIVE MODE PROTOCOL ACTIVE');
    } else if (macro === 'focus') {
      setIsZenOpen(true);
      showToast('FOCUS PROTOCOL (ZEN) ENGAGED');
    }
  };

  // Cycle languages in HUD
  const handleCycleLanguage = () => {
    const langs: AppSettings['primaryLang'][] = [
      'hinglish',
      'hindi',
      'english',
      'marathi',
      'gujarati',
    ];
    const currentIndex = langs.indexOf(settings.primaryLang);
    const nextLang = langs[(currentIndex + 1) % langs.length];
    setSettings((prev) => ({ ...prev, primaryLang: nextLang }));
    showToast(`LINGUISTIC MODE: ${nextLang.toUpperCase()}`);
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen relative flex flex-col antialiased selection:bg-primary-container selection:text-on-primary">
      {/* Interactive Feedback Pill Toast Notification */}
      <div
        className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 flex items-center gap-space-sm px-space-md py-space-xs rounded-full bg-surface-container-high/95 backdrop-blur-xl shadow-[0_0_20px_rgba(0,240,255,0.35)] border border-primary-container/30 ${
          toastText
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <span className="material-symbols-outlined text-primary-container text-[18px]">
          verified_user
        </span>
        <span className="font-label-sm text-label-sm text-primary tracking-wide uppercase font-bold">
          {toastText || 'Core Configuration Synchronized'}
        </span>
      </div>

      {/* Main Top Header */}
      <Header
        currentTab={currentTab}
        onProfileClick={() => setCurrentTab('settings')}
      />

      {/* Main Tab Screens */}
      <main className="flex-1 w-full bg-surface pt-16 pb-safe">
        {currentTab === 'home' && (
          <HomeScreen
            aiState={aiState}
            setAiState={setAiState}
            onMicPress={handleToggleMic}
            isListening={isListening}
            onSendPrompt={(p) => {
              setCurrentTab('chat');
              handleProcessPrompt(p);
            }}
            onOpenVoiceHud={() => setIsVoiceHudOpen(true)}
            onOpenAppShortcut={handleOpenShortcut}
            timeInfo={timeInfo}
            settings={settings}
            isContinuousActive={isContinuousActive}
            onStartContinuous={handleStartContinuous}
            onEndContinuous={handleEndContinuous}
            onTogglePauseContinuous={handleTogglePauseContinuous}
            onInterrupt={handleInterrupt}
          />
        )}

        {currentTab === 'chat' && (
          <ChatScreen
            messages={messages}
            onSendMessage={(msg) => handleProcessPrompt(msg)}
            onOpenVoiceHud={() => setIsVoiceHudOpen(true)}
            onClearChat={() => {
              setMessages([]);
              showToast('CHAT TRANSCRIPT CLEARED');
            }}
            onPlayVoiceResponse={(text, url) => handlePlayVoice(text, url)}
            isAudioPlaying={isAudioPlaying}
            activePlayingId={activePlayingId}
            onMicPress={handleToggleMic}
            isListening={isListening}
            settings={settings}
            onOpenWhatsAppModal={(rec, msg) => {
              if (rec) setWaRecipient(rec);
              if (msg) setWaMessage(msg);
              setIsWhatsAppOpen(true);
            }}
            isContinuousActive={isContinuousActive}
            aiState={aiState}
            onStartContinuous={handleStartContinuous}
            onEndContinuous={handleEndContinuous}
            onTogglePauseContinuous={handleTogglePauseContinuous}
            onInterrupt={handleInterrupt}
          />
        )}

        {currentTab === 'apps' && (
          <AppsScreen
            timeInfo={timeInfo}
            onOpenShortcut={handleOpenShortcut}
            onRunMacro={handleRunMacro}
            onNavigateTab={setCurrentTab}
            onVoiceTrigger={handleToggleMic}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={(newVals) => {
              setSettings((prev) => ({ ...prev, ...newVals }));
            }}
            onClearHistory={() => {
              setMessages([]);
              stopAudioPlayback();
            }}
            onToast={showToast}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Voice HUD Modal (Full-screen immersion with continuous mode) */}
      <VoiceHudModal
        isOpen={isVoiceHudOpen}
        onClose={() => setIsVoiceHudOpen(false)}
        aiState={aiState}
        setAiState={setAiState}
        isMuted={isMuted}
        onToggleMute={() => {
          setIsMuted(!isMuted);
          showToast(isMuted ? 'MICROPHONE ACTIVE' : 'MICROPHONE MUTED');
        }}
        userTranscript={hudTranscript}
        aiResponse={hudResponse}
        actionTelemetry={hudActionTelemetry}
        onPromptSelect={(p) => {
          handleProcessPrompt(p, true, isContinuousActive);
        }}
        onSwitchToKeyboard={() => {
          setIsVoiceHudOpen(false);
          setCurrentTab('chat');
        }}
        settings={settings}
        onCycleLanguage={handleCycleLanguage}
        isContinuousActive={isContinuousActive}
        onStartContinuous={handleStartContinuous}
        onEndContinuous={handleEndContinuous}
        onTogglePauseContinuous={handleTogglePauseContinuous}
        onInterrupt={handleInterrupt}
      />

      {/* Action Modals */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onScanResult={(res) => {
          showToast('OCR SCANNED SUCCESSFULLY');
          setCurrentTab('chat');
          handleProcessPrompt(`Maine scan kiya: "${res}". Iska kya matlab hai?`);
        }}
      />

      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        defaultRecipient={waRecipient}
        defaultMessage={waMessage}
      />

      <ZenModal isOpen={isZenOpen} onClose={() => setIsZenOpen(false)} />
    </div>
  );
}
