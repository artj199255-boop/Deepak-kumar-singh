import React, { useState } from 'react';
import { LiveTimeInfo, AppTab } from '../types';

interface AppsScreenProps {
  timeInfo: LiveTimeInfo;
  onOpenShortcut: (shortcut: string) => void;
  onRunMacro: (macro: 'morning' | 'drive' | 'focus') => void;
  onNavigateTab: (tab: AppTab) => void;
  onVoiceTrigger: () => void;
}

export const AppsScreen: React.FC<AppsScreenProps> = ({
  timeInfo,
  onOpenShortcut,
  onRunMacro,
  onNavigateTab,
  onVoiceTrigger,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMacro, setActiveMacro] = useState<string | null>(null);

  const filterCategories = [
    { id: 'all', label: 'ALL APPS' },
    { id: 'comm', label: 'COMMUNICATION' },
    { id: 'media', label: 'MEDIA & WEB' },
    { id: 'tools', label: 'SYSTEM TOOLS' },
    { id: 'nav', label: 'NAVIGATION' },
  ];

  const appCards = [
    {
      id: 'youtube',
      name: 'YouTube',
      subtitle: 'One-tap voice playback',
      category: 'media',
      tag: 'STREAM',
      actionText: 'MEDIA LINK',
      icon: 'smart_display',
      iconColor: 'text-error',
      iconBg: 'bg-error-container/30',
      glow: 'bg-error-container/20',
    },
    {
      id: 'search',
      name: 'Google AI',
      subtitle: 'Instant computational query',
      category: 'tools',
      tag: 'KNOWLEDGE',
      actionText: 'LIVE SEARCH',
      icon: 'manage_search',
      iconColor: 'text-secondary',
      iconBg: 'bg-secondary/15',
      glow: 'bg-secondary/15',
    },
    {
      id: 'maps',
      name: 'Google Maps',
      subtitle: 'Real-time traffic scanner',
      category: 'nav',
      tag: 'HUD GPS',
      actionText: 'NAV CORE',
      icon: 'near_me',
      iconColor: 'text-primary-container',
      iconBg: 'bg-primary-container/20',
      glow: 'bg-primary-container/15',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      subtitle: 'Voice dictate active',
      category: 'comm',
      tag: 'COMMS',
      actionText: 'FAST CHAT',
      icon: 'forum',
      iconColor: 'text-primary-fixed',
      iconBg: 'bg-primary-fixed-dim/20',
      glow: 'bg-primary-fixed-dim/20',
    },
    {
      id: 'call',
      name: 'Phone Core',
      subtitle: 'Emergency SOS & speed-dial',
      category: 'comm',
      tag: 'DIALER',
      actionText: 'DIRECT LINK',
      icon: 'call',
      iconColor: 'text-secondary-fixed',
      iconBg: 'bg-secondary-container/20',
      glow: 'bg-secondary-container/20',
    },
    {
      id: 'camera',
      name: 'Neural Vision',
      subtitle: 'Real-time Hindi OCR scanner',
      category: 'tools',
      tag: 'OCR/AI',
      actionText: 'SENSOR FEED',
      icon: 'photo_camera',
      iconColor: 'text-primary-container',
      iconBg: 'bg-primary-container/20',
      glow: 'bg-primary-container/20',
    },
  ];

  const filteredCards = appCards.filter((card) => {
    const matchesCat = filter === 'all' || card.category === filter;
    const matchesSearch =
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleMacroClick = (macro: 'morning' | 'drive' | 'focus') => {
    setActiveMacro(macro);
    onRunMacro(macro);
    setTimeout(() => {
      setActiveMacro(null);
    }, 2500);
  };

  return (
    <div className="flex flex-col w-full px-margin pb-28 pt-2 gap-space-md select-none">
      {/* Sentient Neural Core Banner / Telemetry Status */}
      <div className="relative w-full rounded-xl bg-surface-container-low p-space-md overflow-hidden shadow-xl border border-primary-container/20">
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-primary-container/10 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between gap-space-md relative z-10">
          <div className="flex items-center gap-space-sm">
            <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container-high shadow-[0_0_16px_rgba(0,240,255,0.25)] border border-primary-container/30">
              <svg className="w-9 h-9 text-primary-container" fill="none" viewBox="0 0 100 100">
                <circle
                  className="opacity-40 animate-[spin_18s_linear_infinite]"
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="currentColor"
                  strokeDasharray="6 4"
                  strokeWidth="2"
                />
                <circle
                  className="opacity-70 animate-[spin_10s_linear_infinite_reverse]"
                  cx="50"
                  cy="50"
                  r="34"
                  stroke="currentColor"
                  strokeDasharray="14 8"
                  strokeWidth="1.5"
                />
                <circle className="opacity-50" cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="1" />
                <path
                  d="M58 36C56 33 53 31 49 31C42 31 38 35 38 41C38 52 62 48 62 61C62 67 57 71 49 71C43 71 39 67 37 62M42 38L37 32M57 65L63 70"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4.5"
                />
                <circle className="animate-pulse" cx="50" cy="50" fill="currentColor" r="3" />
              </svg>
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary-container shadow-[0_0_8px_#00f0ff]" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-label-sm text-label-sm text-primary-container tracking-widest uppercase font-bold">
                  HUD MATRIX READY
                </span>
                <span className="w-1 h-1 rounded-full bg-primary-container animate-ping" />
              </div>
              <span className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">
                Kahiye, kya chalu karoon?
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                Neural Dispatcher • 8 Subroutines Active
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0 text-right">
            <span className="font-label-sm text-label-sm text-secondary tracking-widest">LATENCY</span>
            <span className="font-label-lg text-label-lg text-primary-fixed font-bold">14ms</span>
            <span className="font-label-sm text-label-sm text-outline">NEW DELHI IST</span>
          </div>
        </div>
      </div>

      {/* HUD Search & Multimodal Voice Dispatcher */}
      <div className="relative w-full rounded-full bg-surface-container-high/90 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.1)] p-1.5 flex items-center gap-2 border border-primary-container/20">
        <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary-container shrink-0 shadow-inner">
          <span className="material-symbols-outlined text-[20px]">search</span>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Launch app or routine... (e.g. 'Open Maps')"
          className="w-full bg-transparent text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none min-w-0"
        />
        <button
          onClick={onVoiceTrigger}
          className="h-9 px-3 rounded-full bg-primary-container text-on-primary flex items-center gap-1 shrink-0 font-label-sm text-label-sm shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-transform active:scale-95 font-bold"
          title="Voice Dictate"
        >
          <span className="material-symbols-outlined text-[18px]">mic</span>
          <span className="hidden xs:inline">BOLIYE</span>
        </button>
      </div>

      {/* Category Pills / Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {filterCategories.map((cat) => {
          const isActive = filter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary-container text-on-primary shadow-[0_0_10px_rgba(0,240,255,0.35)] font-bold'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* World Clock & Chrono Sensor HUD Widget */}
      <div className="relative w-full rounded-xl bg-surface-container-low p-space-md overflow-hidden shadow-lg border border-primary-container/20">
        {/* Corner Reticle Accents */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-primary-container/70" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-primary-container/70" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-primary-container/70" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary-container/70" />

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary-container">
                schedule
              </span>
              <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase">
                NEW DELHI • ASIA/KOLKATA
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-display-lg-mobile text-display-lg-mobile font-bold text-primary tracking-tight">
                {timeInfo.timeString.split(' ')[0]}
              </span>
              <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase">
                IST {timeInfo.timeString.split(' ')[1] || 'AM'}
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {timeInfo.weekday}, {timeInfo.day} {timeInfo.month} • {timeInfo.weatherDesc}
            </span>
          </div>

          <div className="flex flex-col items-end gap-1.5 pl-2">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-container-high/90 border border-primary/10">
              <span className="material-symbols-outlined text-[15px] text-tertiary-fixed-dim">
                wb_sunny
              </span>
              <span className="font-label-sm text-label-sm text-on-surface">
                RISE {timeInfo.sunrise}
              </span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-container-high/90 border border-primary/10">
              <span className="material-symbols-outlined text-[15px] text-secondary">
                wb_twilight
              </span>
              <span className="font-label-sm text-label-sm text-on-surface">
                SET {timeInfo.sunset}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header: Neural App Grid */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-primary-container rounded-full" />
          <h2 className="font-headline-sm text-headline-sm font-semibold text-primary">
            Neural App Matrix
          </h2>
        </div>
        <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase">
          {filteredCards.length + 1} CORES LINKED
        </span>
      </div>

      {/* Holographic App Cards Matrix (2-column layout) */}
      <div className="grid grid-cols-2 gap-space-sm w-full">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            onClick={() => onOpenShortcut(card.id)}
            className="relative rounded-xl bg-surface-container-low p-space-md flex flex-col justify-between gap-space-sm shadow-md transition-all active:scale-[0.98] hover:bg-surface-container cursor-pointer overflow-hidden border border-primary-container/15"
          >
            <div
              className={`absolute -top-6 -right-6 w-16 h-16 rounded-full ${card.glow} blur-xl pointer-events-none`}
            />
            <div className="flex items-center justify-between">
              <div
                className={`w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center ${card.iconColor} shadow-[0_0_12px_rgba(0,240,255,0.2)]`}
              >
                <span className="material-symbols-outlined text-[26px]">{card.icon}</span>
              </div>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-highest text-secondary">
                {card.tag}
              </span>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface truncate">
                {card.name}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                {card.subtitle}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-label-sm text-label-sm text-primary-container tracking-wider font-bold">
                {card.actionText}
              </span>
              <span className="material-symbols-outlined text-[16px] text-primary-container">
                arrow_forward
              </span>
            </div>
          </div>
        ))}

        {/* Card 7: Settings & Protocols (Full span in 2-col) */}
        {(filter === 'all' || filter === 'tools') && (
          <div
            onClick={() => onNavigateTab('settings')}
            className="col-span-2 relative rounded-xl bg-surface-container-low p-space-md flex items-center justify-between gap-space-md shadow-md transition-all active:scale-[0.99] hover:bg-surface-container cursor-pointer overflow-hidden border border-primary-container/20"
          >
            <div className="flex items-center gap-space-md min-w-0">
              <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-outline-variant shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[26px] text-on-surface">
                  tune
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Settings &amp; Protocols
                  </span>
                  <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-secondary">
                    SYS_ROOT
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Hardware controls, neural telemetry &amp; wake-word tuning
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-primary-container">
              <span className="font-label-sm text-label-sm tracking-wider uppercase font-bold">
                CONFIG
              </span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </div>
          </div>
        )}
      </div>

      {/* Voice Macro Routines Section */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-secondary rounded-full" />
          <h2 className="font-headline-sm text-headline-sm font-semibold text-primary">
            Voice Macro Routines
          </h2>
        </div>
        <span className="font-label-sm text-label-sm text-secondary tracking-wider uppercase">
          AUTOMATION HUD
        </span>
      </div>

      <div className="flex flex-col gap-space-sm w-full">
        {/* Macro 1: Morning Routine */}
        <div
          onClick={() => handleMacroClick('morning')}
          className="relative rounded-xl bg-surface-container-low p-space-md flex items-center justify-between gap-space-sm shadow-md cursor-pointer transition-all hover:bg-surface-container border border-primary-container/10"
        >
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-tertiary-fixed shrink-0 shadow-[0_0_10px_rgba(196,231,255,0.2)]">
              <span className="material-symbols-outlined text-[22px]">sunny</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  Morning Routine
                </span>
                <span className="font-label-sm text-label-sm px-1.5 py-0.2 rounded bg-surface-container-highest text-primary-container">
                  HINDI/ENG
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                Triggers Weather + Aaj Ka Samachar + WhatsApp unread recap
              </span>
            </div>
          </div>
          <button
            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-[0_0_8px_#00f0ff] active:scale-90 transition-transform ${
              activeMacro === 'morning'
                ? 'bg-secondary-container text-on-secondary'
                : 'bg-primary-container text-on-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {activeMacro === 'morning' ? 'done' : 'play_arrow'}
            </span>
          </button>
        </div>

        {/* Macro 2: Drive Mode */}
        <div
          onClick={() => handleMacroClick('drive')}
          className="relative rounded-xl bg-surface-container-low p-space-md flex items-center justify-between gap-space-sm shadow-md cursor-pointer transition-all hover:bg-surface-container border border-primary-container/10"
        >
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary-container shrink-0 shadow-[0_0_10px_rgba(0,240,255,0.25)]">
              <span className="material-symbols-outlined text-[22px]">directions_car</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  Drive Mode Protocol
                </span>
                <span className="font-label-sm text-label-sm px-1.5 py-0.2 rounded bg-surface-container-highest text-secondary">
                  AUTO-HUD
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                Launches Maps + Hands-free voice trigger + Traffic radar
              </span>
            </div>
          </div>
          <button
            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-[0_0_8px_#00f0ff] active:scale-90 transition-transform ${
              activeMacro === 'drive'
                ? 'bg-secondary-container text-on-secondary'
                : 'bg-primary-container text-on-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {activeMacro === 'drive' ? 'done' : 'play_arrow'}
            </span>
          </button>
        </div>

        {/* Macro 3: Focus Protocol */}
        <div
          onClick={() => handleMacroClick('focus')}
          className="relative rounded-xl bg-surface-container-low p-space-md flex items-center justify-between gap-space-sm shadow-md cursor-pointer transition-all hover:bg-surface-container border border-primary-container/10"
        >
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary-fixed shrink-0 shadow-[0_0_10px_rgba(207,229,255,0.2)]">
              <span className="material-symbols-outlined text-[22px]">self_improvement</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  Focus Protocol (Zen)
                </span>
                <span className="font-label-sm text-label-sm px-1.5 py-0.2 rounded bg-surface-container-highest text-tertiary-fixed">
                  DND ON
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                App limits engaged + DND mute + Shree Ambient Lo-Fi soundscape
              </span>
            </div>
          </div>
          <button
            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-[0_0_8px_#00f0ff] active:scale-90 transition-transform ${
              activeMacro === 'focus'
                ? 'bg-secondary-container text-on-secondary'
                : 'bg-primary-container text-on-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {activeMacro === 'focus' ? 'done' : 'play_arrow'}
            </span>
          </button>
        </div>
      </div>

      {/* Multimodal System Telemetry Dock */}
      <div className="w-full rounded-xl bg-surface-container-high/60 backdrop-blur-md p-space-sm flex items-center justify-between text-on-surface-variant border border-primary-container/10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-primary-container">
            memory
          </span>
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
            NPU Core: 4.8 GHz
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
          <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-bold">
            SYNAPSE OK
          </span>
        </div>
      </div>
    </div>
  );
};
