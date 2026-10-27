import React, { useState } from 'react';
import { AppSettings } from '../types';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClearHistory: () => void;
  onToast: (msg: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onClearHistory,
  onToast,
}) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleToggle = (key: keyof AppSettings['hardwareToggles']) => {
    const nextVal = !localSettings.hardwareToggles[key];
    const updatedHardware = {
      ...localSettings.hardwareToggles,
      [key]: nextVal,
    };
    const updated = {
      ...localSettings,
      hardwareToggles: updatedHardware,
    };
    setLocalSettings(updated);
    onUpdateSettings({ hardwareToggles: updatedHardware });
    onToast(
      `${key.toUpperCase()} SUBSYSTEM: ${nextVal ? 'ENGAGED / ACTIVE' : 'MUTED / STANDBY'}`
    );
  };

  const handleLangChange = (lang: AppSettings['primaryLang'], label: string) => {
    const updated = { ...localSettings, primaryLang: lang };
    setLocalSettings(updated);
    onUpdateSettings({ primaryLang: lang });
    onToast(`DIALECT SWITCHED: ${label.toUpperCase()}`);
  };

  const handlePersonaChange = (persona: 'male' | 'female', label: string) => {
    const updated = { ...localSettings, voicePersona: persona };
    setLocalSettings(updated);
    onUpdateSettings({ voicePersona: persona });
    onToast(`ACOUSTIC TIMBRE: ${label.toUpperCase()} ENGAGED`);
  };

  const handleSpeedChange = (val: number) => {
    setLocalSettings((prev) => ({ ...prev, speechVelocity: val }));
    onUpdateSettings({ speechVelocity: val });
  };

  const handlePitchChange = (val: number) => {
    setLocalSettings((prev) => ({ ...prev, vocalPitch: val }));
    onUpdateSettings({ vocalPitch: val });
  };

  const handleClearCache = () => {
    onClearHistory();
    onToast('CLEARED 248MB ENCRYPTED DIALOGUE CACHE');
  };

  return (
    <div className="flex flex-col w-full px-margin pb-space-xl space-y-space-lg select-none pt-2">
      {/* Profile & AI Engine Status Card (Bento Master Header) */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-space-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] border border-primary-container/20">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary-container/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-secondary-container/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-space-md">
          {/* Top Row: User Avatar & Basic Bio */}
          <div className="flex items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md min-w-0">
              <div className="relative shrink-0">
                <img
                  alt="User Profile"
                  className="w-14 h-14 rounded-full object-cover shadow-[0_0_16px_rgba(0,240,255,0.4)] border-2 border-primary-container/40"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEpEcbqR_-kQZW4nlyGym5L0Z0CvtguRR2roBna7QMxOTdU_vbmFpQyMZ2cpoIo6mlCtS9wbPFRIZNt-BZv7sovtSg6q4lKxjy7eGm5J5bwofRFmgeCxtkMQZioH5rEi5-f7lWAIdvRxGAVik10C07b4mWQuXU2rL9lyMTI4LTCxChnC9Vx-URyGlBaxUovI0Q5-fpT6bfIo8rvyIPFk7xYkMkpwI-Qa4qbv4ulgBYaWxFhyYxJsv2"
                />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-surface-container-lowest flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_#00f0ff]" />
                </div>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                    {localSettings.userName}
                  </span>
                  <span
                    className="material-symbols-outlined text-primary-container text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">
                  {localSettings.userRole}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm tracking-widest uppercase border border-primary/20">
                SYSLOG 01
              </span>
              <span className="font-label-sm text-label-sm text-outline mt-0.5">UID: 902-VKR</span>
            </div>
          </div>

          {/* AI Core Diagnostic Block */}
          <div className="p-space-sm rounded-lg bg-surface-container-high/80 flex flex-col gap-space-xs border border-primary-container/15">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary-container text-[18px]">
                  memory
                </span>
                <span className="font-label-md text-label-md text-on-surface">
                  SHREE AI Model: Neural-Omni v4
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary-container font-label-sm text-label-sm font-bold">
                HYBRID MODE
              </span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm pt-0.5">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                Offline Core: 3.4B Tensor (Ready)
              </span>
              <span className="text-secondary font-label-sm text-label-sm tracking-widest">
                CLOUD SYNC: 14ms
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Access & Critical Permissions Tier */}
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between px-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary-container text-[18px]">
              security
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Hardware &amp; Multimodal Trays
            </h2>
          </div>
          <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-widest font-bold">
            5 / 5 ACTIVE
          </span>
        </div>

        <div className="flex flex-col gap-space-xs">
          {/* 1. Microphone */}
          <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between gap-space-md transition-all hover:bg-surface-container border border-primary-container/10">
            <div className="flex items-start gap-space-md min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary-container shadow-[0_0_12px_rgba(0,240,255,0.2)]">
                <span className="material-symbols-outlined text-[20px]">mic</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-lg text-label-lg text-on-surface">
                    Microphone Subsystem
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping" />
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                  Continuous "Hey Shree" hotword detection &amp; Hindi voice engine active
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('microphone')}
              role="switch"
              aria-checked={localSettings.hardwareToggles.microphone}
              className={`shrink-0 w-12 h-7 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                localSettings.hardwareToggles.microphone
                  ? 'bg-primary-container shadow-[0_0_14px_rgba(0,240,255,0.45)]'
                  : 'bg-surface-container-highest'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-on-primary transition-transform duration-200 flex items-center justify-center ${
                  localSettings.hardwareToggles.microphone ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[14px] ${
                    localSettings.hardwareToggles.microphone
                      ? 'text-primary-container'
                      : 'text-outline'
                  }`}
                >
                  {localSettings.hardwareToggles.microphone ? 'check' : 'close'}
                </span>
              </div>
            </button>
          </div>

          {/* 2. Camera */}
          <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between gap-space-md transition-all hover:bg-surface-container border border-primary-container/10">
            <div className="flex items-start gap-space-md min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-secondary shadow-[0_0_12px_rgba(0,162,253,0.15)]">
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-lg text-label-lg text-on-surface">
                    Camera &amp; Vision Scanner
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-surface-container-highest text-outline font-label-sm text-label-sm">
                    SECURE LED
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Live multimodal HUD scene deciphering &amp; OCR pipeline
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('camera')}
              role="switch"
              aria-checked={localSettings.hardwareToggles.camera}
              className={`shrink-0 w-12 h-7 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                localSettings.hardwareToggles.camera
                  ? 'bg-primary-container shadow-[0_0_14px_rgba(0,240,255,0.45)]'
                  : 'bg-surface-container-highest'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-on-primary transition-transform duration-200 flex items-center justify-center ${
                  localSettings.hardwareToggles.camera ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[14px] ${
                    localSettings.hardwareToggles.camera ? 'text-primary-container' : 'text-outline'
                  }`}
                >
                  {localSettings.hardwareToggles.camera ? 'check' : 'close'}
                </span>
              </div>
            </button>
          </div>

          {/* 3. Location */}
          <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between gap-space-md transition-all hover:bg-surface-container border border-primary-container/10">
            <div className="flex items-start gap-space-md min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary-container">
                <span className="material-symbols-outlined text-[20px]">explore</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-lg text-label-lg text-on-surface">
                  Precision Location &amp; GPS
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Sub-meter Google Maps sync for contextual transit triggers
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('gps')}
              role="switch"
              aria-checked={localSettings.hardwareToggles.gps}
              className={`shrink-0 w-12 h-7 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                localSettings.hardwareToggles.gps
                  ? 'bg-primary-container shadow-[0_0_14px_rgba(0,240,255,0.45)]'
                  : 'bg-surface-container-highest'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-on-primary transition-transform duration-200 flex items-center justify-center ${
                  localSettings.hardwareToggles.gps ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[14px] ${
                    localSettings.hardwareToggles.gps ? 'text-primary-container' : 'text-outline'
                  }`}
                >
                  {localSettings.hardwareToggles.gps ? 'check' : 'close'}
                </span>
              </div>
            </button>
          </div>

          {/* 4. Contacts & WhatsApp Automation */}
          <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between gap-space-md transition-all hover:bg-surface-container border border-primary-container/10">
            <div className="flex items-start gap-space-md min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-secondary">
                <span className="material-symbols-outlined text-[20px]">mark_chat_read</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-lg text-label-lg text-on-surface">
                  Contacts &amp; WhatsApp Relay
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Hands-free voice transcription, message drafts &amp; dispatch
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('contacts')}
              role="switch"
              aria-checked={localSettings.hardwareToggles.contacts}
              className={`shrink-0 w-12 h-7 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                localSettings.hardwareToggles.contacts
                  ? 'bg-primary-container shadow-[0_0_14px_rgba(0,240,255,0.45)]'
                  : 'bg-surface-container-highest'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-on-primary transition-transform duration-200 flex items-center justify-center ${
                  localSettings.hardwareToggles.contacts ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[14px] ${
                    localSettings.hardwareToggles.contacts
                      ? 'text-primary-container'
                      : 'text-outline'
                  }`}
                >
                  {localSettings.hardwareToggles.contacts ? 'check' : 'close'}
                </span>
              </div>
            </button>
          </div>

          {/* 5. Background Daemon */}
          <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between gap-space-md transition-all hover:bg-surface-container border border-primary-container/10">
            <div className="flex items-start gap-space-md min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary-container">
                <span className="material-symbols-outlined text-[20px]">sync</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-lg text-label-lg text-on-surface">
                  Daemon Autostart &amp; Keep-Alive
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Persistent OS foreground notification keeps voice worker alive
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('background')}
              role="switch"
              aria-checked={localSettings.hardwareToggles.background}
              className={`shrink-0 w-12 h-7 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                localSettings.hardwareToggles.background
                  ? 'bg-primary-container shadow-[0_0_14px_rgba(0,240,255,0.45)]'
                  : 'bg-surface-container-highest'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-on-primary transition-transform duration-200 flex items-center justify-center ${
                  localSettings.hardwareToggles.background ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[14px] ${
                    localSettings.hardwareToggles.background
                      ? 'text-primary-container'
                      : 'text-outline'
                  }`}
                >
                  {localSettings.hardwareToggles.background ? 'check' : 'close'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Voice & Linguistics Matrix */}
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between px-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary-container text-[18px]">
              record_voice_over
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Acoustic &amp; Linguistics Matrix
            </h2>
          </div>
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
            NEURAL TTS v2
          </span>
        </div>

        {/* Primary Dialect Selector */}
        <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-md border border-primary-container/15">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-bold">
              Primary Linguistic Mode
            </span>
            <span className="font-label-sm text-label-sm text-primary-container font-semibold">
              Auto Code-Switching ON
            </span>
          </div>

          <div className="grid grid-cols-2 gap-space-xs">
            {/* Hinglish */}
            <button
              onClick={() => handleLangChange('hinglish', 'Hindi / Hinglish')}
              className={`p-space-sm rounded-lg text-left flex flex-col gap-0.5 transition-all ${
                localSettings.primaryLang === 'hinglish'
                  ? 'bg-surface-container-high shadow-[0_0_12px_rgba(0,240,255,0.25)] border border-primary-container/40'
                  : 'bg-surface-container opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-label-md text-label-md ${
                    localSettings.primaryLang === 'hinglish' ? 'text-primary font-bold' : 'text-on-surface'
                  }`}
                >
                  Hindi / Hinglish
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    localSettings.primaryLang === 'hinglish'
                      ? 'bg-primary-container'
                      : 'bg-transparent'
                  }`}
                />
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Default ("नमस्ते, क्या मदद?")
              </span>
            </button>

            {/* English India */}
            <button
              onClick={() => handleLangChange('english', 'English (India)')}
              className={`p-space-sm rounded-lg text-left flex flex-col gap-0.5 transition-all ${
                localSettings.primaryLang === 'english'
                  ? 'bg-surface-container-high shadow-[0_0_12px_rgba(0,240,255,0.25)] border border-primary-container/40'
                  : 'bg-surface-container opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-label-md text-label-md ${
                    localSettings.primaryLang === 'english' ? 'text-primary font-bold' : 'text-on-surface'
                  }`}
                >
                  English (India)
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    localSettings.primaryLang === 'english'
                      ? 'bg-primary-container'
                      : 'bg-transparent'
                  }`}
                />
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Standard IN Phonetics
              </span>
            </button>

            {/* Marathi */}
            <button
              onClick={() => handleLangChange('marathi', 'Marathi')}
              className={`p-space-sm rounded-lg text-left flex flex-col gap-0.5 transition-all ${
                localSettings.primaryLang === 'marathi'
                  ? 'bg-surface-container-high shadow-[0_0_12px_rgba(0,240,255,0.25)] border border-primary-container/40'
                  : 'bg-surface-container opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-label-md text-label-md ${
                    localSettings.primaryLang === 'marathi' ? 'text-primary font-bold' : 'text-on-surface'
                  }`}
                >
                  Marathi (मराठी)
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    localSettings.primaryLang === 'marathi'
                      ? 'bg-primary-container'
                      : 'bg-transparent'
                  }`}
                />
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Western Tensor Pack
              </span>
            </button>

            {/* Gujarati */}
            <button
              onClick={() => handleLangChange('gujarati', 'Gujarati')}
              className={`p-space-sm rounded-lg text-left flex flex-col gap-0.5 transition-all ${
                localSettings.primaryLang === 'gujarati'
                  ? 'bg-surface-container-high shadow-[0_0_12px_rgba(0,240,255,0.25)] border border-primary-container/40'
                  : 'bg-surface-container opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-label-md text-label-md ${
                    localSettings.primaryLang === 'gujarati' ? 'text-primary font-bold' : 'text-on-surface'
                  }`}
                >
                  Gujarati (ગુજરાતી)
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    localSettings.primaryLang === 'gujarati'
                      ? 'bg-primary-container'
                      : 'bg-transparent'
                  }`}
                />
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Indic Voice Core v1.2
              </span>
            </button>
          </div>

          {/* Persona Selector Segment */}
          <div className="flex flex-col gap-space-xs pt-space-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
              AI Voice Persona
            </span>
            <div className="grid grid-cols-2 gap-space-sm">
              <button
                onClick={() => handlePersonaChange('female', 'Shree Female (Natural Hindi Voice)')}
                className={`p-space-sm rounded-lg flex items-center gap-space-sm transition-all ${
                  localSettings.voicePersona === 'female'
                    ? 'bg-surface-container-high shadow-[0_0_12px_rgba(0,240,255,0.25)] border border-primary-container/40'
                    : 'bg-surface-container opacity-60 hover:opacity-100'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container shrink-0">
                  <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-label-md text-label-md text-primary truncate font-bold">
                      Shree - Female
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    Natural Hindi Voice
                  </span>
                </div>
              </button>

              <button
                onClick={() => handlePersonaChange('male', 'Shree Male (Deep JARVIS)')}
                className={`p-space-sm rounded-lg flex items-center gap-space-sm transition-all ${
                  localSettings.voicePersona === 'male'
                    ? 'bg-surface-container-high shadow-[0_0_12px_rgba(0,240,255,0.2)] border border-primary-container/40'
                    : 'bg-surface-container opacity-60 hover:opacity-100'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface shrink-0">
                  <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="font-label-md text-label-md text-on-surface truncate font-bold">
                    Shree - Male
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    Deep JARVIS Timbre
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Telemetry Acoustic Sliders */}
          <div className="flex flex-col gap-space-md pt-space-xs">
            {/* Speed Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface tracking-wider uppercase font-bold">
                  Speech Velocity
                </span>
                <span className="font-label-sm text-label-sm text-primary-container font-semibold">
                  {localSettings.speechVelocity.toFixed(2)}x NOMINAL
                </span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.50"
                step="0.05"
                value={localSettings.speechVelocity}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container"
              />
            </div>

            {/* Pitch Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface tracking-wider uppercase font-bold">
                  Vocal Resonance / Pitch
                </span>
                <span className="font-label-sm text-label-sm text-primary-container font-semibold">
                  {localSettings.vocalPitch > 0 ? '+' : ''}
                  {localSettings.vocalPitch.toFixed(1)} ST RESONANT
                </span>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="0.5"
                value={localSettings.vocalPitch}
                onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Security Shield */}
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between px-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary-container text-[18px]">
              verified_user
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Sentinel Cryptographic Shield
            </h2>
          </div>
          <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">
            ISOLATED ENCLAVE
          </span>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-md border border-primary-container/15">
          {/* On-device processing */}
          <div className="flex items-center justify-between gap-space-md">
            <div className="flex items-start gap-space-md min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary-container">
                <span className="material-symbols-outlined text-[20px]">dns</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-lg text-label-lg text-on-surface">
                  Local On-Device Processing
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Process confidential voice &amp; queries directly on hardware without external relays
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const nextVal = !localSettings.localProcessing;
                setLocalSettings({ ...localSettings, localProcessing: nextVal });
                onUpdateSettings({ localProcessing: nextVal });
                onToast(`LOCAL ON-DEVICE ENGINE: ${nextVal ? 'ENABLED' : 'DISABLED'}`);
              }}
              role="switch"
              aria-checked={localSettings.localProcessing}
              className={`shrink-0 w-12 h-7 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                localSettings.localProcessing
                  ? 'bg-primary-container shadow-[0_0_14px_rgba(0,240,255,0.45)]'
                  : 'bg-surface-container-highest'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-on-primary transition-transform duration-200 flex items-center justify-center ${
                  localSettings.localProcessing ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[14px] ${
                    localSettings.localProcessing ? 'text-primary-container' : 'text-outline'
                  }`}
                >
                  {localSettings.localProcessing ? 'check' : 'close'}
                </span>
              </div>
            </button>
          </div>

          {/* AES Status Card */}
          <div className="p-space-sm rounded-lg bg-surface-container flex items-center justify-between border border-primary-container/10">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary-fixed text-[20px]">lock</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface">
                  Voice Data Encryption: AES-256
                </span>
                <span className="font-body-sm text-body-sm text-outline">
                  Hardware-bound Android KeyStore Level 3
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-primary-container/15 text-primary font-label-sm text-label-sm tracking-wider font-bold">
              ACTIVE
            </span>
          </div>

          {/* Action Button: Cache Wipe */}
          <button
            onClick={handleClearCache}
            className="w-full p-space-sm rounded-lg bg-surface-container-high hover:bg-error-container/20 text-on-surface flex items-center justify-center gap-space-sm transition-all group active:scale-[0.98] border border-error/20"
            type="button"
          >
            <span className="material-symbols-outlined text-error text-[20px] transition-transform group-hover:scale-110">
              delete_sweep
            </span>
            <span className="font-label-md text-label-md text-error tracking-wide uppercase font-bold">
              Clear Voice History &amp; Chat Cache
            </span>
          </button>
        </div>
      </div>

      {/* Developer & Engine Diagnostics Meta Card */}
      <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-sm shadow-sm border border-primary-container/15">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-outline text-[16px]">terminal</span>
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest font-bold">
              Android Studio Build Runtime
            </span>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
            <span className="font-label-sm text-label-sm uppercase font-bold">Foreground Alive</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-space-xs text-on-surface-variant pt-space-xs">
          <div className="flex flex-col p-space-xs rounded bg-surface-container border border-primary/5">
            <span className="font-label-sm text-label-sm text-outline font-bold">
              TARGET SDK SPEC
            </span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              SDK 34 (Android 14/15 UpsideDownCake)
            </span>
          </div>
          <div className="flex flex-col p-space-xs rounded bg-surface-container border border-primary/5">
            <span className="font-label-sm text-label-sm text-outline font-bold">
              SERVICE STATUS
            </span>
            <span className="font-label-md text-label-md text-primary font-semibold">
              ShreeVoiceForegroundService: RUNNING
            </span>
          </div>
          <div className="flex flex-col p-space-xs rounded bg-surface-container border border-primary/5">
            <span className="font-label-sm text-label-sm text-outline font-bold">
              NEURAL ENGINE BUILD
            </span>
            <span className="font-label-md text-label-md text-on-surface">
              ShreeCore-Release_v4.2.89
            </span>
          </div>
          <div className="flex flex-col p-space-xs rounded bg-surface-container border border-primary/5">
            <span className="font-label-sm text-label-sm text-outline font-bold">
              HARDWARE ACCELERATION
            </span>
            <span className="font-label-md text-label-md text-secondary font-semibold">
              Qualcomm NPU / NNAPI v1.3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
