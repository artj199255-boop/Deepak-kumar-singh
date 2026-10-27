import React, { useState } from 'react';
import { AiState, LiveTimeInfo, AppSettings } from '../types';

interface HomeScreenProps {
  aiState: AiState;
  setAiState: (state: AiState) => void;
  onMicPress: () => void;
  isListening: boolean;
  onSendPrompt: (prompt: string) => void;
  onOpenVoiceHud: () => void;
  onOpenAppShortcut: (shortcut: string) => void;
  timeInfo: LiveTimeInfo;
  settings: AppSettings;
  isContinuousActive: boolean;
  onStartContinuous: () => void;
  onEndContinuous: () => void;
  onTogglePauseContinuous: () => void;
  onInterrupt: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  aiState,
  setAiState,
  onMicPress,
  isListening,
  onSendPrompt,
  onOpenVoiceHud,
  onOpenAppShortcut,
  timeInfo,
  isContinuousActive,
  onStartContinuous,
  onEndContinuous,
  onTogglePauseContinuous,
  onInterrupt,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendPrompt(inputText.trim());
      setInputText('');
    }
  };

  const getStatusText = () => {
    if (aiState === 'listening') return 'CORE ACTIVE • LISTENING';
    if (aiState === 'thinking') return 'CORE PROCESSING • NEURAL SCAN';
    if (aiState === 'speaking') return 'NATURAL FEMALE VOICE • VOCAL ACTIVE';
    if (aiState === 'paused') return 'CONVERSATION PAUSED';
    return 'AUDIO SYNTHESIS • VOCAL ACTIVE';
  };

  return (
    <div className="flex flex-col w-full px-margin pb-28 pt-2 space-y-space-lg select-none relative overflow-hidden">
      {/* Radial Backdrops */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 -left-20 w-64 h-64 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Telemetry Bar */}
      <div className="flex items-center justify-between bg-surface-container-low/90 backdrop-blur-md px-3.5 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-primary-container/10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container" />
          </span>
          <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">
            QUANTUM PROTOCOL v4.2
          </span>
          <span className="font-label-sm text-label-sm text-outline px-1">//</span>
          <span className="font-label-sm text-label-sm text-primary-fixed-dim font-bold">
            SYS: READY
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
          <span className="material-symbols-outlined text-[13px] text-secondary">schedule</span>
          <span>
            {timeInfo.hindiWeekday}, {timeInfo.day} {timeInfo.month.slice(0, 3)}
          </span>
        </div>
      </div>

      {/* Holographic AI JARVIS Core Orb */}
      <div className="relative flex flex-col items-center justify-center pt-2 pb-1">
        <div className="relative w-64 h-64 xs:w-72 xs:h-72 flex items-center justify-center">
          {/* Glow Discs */}
          <div
            className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
              aiState === 'speaking'
                ? 'bg-primary-fixed-dim/30 animate-pulse'
                : aiState === 'thinking'
                ? 'bg-secondary-container/30'
                : 'bg-primary-container/15'
            }`}
          />
          <div className="absolute inset-4 rounded-full bg-secondary-container/20 blur-xl" />

          {/* Nested SVG Holographic HUD Rings */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            fill="none"
            viewBox="0 0 280 280"
          >
            {/* Outermost Ring with Tickmarks */}
            <circle
              className="animate-[spin_45s_linear_infinite]"
              cx="140"
              cy="140"
              r="132"
              stroke="#00f0ff"
              strokeDasharray="4 8"
              strokeOpacity="0.25"
              strokeWidth="1.2"
              style={{ transformOrigin: '140px 140px' }}
            />
            {/* Telemetry Quadrant Arcs */}
            <circle
              className="animate-[spin_20s_linear_infinite_reverse]"
              cx="140"
              cy="140"
              r="122"
              stroke="#98cbff"
              strokeDasharray="45 180"
              strokeOpacity="0.35"
              strokeWidth="2"
              style={{ transformOrigin: '140px 140px' }}
            />
            {/* Precision Segment Ring */}
            <circle
              className="animate-[spin_28s_linear_infinite]"
              cx="140"
              cy="140"
              r="110"
              stroke="#00f0ff"
              strokeDasharray="8 6 24 6"
              strokeOpacity="0.5"
              strokeWidth="1.5"
              style={{ transformOrigin: '140px 140px' }}
            />
            {/* Dynamic Audio Radar Arc */}
            <circle
              className="animate-[spin_12s_linear_infinite]"
              cx="140"
              cy="140"
              r="95"
              stroke="#dbfcff"
              strokeDasharray="70 210"
              strokeOpacity="0.6"
              strokeWidth="2.5"
              style={{ transformOrigin: '140px 140px' }}
            />
            <circle
              cx="140"
              cy="140"
              r="82"
              stroke="#00a2fd"
              strokeDasharray="3 3"
              strokeOpacity="0.4"
              strokeWidth="1"
            />
            {/* Inner Core Reticles */}
            <line stroke="#00f0ff" strokeOpacity="0.7" strokeWidth="1.5" x1="140" x2="140" y1="20" y2="40" />
            <line stroke="#00f0ff" strokeOpacity="0.7" strokeWidth="1.5" x1="140" x2="140" y1="240" y2="260" />
            <line stroke="#00f0ff" strokeOpacity="0.7" strokeWidth="1.5" x1="20" x2="40" y1="140" y2="140" />
            <line stroke="#00f0ff" strokeOpacity="0.7" strokeWidth="1.5" x1="240" x2="260" y1="140" y2="140" />
          </svg>

          {/* Center Neural Bio-Core Glyph Tile */}
          <button
            onClick={() => {
              if (aiState === 'speaking') {
                onInterrupt();
              } else if (!isContinuousActive) {
                onStartContinuous();
              } else {
                onOpenVoiceHud();
              }
            }}
            className="relative z-10 w-36 h-36 rounded-full bg-gradient-to-b from-surface-container-high/90 to-surface-container-lowest/90 backdrop-blur-xl flex flex-col items-center justify-center p-3 cursor-pointer shadow-[0_0_35px_rgba(0,240,255,0.45)] hover:shadow-[0_0_45px_rgba(0,240,255,0.65)] transition-all duration-300 active:scale-95 border border-primary-container/30 group"
            title={
              aiState === 'speaking'
                ? 'Tap to interrupt Shree'
                : isContinuousActive
                ? 'Conversation active • Tap to open HUD'
                : 'Tap to start continuous conversation'
            }
          >
            <div className="relative flex items-center justify-center">
              {/* Stylized Sci-Fi Core Neural 'S' Emblem */}
              <svg className="w-16 h-16 drop-shadow-[0_0_12px_#00f0ff]" fill="none" viewBox="0 0 64 64">
                <path
                  d="M44 18C41 14 36 12 30 12C20 12 14 18 14 25C14 36 48 30 48 45C48 53 40 58 31 58C21 58 15 52 13 46"
                  stroke="#00f0ff"
                  strokeLinecap="round"
                  strokeWidth="5"
                />
                <circle cx="30" cy="20" fill="#dbfcff" r="2" />
                <circle cx="34" cy="44" fill="#7df4ff" r="2.5" />
                <circle cx="20" cy="26" fill="#98cbff" r="1.5" />
                <circle cx="42" cy="38" fill="#00dbe9" r="1.5" />
                <line stroke="#00f0ff" strokeOpacity="0.6" strokeWidth="0.8" x1="30" x2="20" y1="20" y2="26" />
                <line stroke="#00f0ff" strokeOpacity="0.6" strokeWidth="0.8" x1="34" x2="42" y1="44" y2="38" />
              </svg>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping" />
              <span className="font-label-sm text-label-sm text-primary tracking-wider group-hover:text-primary-fixed">
                {aiState === 'speaking' ? 'INTERRUPT' : isContinuousActive ? 'LIVE SESSION' : 'NEURAL ACTIVE'}
              </span>
            </div>
          </button>
        </div>

        {/* Active State Pill Indicator */}
        <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container/80 shadow-[0_0_16px_rgba(0,240,255,0.2)] border border-primary-container/20">
          <span
            className={`material-symbols-outlined text-[14px] ${
              aiState === 'listening'
                ? 'text-primary-container animate-pulse'
                : aiState === 'thinking'
                ? 'text-secondary animate-spin'
                : aiState === 'speaking'
                ? 'text-primary animate-bounce'
                : 'text-outline'
            }`}
          >
            {aiState === 'listening'
              ? 'radio_button_checked'
              : aiState === 'thinking'
              ? 'psychology'
              : aiState === 'speaking'
              ? 'volume_up'
              : 'pause'}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface tracking-widest font-semibold uppercase">
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Prominent Continuous Conversation Mode Banner & Controls */}
      <div className="w-full rounded-2xl bg-surface-container-low/90 backdrop-blur-xl p-3 border border-primary-container/25 shadow-lg flex flex-col gap-2">
        {!isContinuousActive ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-container shrink-0 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
                <span className="material-symbols-outlined text-[22px]">record_voice_over</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
                  Continuous Hindi Conversation
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Hands-free natural female voice dialogue
                </span>
              </div>
            </div>

            <button
              onClick={onStartContinuous}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-on-primary font-label-md text-label-md font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_16px_rgba(0,240,255,0.45)] active:scale-95 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              <span>Start Conversation</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
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
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  {aiState === 'listening'
                    ? 'Listening continuously... Boliye'
                    : aiState === 'thinking'
                    ? 'Understanding intent...'
                    : aiState === 'speaking'
                    ? 'Shree speaking in natural female voice...'
                    : 'Conversation paused'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {aiState === 'speaking' && (
                <button
                  onClick={onInterrupt}
                  className="px-2.5 py-1.5 rounded-lg bg-surface-container-high text-primary hover:bg-surface-bright font-label-sm text-label-sm font-bold uppercase tracking-wide flex items-center gap-1 border border-primary/30 active:scale-95"
                  title="Interrupt Shree"
                >
                  <span className="material-symbols-outlined text-[16px]">front_hand</span>
                  <span className="hidden xs:inline">Interrupt</span>
                </button>
              )}

              <button
                onClick={onTogglePauseContinuous}
                className="p-2 rounded-lg bg-surface-container-high text-on-surface hover:text-primary font-label-sm text-label-sm active:scale-95"
                title={aiState === 'paused' ? 'Resume' : 'Pause'}
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

      {/* Assistant Salutation & Hindi/Hinglish Voice Context */}
      <div className="text-center space-y-1.5 px-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-secondary font-label-sm text-label-sm border border-secondary/20">
          <span className="material-symbols-outlined text-[13px]">graphic_eq</span>
          <span>NATURAL FEMALE HINDI VOICE &amp; MULTILINGUAL COGNITION</span>
        </div>
        <h2 className="font-headline-lg text-headline-lg font-bold text-primary tracking-wide drop-shadow-[0_0_12px_rgba(0,240,255,0.35)]">
          नमस्ते, मैं Shree हूँ
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-xs mx-auto">
          Main aapki kya madad kar sakti hoon?{' '}
          <span className="text-primary-container font-medium">Listening for commands, Boss.</span>
        </p>
      </div>

      {/* State Toggle Pills (Interactive Mode Demo) */}
      <div className="flex items-center justify-center gap-2 pt-1">
        <button
          onClick={() => setAiState('listening')}
          className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm flex items-center gap-1.5 transition-all ${
            aiState === 'listening'
              ? 'bg-primary-container text-on-primary shadow-[0_0_12px_rgba(0,240,255,0.4)]'
              : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              aiState === 'listening' ? 'bg-surface-dim animate-ping' : 'bg-outline'
            }`}
          />
          <span>LISTENING</span>
        </button>

        <button
          onClick={() => setAiState('thinking')}
          className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm flex items-center gap-1.5 transition-all ${
            aiState === 'thinking'
              ? 'bg-primary-container text-on-primary shadow-[0_0_12px_rgba(0,240,255,0.4)]'
              : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              aiState === 'thinking' ? 'bg-secondary animate-pulse' : 'bg-outline'
            }`}
          />
          <span>THINKING</span>
        </button>

        <button
          onClick={() => setAiState('speaking')}
          className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm flex items-center gap-1.5 transition-all ${
            aiState === 'speaking'
              ? 'bg-primary-container text-on-primary shadow-[0_0_12px_rgba(0,240,255,0.4)]'
              : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              aiState === 'speaking' ? 'bg-primary animate-bounce' : 'bg-outline'
            }`}
          />
          <span>SPEAKING</span>
        </button>
      </div>

      {/* Tactile Voice Command Module */}
      <div className="bg-surface-container/70 backdrop-blur-xl rounded-xl p-space-md shadow-[0_8px_32px_rgba(0,0,0,0.45)] border border-primary-container/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-primary-container/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col items-center text-center space-y-space-md">
          {/* 7-Bar Dynamic Vocal Waveform Synthesizer */}
          <div className="flex items-end justify-center gap-1.5 h-8 w-full px-8">
            <div
              className={`w-1.5 bg-primary-container rounded-full transition-all duration-300 ${
                isListening || aiState === 'speaking' ? 'h-5 animate-[pulse_1.1s_infinite]' : 'h-2'
              }`}
            />
            <div
              className={`w-1.5 bg-primary rounded-full transition-all duration-300 ${
                isListening || aiState === 'speaking' ? 'h-7 animate-[pulse_0.7s_infinite]' : 'h-3'
              }`}
            />
            <div
              className={`w-1.5 bg-secondary-container rounded-full transition-all duration-300 ${
                isListening || aiState === 'speaking' ? 'h-4 animate-[pulse_1.4s_infinite]' : 'h-2'
              }`}
            />
            <div
              className={`w-1.5 bg-primary-container rounded-full transition-all duration-300 ${
                isListening || aiState === 'speaking' ? 'h-8 animate-[pulse_0.9s_infinite]' : 'h-4'
              }`}
            />
            <div
              className={`w-1.5 bg-secondary rounded-full transition-all duration-300 ${
                isListening || aiState === 'speaking' ? 'h-6 animate-[pulse_1.3s_infinite]' : 'h-2'
              }`}
            />
            <div
              className={`w-1.5 bg-primary rounded-full transition-all duration-300 ${
                isListening || aiState === 'speaking' ? 'h-4 animate-[pulse_0.8s_infinite]' : 'h-3'
              }`}
            />
            <div
              className={`w-1.5 bg-primary-container rounded-full transition-all duration-300 ${
                isListening || aiState === 'speaking' ? 'h-5 animate-[pulse_1.0s_infinite]' : 'h-1.5'
              }`}
            />
          </div>

          {/* Giant Floating Tactile Mic Button */}
          <div className="relative flex items-center justify-center my-1">
            <div
              className={`absolute w-24 h-24 rounded-full bg-primary-container/20 pointer-events-none ${
                isListening ? 'animate-ping opacity-90' : 'opacity-40'
              }`}
            />
            <div
              className={`absolute w-20 h-20 rounded-full bg-secondary-container/30 pointer-events-none ${
                isListening ? 'animate-pulse' : ''
              }`}
            />
            <button
              onClick={onMicPress}
              aria-label="Microphone Speech Input"
              className={`relative z-10 w-[72px] h-[72px] rounded-full flex items-center justify-center text-on-primary shadow-[0_0_28px_rgba(0,240,255,0.6)] active:scale-90 transition-transform ${
                isListening
                  ? 'bg-gradient-to-tr from-primary-fixed to-primary-container ring-4 ring-primary-container/50 animate-pulse'
                  : 'bg-gradient-to-tr from-primary-container to-secondary-container'
              }`}
            >
              <span className="material-symbols-outlined text-[34px] drop-shadow-md">
                {isListening ? 'mic' : 'mic_none'}
              </span>
            </button>
          </div>

          <div className="flex flex-col items-center">
            <span className="font-label-md text-label-md text-primary tracking-wider uppercase font-bold">
              {isListening ? 'Listening now... Boliye' : 'Tap or say "Hey Shree"'}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Realtime Multi-Modal Sensor Listening
            </span>
          </div>

          {/* Futuristic HUD Omnibar Input */}
          <form onSubmit={handleSubmit} className="w-full relative flex items-center">
            <div className="absolute left-3.5 flex items-center pointer-events-none text-primary">
              <span className="material-symbols-outlined text-[20px]">keyboard</span>
            </div>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type command or Hindi prompt..."
              className="w-full bg-surface-container-lowest/80 text-on-surface placeholder:text-outline font-body-md text-body-md pl-11 pr-12 py-3 rounded-full outline-none shadow-inner border border-primary-container/20 focus:border-primary-container focus:shadow-[0_0_16px_rgba(0,240,255,0.35)] transition-all"
            />
            <button
              type="submit"
              aria-label="Send query"
              className="absolute right-2 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-primary-container hover:text-on-primary active:scale-95 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">near_me</span>
            </button>
          </form>
        </div>
      </div>

      {/* Telemetry Apps & Neural Direct Links */}
      <div className="space-y-space-sm pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary">dashboard</span>
            <span className="font-label-md text-label-md text-on-surface tracking-wider uppercase font-bold">
              Neural Shortcuts
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase">
            SYS APPS (6)
          </span>
        </div>

        {/* Quick Action Bento Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* YouTube Card */}
          <button
            onClick={() => onOpenAppShortcut('youtube')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-center space-y-1.5 transition-all shadow-md group active:scale-95 border border-transparent hover:border-error/30"
          >
            <div className="w-10 h-10 rounded-full bg-error-container/30 text-error flex items-center justify-center group-hover:shadow-[0_0_14px_rgba(255,180,171,0.5)] transition-all">
              <span className="material-symbols-outlined text-[22px]">smart_display</span>
            </div>
            <div className="min-w-0 w-full">
              <p className="font-label-sm text-label-sm text-on-surface font-bold truncate">YouTube</p>
              <p className="font-body-sm text-[10px] leading-3 text-on-surface-variant truncate">
                Media Stream
              </p>
            </div>
          </button>

          {/* Google Omni Search */}
          <button
            onClick={() => onOpenAppShortcut('search')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-center space-y-1.5 transition-all shadow-md group active:scale-95 border border-transparent hover:border-secondary/30"
          >
            <div className="w-10 h-10 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center group-hover:shadow-[0_0_14px_rgba(0,162,253,0.5)] transition-all">
              <span className="material-symbols-outlined text-[22px]">search_insights</span>
            </div>
            <div className="min-w-0 w-full">
              <p className="font-label-sm text-label-sm text-on-surface font-bold truncate">Google</p>
              <p className="font-body-sm text-[10px] leading-3 text-on-surface-variant truncate">
                Omni Search
              </p>
            </div>
          </button>

          {/* Google Maps */}
          <button
            onClick={() => onOpenAppShortcut('maps')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-center space-y-1.5 transition-all shadow-md group active:scale-95 border border-transparent hover:border-primary-container/30"
          >
            <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary-fixed flex items-center justify-center group-hover:shadow-[0_0_14px_rgba(0,240,255,0.5)] transition-all">
              <span className="material-symbols-outlined text-[22px]">explore</span>
            </div>
            <div className="min-w-0 w-full">
              <p className="font-label-sm text-label-sm text-on-surface font-bold truncate">Maps</p>
              <p className="font-body-sm text-[10px] leading-3 text-on-surface-variant truncate">
                Navigation
              </p>
            </div>
          </button>

          {/* WhatsApp Direct Comms */}
          <button
            onClick={() => onOpenAppShortcut('whatsapp')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-center space-y-1.5 transition-all shadow-md group active:scale-95 border border-transparent hover:border-primary-fixed-dim/30"
          >
            <div className="w-10 h-10 rounded-full bg-primary-fixed-dim/20 text-primary-container flex items-center justify-center group-hover:shadow-[0_0_14px_rgba(0,240,255,0.5)] transition-all">
              <span className="material-symbols-outlined text-[22px]">chat</span>
            </div>
            <div className="min-w-0 w-full">
              <p className="font-label-sm text-label-sm text-on-surface font-bold truncate">WhatsApp</p>
              <p className="font-body-sm text-[10px] leading-3 text-on-surface-variant truncate">
                Quick Ping
              </p>
            </div>
          </button>

          {/* Cellular Link */}
          <button
            onClick={() => onOpenAppShortcut('call')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-center space-y-1.5 transition-all shadow-md group active:scale-95 border border-transparent hover:border-secondary-fixed/30"
          >
            <div className="w-10 h-10 rounded-full bg-secondary-fixed/20 text-secondary-fixed-dim flex items-center justify-center group-hover:shadow-[0_0_14px_rgba(152,203,255,0.5)] transition-all">
              <span className="material-symbols-outlined text-[22px]">call</span>
            </div>
            <div className="min-w-0 w-full">
              <p className="font-label-sm text-label-sm text-on-surface font-bold truncate">Phone</p>
              <p className="font-body-sm text-[10px] leading-3 text-on-surface-variant truncate">
                Cellular Link
              </p>
            </div>
          </button>

          {/* Vision Scanner Camera */}
          <button
            onClick={() => onOpenAppShortcut('camera')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-center space-y-1.5 transition-all shadow-md group active:scale-95 border border-transparent hover:border-primary-fixed/30"
          >
            <div className="w-10 h-10 rounded-full bg-primary-fixed/25 text-primary flex items-center justify-center group-hover:shadow-[0_0_14px_rgba(0,240,255,0.6)] transition-all">
              <span className="material-symbols-outlined text-[22px]">photo_camera</span>
            </div>
            <div className="min-w-0 w-full">
              <p className="font-label-sm text-label-sm text-on-surface font-bold truncate">Camera</p>
              <p className="font-body-sm text-[10px] leading-3 text-on-surface-variant truncate">
                Vision Scan
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Telemetry Diagnostics Status Strip */}
      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-lowest/90 text-on-surface-variant font-label-sm text-label-sm border border-primary-container/10">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[13px] text-primary">bolt</span>
          <span>
            LATENCY: <strong className="text-primary-fixed">12ms</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[13px] text-secondary">battery_saver</span>
          <span>
            DRAIN: <strong className="text-secondary">LOW (0.4%)</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[13px] text-primary-container">lock</span>
          <span>RSA-256</span>
        </div>
      </div>
    </div>
  );
};
