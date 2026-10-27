import React from 'react';
import { AiState, AppSettings } from '../types';

interface VoiceHudModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiState: AiState;
  setAiState: (state: AiState) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  userTranscript: string;
  aiResponse: string;
  actionTelemetry?: string;
  onPromptSelect: (prompt: string) => void;
  onSwitchToKeyboard: () => void;
  settings: AppSettings;
  onCycleLanguage: () => void;
  isContinuousActive: boolean;
  onStartContinuous: () => void;
  onEndContinuous: () => void;
  onTogglePauseContinuous: () => void;
  onInterrupt: () => void;
}

export const VoiceHudModal: React.FC<VoiceHudModalProps> = ({
  isOpen,
  onClose,
  aiState,
  setAiState,
  isMuted,
  onToggleMute,
  userTranscript,
  aiResponse,
  actionTelemetry,
  onPromptSelect,
  onSwitchToKeyboard,
  settings,
  onCycleLanguage,
  isContinuousActive,
  onStartContinuous,
  onEndContinuous,
  onTogglePauseContinuous,
  onInterrupt,
}) => {
  if (!isOpen) return null;

  const getIndicatorText = () => {
    if (isMuted) return 'MICROPHONE MUTED';
    if (aiState === 'listening') return 'MIC STREAM: ACTIVE (LISTENING)';
    if (aiState === 'thinking') return 'NEURAL COGNITION: INFERRING INTENT';
    if (aiState === 'speaking') return 'NATURAL FEMALE VOICE: SPEAKING';
    if (aiState === 'paused') return 'CONVERSATION PAUSED';
    return 'MIC STREAM: ACTIVE';
  };

  const getLanguageLabel = () => {
    switch (settings.primaryLang) {
      case 'hindi':
        return 'HINDI';
      case 'english':
        return 'ENGLISH';
      case 'marathi':
        return 'MARATHI';
      case 'gujarati':
        return 'GUJARATI';
      default:
        return 'HINGLISH';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface flex flex-col min-h-screen overflow-y-auto no-scrollbar animate-fadeIn">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
        <div className="px-margin py-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm tracking-widest">
          <span>09:41</span>
          <div className="flex items-center gap-space-sm">
            <span className="flex items-center gap-0.5 text-primary">
              <span className="material-symbols-outlined text-[13px]">signal_cellular_alt</span>
              <span>5G</span>
            </span>
            <span className="material-symbols-outlined text-[14px]">wifi</span>
            <span className="flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px] text-primary-container">
                battery_charging_full
              </span>
              <span>98%</span>
            </span>
          </div>
        </div>

        <div className="h-16 px-margin flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs">
            <button
              aria-label="Go back"
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container shadow-[0_0_12px_rgba(0,240,255,0.35)] shrink-0">
              <span className="font-bold text-primary text-base">S</span>
            </div>
            <h1 className="font-headline-sm text-headline-sm font-semibold tracking-tight text-on-surface truncate">
              Neural Diagnostics
            </h1>
          </div>

          <div className="w-10 h-10 flex items-center justify-center">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover shadow-[0_0_12px_rgba(0,240,255,0.35)] border border-primary-container/30"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4RtMC1wDgZ4EieHOdW5OawvsIOOWdfUTwo3oNUjA8UZuwKQB293fTdEoj9YUKjvIrWQ1whiY_AfiB63ANrVzs4hq6QbRSTXtxz0ldN7OZxO6ohbD1_VaEQQLj97YETbUvIGzxP3Dhqh51lwupSgEw5COvfi1ZGPQmjlpp3ZVIRkAvB6ygmueXGaZAg2nOqoRtn9bedDBjms225nJbfiq6l3PFqSn5KhAIWkWlU9PoPaW5J5NBs8a1"
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full bg-surface pt-20 pb-safe px-margin flex flex-col gap-space-md select-none">
        {/* Continuous Conversation Mode Tactical Bar */}
        <div className="w-full rounded-2xl bg-surface-container-lowest/90 backdrop-blur-xl p-3 border border-primary-container/30 shadow-[0_4px_24px_rgba(0,240,255,0.15)] flex flex-col gap-2">
          {!isContinuousActive ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container shrink-0">
                  <span className="material-symbols-outlined text-[20px]">sync</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-md text-label-md text-primary font-bold tracking-wider uppercase">
                    Continuous Conversation
                  </span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant truncate">
                    Hands-free Hindi female voice dialogue
                  </span>
                </div>
              </div>
              <button
                onClick={onStartContinuous}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-on-primary font-label-md text-label-md font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_16px_rgba(0,240,255,0.45)] active:scale-95 transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
                <span>Start Conversation</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-container" />
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
                      ? 'Listening for your Hindi / English words...'
                      : aiState === 'thinking'
                      ? 'Processing conversational reasoning...'
                      : aiState === 'speaking'
                      ? 'Speaking in natural female Hindi voice...'
                      : 'Conversation paused'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {aiState === 'speaking' && (
                  <button
                    onClick={onInterrupt}
                    className="px-2.5 py-1.5 rounded-lg bg-surface-container-high text-primary hover:bg-surface-bright font-label-sm text-label-sm font-bold uppercase tracking-wide flex items-center gap-1 border border-primary/30 active:scale-95"
                    title="Interrupt assistant and speak"
                  >
                    <span className="material-symbols-outlined text-[16px]">front_hand</span>
                    <span className="hidden xs:inline">Interrupt</span>
                  </button>
                )}

                <button
                  onClick={onTogglePauseContinuous}
                  className="p-1.5 rounded-lg bg-surface-container-high text-on-surface hover:text-primary font-label-sm text-label-sm active:scale-95"
                  title={aiState === 'paused' ? 'Resume Conversation' : 'Pause Conversation'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {aiState === 'paused' ? 'play_arrow' : 'pause'}
                  </span>
                </button>

                <button
                  onClick={onEndContinuous}
                  className="px-3 py-1.5 rounded-lg bg-error-container text-on-error-container hover:brightness-110 font-label-sm text-label-sm font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_12px_rgba(255,180,171,0.35)] active:scale-95 transition-all"
                  title="End Conversation Session"
                >
                  <span className="material-symbols-outlined text-[16px]">call_end</span>
                  <span>End</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Interactive State Switcher HUD Pill */}
        <div className="flex items-center justify-between bg-surface-container-lowest/80 backdrop-blur-xl p-space-xs rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-primary-container/20">
          <button
            onClick={() => setAiState('listening')}
            className={`flex-1 py-1.5 px-space-xs rounded-full flex items-center justify-center gap-1 transition-all duration-300 ${
              aiState === 'listening'
                ? 'bg-primary-container text-on-primary shadow-[0_0_16px_rgba(0,240,255,0.4)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                aiState === 'listening' ? 'bg-surface-dim animate-ping' : 'bg-outline'
              }`}
            />
            <span className="font-label-sm text-label-sm tracking-wider uppercase font-bold">
              Listening
            </span>
          </button>

          <button
            onClick={() => setAiState('thinking')}
            className={`flex-1 py-1.5 px-space-xs rounded-full flex items-center justify-center gap-1 transition-all duration-300 ${
              aiState === 'thinking'
                ? 'bg-primary-container text-on-primary shadow-[0_0_16px_rgba(0,240,255,0.4)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">psychology</span>
            <span className="font-label-sm text-label-sm tracking-wider uppercase font-bold">
              Thinking
            </span>
          </button>

          <button
            onClick={() => setAiState('speaking')}
            className={`flex-1 py-1.5 px-space-xs rounded-full flex items-center justify-center gap-1 transition-all duration-300 ${
              aiState === 'speaking'
                ? 'bg-primary-container text-on-primary shadow-[0_0_16px_rgba(0,240,255,0.4)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">volume_up</span>
            <span className="font-label-sm text-label-sm tracking-wider uppercase font-bold">
              Speaking
            </span>
          </button>

          <button
            onClick={() => setAiState('paused')}
            className={`flex-1 py-1.5 px-space-xs rounded-full flex items-center justify-center gap-1 transition-all duration-300 ${
              aiState === 'paused'
                ? 'bg-surface-container-highest text-secondary shadow-[0_0_12px_rgba(152,203,255,0.3)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">pause</span>
            <span className="font-label-sm text-label-sm tracking-wider uppercase font-bold">
              Paused
            </span>
          </button>
        </div>

        {/* Telemetry Sub-Band / Status Pill */}
        <div className="flex items-center justify-between text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high/90 shadow-sm border border-primary-container/10">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isMuted
                    ? 'bg-error'
                    : 'bg-primary-fixed-dim shadow-[0_0_8px_rgba(0,240,255,0.8)] animate-pulse'
                }`}
              />
              <span className="font-label-sm text-label-sm uppercase text-primary font-bold">
                {getIndicatorText()}
              </span>
            </span>
            <span className="font-label-sm text-label-sm tracking-widest text-outline">
              0.24MS LATENCY
            </span>
          </div>

          {/* Language Mode Toggle Pill */}
          <button
            onClick={onCycleLanguage}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high/90 hover:bg-surface-bright text-on-surface transition-colors shadow-sm border border-primary-container/10 active:scale-95"
            title="Cycle Language Dialect"
          >
            <span className="material-symbols-outlined text-[14px] text-secondary">
              translate
            </span>
            <span className="font-label-sm text-label-sm tracking-widest text-primary-fixed">
              {getLanguageLabel()}
            </span>
            <span className="material-symbols-outlined text-[12px] text-outline">
              swap_horiz
            </span>
          </button>
        </div>

        {/* Center Holographic Tactical Voice Orb Engine */}
        <div className="relative w-full aspect-square max-w-[300px] mx-auto flex items-center justify-center my-1">
          {/* Ambient Holographic Backlight Radial Glow */}
          <div
            className={`absolute inset-4 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
              aiState === 'speaking'
                ? 'bg-gradient-to-tr from-primary-container/40 via-secondary-container/30 to-tertiary-container/20 scale-110'
                : 'bg-gradient-to-tr from-secondary-container/20 via-primary-container/25 to-tertiary-container/10'
            }`}
          />

          {/* Outer Concentric Telemetry Orbital Tick Marks */}
          <div className="absolute inset-0 rounded-full flex items-center justify-center pointer-events-none">
            <svg
              className="w-full h-full animate-[spin_24s_linear_infinite]"
              fill="none"
              viewBox="0 0 340 340"
            >
              <circle
                className="text-primary-container/30"
                cx="170"
                cy="170"
                r="162"
                stroke="currentColor"
                strokeDasharray="4 12"
                strokeWidth="1.5"
              />
              <circle
                className="text-secondary/40"
                cx="170"
                cy="170"
                r="148"
                stroke="currentColor"
                strokeDasharray="2 20"
                strokeWidth="1"
              />
              <path
                className="text-primary-container/70"
                d="M 170 8 A 162 162 0 0 1 332 170"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <path
                className="text-secondary/60"
                d="M 170 332 A 162 162 0 0 1 8 170"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="3"
              />
            </svg>
          </div>

          {/* Counter-rotating Inner Precision Arc Ring */}
          <div className="absolute inset-6 rounded-full flex items-center justify-center pointer-events-none">
            <svg
              className="w-full h-full animate-[spin_16s_linear_infinite_reverse]"
              fill="none"
              viewBox="0 0 292 292"
            >
              <circle
                className="text-primary-fixed/35"
                cx="146"
                cy="146"
                r="138"
                stroke="currentColor"
                strokeDasharray="6 14"
                strokeWidth="1"
              />
              <path
                className="text-primary-fixed-dim/90"
                d="M 146 8 A 138 138 0 0 1 284 146"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          {/* Expanding Sonar Pulse Rings */}
          <div
            className={`absolute w-56 h-56 rounded-full bg-primary-container/10 pointer-events-none ${
              aiState === 'listening' || aiState === 'speaking' ? 'animate-ping' : ''
            }`}
          />
          <div
            className={`absolute w-44 h-44 rounded-full bg-secondary-container/15 pointer-events-none ${
              aiState === 'speaking' ? 'animate-pulse' : ''
            }`}
          />

          {/* Core Holographic S Shield / Neural Singularity Center (Clicking interrupts speech) */}
          <button
            onClick={() => {
              if (aiState === 'speaking') {
                onInterrupt();
              } else if (!isContinuousActive) {
                onStartContinuous();
              }
            }}
            className="relative z-10 w-38 h-38 rounded-full bg-surface-container-lowest/90 backdrop-blur-2xl flex flex-col items-center justify-center p-space-sm shadow-[0_0_40px_rgba(0,240,255,0.4)] border border-primary-container/30 cursor-pointer active:scale-95 transition-transform"
            title={aiState === 'speaking' ? 'Tap to interrupt' : 'Continuous Voice Core'}
          >
            {/* Neural Circuit Pattern Backdrop */}
            <svg
              className="absolute inset-2 w-34 h-34 opacity-40 animate-[spin_40s_linear_infinite]"
              fill="none"
              viewBox="0 0 160 160"
            >
              <path
                className="text-primary"
                d="M80 15 C 50 15, 20 40, 20 80 C 20 120, 50 145, 80 145"
                stroke="currentColor"
                strokeDasharray="3 5"
                strokeWidth="1"
              />
              <path
                className="text-primary-container"
                d="M80 15 C 110 15, 140 40, 140 80 C 140 120, 110 145, 80 145"
                stroke="currentColor"
                strokeDasharray="3 5"
                strokeWidth="1"
              />
              <circle
                className="text-secondary"
                cx="80"
                cy="80"
                r="62"
                stroke="currentColor"
                strokeDasharray="1 8"
                strokeWidth="1"
              />
            </svg>

            {/* Center Dynamic Neural Glyph */}
            <div className="relative z-20 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center">
                <span className="font-headline-lg text-headline-lg font-bold tracking-tighter text-primary drop-shadow-[0_0_16px_rgba(0,240,255,0.9)]">
                  S
                </span>
                <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-primary-container animate-ping" />
              </div>
              <span className="font-label-sm text-label-sm tracking-widest text-primary-fixed uppercase mt-0.5">
                {aiState === 'speaking' ? 'TAP TO INTERRUPT' : 'SHREE FEMALE CORE'}
              </span>
            </div>

            {/* Live Symmetrical Micro-Waveform Matrix */}
            <div className="flex items-center justify-center gap-1.5 h-6 mt-2 z-20">
              <span
                className={`w-1 bg-gradient-to-t from-primary-fixed to-primary-container rounded-full ${
                  aiState === 'speaking' ? 'h-5 animate-pulse' : 'h-3'
                }`}
              />
              <span
                className={`w-1 bg-gradient-to-t from-primary-fixed to-primary-container rounded-full ${
                  aiState === 'speaking' ? 'h-6 animate-bounce' : 'h-4'
                }`}
              />
              <span
                className={`w-1 bg-gradient-to-t from-primary-fixed to-primary-container rounded-full ${
                  aiState === 'speaking' ? 'h-6 animate-pulse' : 'h-5'
                }`}
              />
              <span
                className={`w-1 bg-gradient-to-t from-primary-fixed to-primary-container rounded-full ${
                  aiState === 'speaking' ? 'h-5 animate-bounce' : 'h-3'
                }`}
              />
              <span
                className={`w-1 bg-gradient-to-t from-primary-fixed to-primary-container rounded-full ${
                  aiState === 'speaking' ? 'h-4 animate-pulse' : 'h-4'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Live Transcript & AI Intelligence Dialogue Stack */}
        <div className="flex flex-col gap-space-sm w-full">
          {/* User Input Speech-To-Text Bubble */}
          <div className="bg-surface-container-high/70 backdrop-blur-xl p-space-md rounded-2xl shadow-md flex flex-col gap-space-xs border border-primary-container/15">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                <span className="material-symbols-outlined text-[15px] text-secondary">mic</span>
                <span>User Speech Input</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-primary-fixed-dim font-label-sm text-label-sm">
                <span>CONFIDENCE</span>
                <span className="font-semibold text-primary">99.4%</span>
              </div>
            </div>
            <p className="font-headline-sm text-headline-sm text-on-surface leading-snug tracking-tight">
              “{userTranscript || 'Hey Shree, WhatsApp par papa ko call lagao...'}”
            </p>
          </div>

          {/* AI Real-Time Response Bubble with Equalizer Output */}
          <div className="bg-surface-container-lowest/90 backdrop-blur-2xl p-space-md rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.6)] flex flex-col gap-space-sm relative overflow-hidden border border-primary-container/20">
            {/* Glow Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-80" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_rgba(0,240,255,0.9)] animate-ping" />
                <span className="font-label-sm text-label-sm tracking-widest text-primary uppercase font-bold">
                  SHREE SYNTHESIS • FEMALE VOICE
                </span>
              </div>
              {/* Live Cyan Neon Audio Equalizer Bars */}
              <div className="flex items-end gap-1 h-3.5">
                <span className="w-1 bg-primary-container rounded-full h-full animate-[pulse_0.6s_infinite]" />
                <span className="w-1 bg-primary-container rounded-full h-2/3 animate-[pulse_0.4s_infinite]" />
                <span className="w-1 bg-primary-container rounded-full h-4/5 animate-[pulse_0.8s_infinite]" />
                <span className="w-1 bg-primary-container rounded-full h-full animate-[pulse_0.5s_infinite]" />
                <span className="w-1 bg-primary-container rounded-full h-1/2 animate-[pulse_0.7s_infinite]" />
              </div>
            </div>
            <p className="font-body-lg text-body-lg text-tertiary leading-relaxed">
              {aiResponse ||
                'Main Papa (+91 98765 XXXXX) ko WhatsApp audio call connect kar rahi hoon...'}
            </p>
            {/* Active Action Telemetry Badge */}
            <div className="flex items-center gap-2 pt-1 text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined text-[16px] text-primary-fixed-dim">
                call
              </span>
              <span>
                Action: Initiating intent{' '}
                <span className="text-primary font-semibold">
                  {actionTelemetry || 'android.intent.action.CALL'}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Floating HUD Action Control Bar */}
        <div className="flex items-center justify-center gap-space-md py-space-xs my-auto">
          {/* Mute / Unmute Microphone Action */}
          <button
            onClick={onToggleMute}
            aria-label="Mute Microphone"
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md ${
              isMuted
                ? 'bg-error-container text-error ring-2 ring-error'
                : 'bg-surface-container-high/90 hover:bg-surface-bright text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isMuted ? 'mic_off' : 'mic'}
            </span>
          </button>

          {/* Large Cancel / Terminate Voice HUD Session (Red Neon Ring) */}
          <button
            onClick={() => {
              if (isContinuousActive) onEndContinuous();
              onClose();
            }}
            aria-label="Terminate Voice Session"
            className="relative group w-20 h-20 rounded-full bg-error-container text-on-error-container flex flex-col items-center justify-center transition-transform active:scale-95 shadow-[0_0_28px_rgba(255,180,171,0.35)]"
          >
            <div className="absolute inset-0 rounded-full bg-error/20 animate-ping pointer-events-none" />
            <span className="material-symbols-outlined text-[32px] text-error">close</span>
            <span className="font-label-sm text-label-sm text-error uppercase tracking-widest -mt-1 font-bold">
              CANCEL
            </span>
          </button>

          {/* Manual Keyboard Switch Action */}
          <button
            onClick={onSwitchToKeyboard}
            aria-label="Switch to Text Keyboard Input"
            className="w-14 h-14 rounded-full bg-surface-container-high/90 hover:bg-surface-bright text-on-surface flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md text-secondary"
          >
            <span className="material-symbols-outlined text-[24px]">keyboard</span>
          </button>
        </div>

        {/* Quick Voice Suggestions Carousel / Tray */}
        <div className="flex flex-col gap-space-xs pt-space-xs pb-6">
          <div className="flex items-center justify-between text-on-surface-variant px-1 font-label-sm text-label-sm tracking-wider uppercase">
            <span>Suggested Prompts</span>
            <span className="text-primary-container">TAP TO SPEAK</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => onPromptSelect('Subah ka weather kaisa hai?')}
              className="whitespace-nowrap px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface flex items-center gap-2 shadow-sm shrink-0 border border-primary-container/20 active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px] text-primary-fixed">
                partly_cloudy_day
              </span>
              <span className="font-body-md text-body-md">“Subah ka weather kaisa hai?”</span>
            </button>
            <button
              onClick={() => onPromptSelect('YouTube par workout music chalao')}
              className="whitespace-nowrap px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface flex items-center gap-2 shadow-sm shrink-0 border border-secondary/20 active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">
                music_note
              </span>
              <span className="font-body-md text-body-md">“YouTube par workout music chalao”</span>
            </button>
            <button
              onClick={() => onPromptSelect('Navigate to Connaught Place')}
              className="whitespace-nowrap px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface flex items-center gap-2 shadow-sm shrink-0 border border-primary-container/20 active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px] text-primary-container">
                near_me
              </span>
              <span className="font-body-md text-body-md">“Navigate to Connaught Place”</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
