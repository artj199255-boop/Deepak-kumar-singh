import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AppSettings, AiState } from '../types';

interface ChatScreenProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onOpenVoiceHud: () => void;
  onClearChat: () => void;
  onPlayVoiceResponse: (text: string, audioUrl?: string) => void;
  isAudioPlaying: boolean;
  activePlayingId: string | null;
  onMicPress: () => void;
  isListening: boolean;
  settings: AppSettings;
  onOpenWhatsAppModal: (recipient?: string, message?: string) => void;
  isContinuousActive: boolean;
  aiState: AiState;
  onStartContinuous: () => void;
  onEndContinuous: () => void;
  onTogglePauseContinuous: () => void;
  onInterrupt: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  messages,
  onSendMessage,
  onOpenVoiceHud,
  onClearChat,
  onPlayVoiceResponse,
  isAudioPlaying,
  activePlayingId,
  onMicPress,
  isListening,
  onOpenWhatsAppModal,
  isContinuousActive,
  aiState,
  onStartContinuous,
  onEndContinuous,
  onTogglePauseContinuous,
  onInterrupt,
}) => {
  const [inputText, setInputText] = useState('');
  const [sentMap, setSentMap] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleSendWhatsApp = (msgId: string, text: string) => {
    setSentMap((prev) => ({ ...prev, [msgId]: true }));
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const exportChatLog = () => {
    const textLog = messages
      .map(
        (m) => `[${m.timestamp}] ${m.sender === 'user' ? 'USER' : 'SHREE AI'}: ${m.text}`
      )
      .join('\n\n');
    const blob = new Blob([textLog], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shree_ai_chat_log_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const promptSuggestions = [
    { text: 'Google Maps par traffic check karo', icon: 'traffic' },
    { text: 'Open YouTube', icon: 'smart_display' },
    { text: 'Battery status', icon: 'battery_saver' },
    { text: 'Schedule tomorrow', icon: 'event_note' },
    { text: 'Subah ka weather kaisa hai?', icon: 'sunny' },
  ];

  return (
    <div className="flex flex-col w-full text-on-surface">
      {/* Subheader: Session Telemetry & Controls */}
      <div className="px-margin pt-space-md pb-space-xs flex items-center justify-between bg-surface-container-low/70 backdrop-blur-md border-b border-primary-container/10">
        <div className="flex items-center gap-space-sm min-w-0">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-surface-container-high">
            <span className="w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_#00f0ff] animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-primary-container relative" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-xs">
              <span className="font-label-md text-label-md text-primary tracking-wider uppercase">
                Neural Session #1042
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-primary-container/15 text-primary-fixed font-label-sm text-label-sm">
                LIVE
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
              Hinglish Natural Core • Latency 14ms
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-xs">
          <button
            onClick={onOpenVoiceHud}
            aria-label="Voice HUD Mode"
            title="Open Holographic Voice HUD"
            className="w-8 h-8 rounded-lg bg-surface-container-high/60 flex items-center justify-center text-primary hover:bg-surface-container-highest transition-colors active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">record_voice_over</span>
          </button>
          <button
            onClick={exportChatLog}
            aria-label="Export Log"
            title="Export Chat Transcript"
            className="w-8 h-8 rounded-lg bg-surface-container-high/60 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">ios_share</span>
          </button>
          <button
            onClick={onClearChat}
            aria-label="Clear Chat"
            title="Clear Chat History"
            className="w-8 h-8 rounded-lg bg-surface-container-high/60 flex items-center justify-center text-on-surface-variant hover:text-error transition-colors active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">cleaning_services</span>
          </button>
        </div>
      </div>

      {/* Continuous Conversation Live Mode Console */}
      <div className="px-margin pt-2">
        {!isContinuousActive ? (
          <button
            onClick={onStartContinuous}
            className="w-full py-2 px-3 rounded-xl bg-surface-container-low/90 hover:bg-surface-container flex items-center justify-between border border-primary-container/25 shadow-sm active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
              <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                Start Continuous Conversation
              </span>
              <span className="text-[10px] text-on-surface-variant font-body-sm hidden xs:inline">
                • Hands-free Hindi female voice
              </span>
            </div>
            <div className="flex items-center gap-1 text-primary-container font-label-sm text-label-sm font-bold">
              <span>START</span>
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
            </div>
          </button>
        ) : (
          <div className="w-full p-2.5 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-between border border-primary-container/30 shadow-[0_0_16px_rgba(0,240,255,0.2)]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-container" />
              </span>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-bold">
                    CONVERSATION LIVE
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-primary-container/20 text-primary font-label-sm text-[9px] uppercase font-bold">
                    {aiState}
                  </span>
                </div>
                <span className="font-body-sm text-[11px] text-on-surface-variant truncate">
                  {aiState === 'listening'
                    ? 'Listening continuously... (Hindi/English)'
                    : aiState === 'thinking'
                    ? 'Processing...'
                    : aiState === 'speaking'
                    ? 'Speaking in natural female Hindi voice...'
                    : 'Paused'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {aiState === 'speaking' && (
                <button
                  onClick={onInterrupt}
                  className="px-2 py-1 rounded-lg bg-surface-container-high text-primary hover:bg-surface-bright font-label-sm text-label-sm font-bold uppercase tracking-wide flex items-center gap-1 border border-primary/30 active:scale-95"
                  title="Interrupt assistant"
                >
                  <span className="material-symbols-outlined text-[14px]">front_hand</span>
                  <span>Interrupt</span>
                </button>
              )}

              <button
                onClick={onTogglePauseContinuous}
                className="p-1 rounded-lg bg-surface-container-high text-on-surface hover:text-primary active:scale-95"
                title={aiState === 'paused' ? 'Resume' : 'Pause'}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {aiState === 'paused' ? 'play_arrow' : 'pause'}
                </span>
              </button>

              <button
                onClick={onEndContinuous}
                className="px-2.5 py-1 rounded-lg bg-error-container text-on-error-container hover:brightness-110 font-label-sm text-label-sm font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(255,180,171,0.3)] active:scale-95 transition-all"
                title="End Conversation Session"
              >
                <span className="material-symbols-outlined text-[14px]">call_end</span>
                <span>End</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Messages Stream */}
      <div className="flex flex-col gap-space-lg px-margin py-space-md pb-48">
        {/* Date Sync Badge */}
        <div className="flex justify-center">
          <span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest border border-primary-container/10">
            Aaj • Bi-directional Synced
          </span>
        </div>

        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div
                key={msg.id}
                className="flex flex-col items-end gap-space-xs max-w-[85%] self-end animate-fadeIn"
              >
                <div className="bg-surface-container-high text-on-surface px-space-md py-space-sm rounded-xl rounded-tr-none shadow-md border border-primary-container/15">
                  <p className="font-body-md text-body-md leading-relaxed">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm pr-1">
                  <span>{msg.timestamp}</span>
                  <span className="material-symbols-outlined text-[12px] text-primary">
                    done_all
                  </span>
                </div>
              </div>
            );
          }

          // Assistant message
          const intentType = msg.intent?.type;
          const intentData = msg.intent?.data || {};

          return (
            <div
              key={msg.id}
              className="flex flex-col items-start gap-space-xs max-w-[95%] self-start animate-fadeIn"
            >
              {/* Header Badge */}
              <div className="flex items-center gap-space-xs pl-1 mb-1">
                <div className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center shadow-[0_0_8px_rgba(0,240,255,0.4)] border border-primary-container/30">
                  <span className="font-bold text-[10px] text-primary">S</span>
                </div>
                <span className="font-label-md text-label-md text-primary font-bold">SHREE AI</span>
                {intentType === 'whatsapp' ? (
                  <span className="px-1.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary-fixed-dim font-label-sm text-label-sm">
                    INTENT: MESSAGING
                  </span>
                ) : intentType === 'maps' ? (
                  <span className="px-1.5 py-0.5 rounded-full bg-primary-container/20 text-primary-fixed font-label-sm text-label-sm">
                    INTENT: NAVIGATION
                  </span>
                ) : intentType === 'youtube' ? (
                  <span className="px-1.5 py-0.5 rounded-full bg-error-container/20 text-error font-label-sm text-label-sm">
                    INTENT: MEDIA STREAM
                  </span>
                ) : (
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    • Synthesized
                  </span>
                )}
              </div>

              {/* Main Response Box */}
              <div className="w-full bg-surface-container-low text-on-surface p-space-md rounded-xl rounded-tl-none shadow-lg relative overflow-hidden border border-primary-container/15">
                <div className="absolute -right-12 -top-12 w-28 h-28 bg-primary-container/10 rounded-full blur-2xl pointer-events-none" />

                <p className="font-body-md text-body-md leading-relaxed mb-space-sm whitespace-pre-line">
                  {msg.text}
                </p>

                {/* Structured Intent Card: Alarm */}
                {intentType === 'alarm' && (
                  <div className="p-space-sm bg-surface-container rounded-lg flex items-center justify-between mb-space-sm border border-primary-container/20">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-fixed">
                        <span className="material-symbols-outlined text-[20px]">alarm_on</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          ALARM CONFIGURED
                        </span>
                        <span className="font-headline-sm text-headline-sm font-semibold text-primary">
                          {intentData.alarmTime || '07:00 AM'}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary-fixed font-label-sm text-label-sm">
                      Active
                    </span>
                  </div>
                )}

                {/* Structured Intent Card: Weather */}
                {(intentType === 'weather' || intentData.weatherDesc) && (
                  <div className="p-space-sm bg-surface-container rounded-lg flex items-center justify-between mb-space-sm border border-secondary/20">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-[20px]">sunny</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {(intentData.location || 'MUMBAI').toUpperCase()} FORECAST
                        </span>
                        <span className="font-body-md text-body-md text-on-surface">
                          {intentData.temp || '29°C'} •{' '}
                          {intentData.weatherDesc || 'Halki Dhoop & Clear Sky'}
                        </span>
                      </div>
                    </div>
                    <span className="font-label-md text-label-md text-secondary">
                      AQI {intentData.aqi || '84'}
                    </span>
                  </div>
                )}

                {/* Structured Intent Card: WhatsApp Action Card */}
                {intentType === 'whatsapp' && (
                  <div className="w-full bg-surface-container rounded-xl p-space-sm mb-space-sm flex flex-col gap-2 border border-primary-container/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary-container text-[18px]">
                          send_and_archive
                        </span>
                        <span className="font-label-md text-label-md tracking-wider text-primary uppercase font-bold">
                          WhatsApp Action Card
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">
                        {sentMap[msg.id] ? 'Dispatched' : 'Awaiting Confirmation'}
                      </span>
                    </div>

                    <div className="p-space-xs bg-surface-container-low rounded-lg flex flex-col gap-1 text-body-sm font-body-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">person</span>{' '}
                          Recipient:
                        </span>
                        <span className="text-primary font-medium">
                          {intentData.recipient || 'Priya (+91 98201 XXXXX)'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">chat</span>{' '}
                          Message:
                        </span>
                        <div className="p-2 rounded bg-surface-container-high text-on-surface font-body-sm">
                          “{intentData.message || 'Main 15 minute mein meeting mein pahunch raha hoon.'}”
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-space-sm pt-1">
                      <button
                        onClick={() =>
                          handleSendWhatsApp(
                            msg.id,
                            intentData.message || 'Main 15 minute mein meeting mein pahunch raha hoon.'
                          )
                        }
                        className={`flex-1 py-2 px-3 rounded-lg font-label-md text-label-md font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-[0_0_16px_rgba(0,240,255,0.4)] active:scale-95 transition-all ${
                          sentMap[msg.id]
                            ? 'bg-secondary-container text-on-secondary'
                            : 'bg-primary-container text-on-primary'
                        }`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {sentMap[msg.id] ? 'check_circle' : 'send'}
                        </span>
                        <span>{sentMap[msg.id] ? 'Sent via WhatsApp' : 'Send Now'}</span>
                      </button>
                      <button
                        onClick={() =>
                          onOpenWhatsAppModal(intentData.recipient, intentData.message)
                        }
                        className="py-2 px-3 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-surface-container-highest active:scale-95 transition-all"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Structured Intent Card: YouTube */}
                {intentType === 'youtube' && (
                  <div className="w-full bg-surface-container rounded-xl p-space-sm mb-space-sm flex items-center justify-between border border-error/30">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-9 h-9 rounded-lg bg-error-container/30 text-error flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">smart_display</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-error uppercase font-bold">
                          YouTube Media Stream
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface">
                          {intentData.query || 'Workout Music'}
                        </span>
                      </div>
                    </div>
                    <a
                      href={intentData.actionUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(intentData.query || 'music')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-error text-surface-dim font-label-sm text-label-sm font-bold flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all"
                    >
                      <span>Play Now</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                )}

                {/* Structured Intent Card: Maps */}
                {intentType === 'maps' && (
                  <div className="w-full bg-surface-container rounded-xl p-space-sm mb-space-sm flex items-center justify-between border border-primary-container/30">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-9 h-9 rounded-lg bg-primary-container/20 text-primary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">near_me</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-primary uppercase font-bold">
                          Google Maps Navigation
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface">
                          Route to {intentData.query || 'Destination'}
                        </span>
                      </div>
                    </div>
                    <a
                      href={intentData.actionUrl || `https://www.google.com/maps/search/${encodeURIComponent(intentData.query || 'Connaught Place')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-sm text-label-sm font-bold flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all"
                    >
                      <span>Navigate</span>
                      <span className="material-symbols-outlined text-[14px]">directions</span>
                    </a>
                  </div>
                )}

                {/* Phone Call Card */}
                {intentType === 'call' && (
                  <div className="w-full bg-surface-container rounded-xl p-space-sm mb-space-sm flex items-center justify-between border border-secondary/30">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-9 h-9 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">call</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-secondary uppercase font-bold">
                          Cellular Dial Intent
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface">
                          {intentData.recipient || 'Contact'} ({intentData.phone || '+91 98765 XXXXX'})
                        </span>
                      </div>
                    </div>
                    <a
                      href={`tel:${intentData.phone || '+919876500000'}`}
                      className="px-3 py-1.5 rounded-lg bg-secondary-container text-on-secondary font-label-sm text-label-sm font-bold flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all"
                    >
                      <span>Dial</span>
                      <span className="material-symbols-outlined text-[14px]">phone_in_talk</span>
                    </a>
                  </div>
                )}

                {/* Device Control Note Card */}
                {intentType === 'device_control' && (
                  <div className="p-2.5 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface-variant font-body-sm text-body-sm flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                      info
                    </span>
                    <span>
                      Notice: Native device hardware toggles (Bluetooth, system battery state, OS volume) are sandboxed in modern web browsers and require native Android permissions.
                    </span>
                  </div>
                )}
              </div>

              {/* Voice Responder Equalizer Card */}
              <div className="w-full bg-surface-container-high/60 backdrop-blur-md rounded-xl p-space-sm flex items-center gap-space-sm shadow-sm border border-primary-container/10">
                <button
                  onClick={() => onPlayVoiceResponse(msg.text, msg.audioUrl)}
                  className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.4)] active:scale-95 transition-transform"
                  type="button"
                  title="Play synthesized Hindi voice"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isAudioPlaying && activePlayingId === msg.id ? 'pause' : 'play_arrow'}
                  </span>
                </button>

                <div className="flex-1 flex flex-col justify-center gap-1 min-w-0">
                  <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                    <span className="text-primary font-medium tracking-wider">
                      VOICE RESPONDER
                    </span>
                    <span>{msg.audioDuration || '0:08s'}</span>
                  </div>
                  {/* Equalizer Waveform */}
                  <div className="flex items-end gap-1 h-5 pt-1">
                    <span
                      className={`w-1 bg-primary-container/40 rounded-full transition-all duration-300 ${
                        isAudioPlaying && activePlayingId === msg.id ? 'h-3 animate-pulse' : 'h-2'
                      }`}
                    />
                    <span
                      className={`w-1 bg-primary-container rounded-full transition-all duration-300 ${
                        isAudioPlaying && activePlayingId === msg.id ? 'h-5 animate-pulse' : 'h-3'
                      }`}
                    />
                    <span
                      className={`w-1 bg-secondary-container rounded-full transition-all duration-300 ${
                        isAudioPlaying && activePlayingId === msg.id ? 'h-4 animate-bounce' : 'h-2'
                      }`}
                    />
                    <span
                      className={`w-1 bg-primary-container rounded-full transition-all duration-300 ${
                        isAudioPlaying && activePlayingId === msg.id ? 'h-5 animate-pulse' : 'h-4'
                      }`}
                    />
                    <span
                      className={`w-1 bg-primary-container rounded-full transition-all duration-300 ${
                        isAudioPlaying && activePlayingId === msg.id ? 'h-3 animate-pulse' : 'h-2'
                      }`}
                    />
                    <span
                      className={`w-1 bg-secondary rounded-full transition-all duration-300 ${
                        isAudioPlaying && activePlayingId === msg.id ? 'h-5 animate-bounce' : 'h-3'
                      }`}
                    />
                    <span
                      className={`w-1 bg-primary-container/60 rounded-full transition-all duration-300 ${
                        isAudioPlaying && activePlayingId === msg.id ? 'h-4 animate-pulse' : 'h-2'
                      }`}
                    />
                    <span
                      className={`w-1 bg-primary rounded-full transition-all duration-300 ${
                        isAudioPlaying && activePlayingId === msg.id ? 'h-5 animate-pulse' : 'h-3'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2 py-1 rounded bg-surface-container font-label-sm text-label-sm text-primary">
                  <span className="material-symbols-outlined text-[14px]">graphic_eq</span>
                  <span>16kHz</span>
                </div>
              </div>

              <span className="text-on-surface-variant font-label-sm text-label-sm pl-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Bottom Input Bar & Suggestion Chips */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-surface-container-lowest/90 backdrop-blur-2xl px-margin pt-space-xs pb-space-sm flex flex-col gap-space-xs border-t border-primary-container/10">
        {/* Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {promptSuggestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(item.text)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-surface-container text-primary hover:bg-surface-container-high font-label-sm text-label-sm tracking-wide transition-all flex items-center gap-1 border border-primary-container/20 active:scale-95"
            >
              <span className="material-symbols-outlined text-[14px] text-primary-container">
                {item.icon}
              </span>
              <span>{item.text}</span>
            </button>
          ))}
        </div>

        {/* Input Dock */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-space-sm bg-surface-container-low rounded-full px-space-sm py-1.5 shadow-lg border border-primary-container/20"
        >
          <button
            onClick={onOpenVoiceHud}
            aria-label="Audio Visualizer Active"
            title="Open Holographic Voice HUD"
            className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-primary-fixed shrink-0 hover:text-primary transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Hinglish ya Hindi mein bolein ya likhein..."
            className="flex-1 bg-transparent text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none min-w-0"
          />

          <button
            onClick={onMicPress}
            aria-label="Microphone Voice Input"
            title={isListening ? 'Listening...' : 'Tap to speak'}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center text-on-primary shrink-0 shadow-[0_0_16px_#00f0ff] active:scale-95 transition-all ${
              isListening
                ? 'bg-primary-fixed-dim animate-pulse ring-2 ring-primary-container'
                : 'bg-primary-container'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isListening ? 'mic' : 'mic_none'}
            </span>
          </button>

          <button
            type="submit"
            aria-label="Send Message"
            className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary-container shrink-0 hover:bg-primary-container hover:text-on-primary transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
          </button>
        </form>
      </div>
    </div>
  );
};
